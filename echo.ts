// https://docs.asterisk.org/Configuration/Interfaces/Asterisk-REST-Interface-ARI/Introduction-to-ARI-and-Media-Manipulation/
// https://docs.asterisk.org/Configuration/Interfaces/Asterisk-REST-Interface-ARI/Introduction-to-ARI-and-Channels/ARI-and-Channels-Simple-Media-Manipulation/

import * as ariClient from "ari-client";
import * as http from "http";

// Function to handle incoming calls
function handleIncomingCall(
  channel: ariClient.Channel,
  event: ariClient.ChannelEnteredBridge
) {
  // Answer the incoming call
  channel.answer();

  // Play the IVR TwiML
  //   channel.play({ media: ivrTwiML }, () => {
  //     // IVR TwiML playback complete
  //     console.log("IVR TwiML playback complete");
  //   });
}

// ARI event handling
const events: any = {
  StasisStart: handleIncomingCall,
};

// Create ARI client and start listening for events
ariClient.connect(
  "http://192.168.1.71:8088/ari",
  "rumsan",
  "temp9670",
  (err, client) => {
    if (err) {
      throw err;
    }

    var playback = client.Playback();
    var liveRecording = client.LiveRecording();

    client.channels.originate(
      {
        //endpoint: "SIP/GOIP1/41+9779801109670",
        endpoint: "SIP/cellcentric/17772927336110",
        //endpoint: "PJSIP/701",
        //extension: "702",
        app: "app-name",
        context: "from-internal",
        callerId: "Rumsan Test<9670>",
        priority: 1,
      },
      (err, channel) => {
        function cleanup() {
          channel.removeListener("ChannelDtmfReceived", on_dtmf);
        }

        function on_dtmf(event: any, channel: any) {
          switch (event.digit) {
            case "#":
              console.log("Accepted recording");
              cleanup();
              liveRecording.stop(function (err) {
                if (err) {
                  console.error(err);
                }
              });
              break;
          }
        }

        channel.on("StasisStart", (event) => {
          channel.on("ChannelDtmfReceived", on_dtmf);
          channel.record(
            {
              beep: true,
              name: "my_recording",
              format: "wav",
              ifExists: "overwrite",
            },
            liveRecording,
            (err, liveRecording) => {
              if (err) {
                console.error(err);
              }
              liveRecording.on("RecordingFinished", (event) => {
                console.log("Recording finished");
                console.log(event);

                console.log(liveRecording.name);

                const playback1 = channel.play(
                  {
                    media: "recording:" + event.recording.name,
                  },
                  playback,
                  () => {
                    // IVR TwiML playback complete
                    console.log("IVR TwiML playback complete");
                  }
                );
                playback.once("PlaybackFinished", () => {
                  console.log("Sound file playback finished");
                  // You can perform additional actions here after the playback finishes
                });
                // You can perform additional actions here after the recording finishes
              });
            }
          );

          //   const playback1 = channel.play(
          //     {
          //       media: "recording:1d110693-ad7c-4e3a-a897-09eaebb63ded",
          //     },
          //     playback,
          //     () => {
          //       // IVR TwiML playback complete
          //       console.log("IVR TwiML playback complete");
          //     }
          //   );
          //   playback.once("PlaybackFinished", () => {
          //     console.log("Sound file playback finished");
          //     // You can perform additional actions here after the playback finishes
          //   });
          console.log("StasisStart event");
        });

        channel.on("StasisEnd", (event) => {
          console.log("StasisEnd event");
          process.exit(0);
        });
        // channel.play({ media: ivrTwiML }, playback, () => {
        //   // IVR TwiML playback complete
        //   console.log("IVR TwiML playback complete");
        // });
      }
    );

    // Handle ARI events
    client.on(
      "ChannelEnteredBridge",
      (event: ariClient.ChannelEnteredBridge) => {
        const handler = events[event.type];
        if (handler) {
          const channel = event.channel;
          handler(channel, event);
        }
      }
    );

    // Subscribe to ARI events
    client.start("app-name");
  }
);

// Create HTTP server to keep application running
http.createServer().listen(3000);
