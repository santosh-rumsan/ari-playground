import * as ariClient from "ari-client";
import * as http from "http";

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
        channel.on("StasisStart", (event) => {
          const playback1 = channel.play(
            {
              media: "recording:congrats",
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

    // Subscribe to ARI events
    client.start("app-name");
  }
);

// Create HTTP server to keep application running
http.createServer().listen(3000);
