//ffmpeg -hide_banner -loglevel error -y -i test_broadcast.mp3 -ac 1 -ar 8000 test_broadcast.wav

//Redis
// Check ports sudo lsof -i -P -n | grep LISTEN
// Install using snap
// sudo snap install redis
// redis.cli

import * as ariClient from "ari-client";
import * as http from "http";

// Create ARI client and start listening for events
ariClient.connect(
  "http://192.168.1.108:8088/ari",
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
        //endpoint: "SIP/GOIP1/43+9779801109670",
        //endpoint: "SIP/callcentric/13309670033",
        endpoint: "PJSIP/701",
        //endpoint: "SIP/0967009779845160080@sbc.anveo.com",
        //extension: "702",
        app: "app-name",
        context: "from-internal",
        callerId: "Rumsan Test<+9779860341451>",
        priority: 1,
      },
      (err, channel) => {
        channel.on("StasisStart", (event) => {
          const playback1 = channel.play(
            {
              //media: "sound:/var/spool/asterisk/rumsan/raktim_santosh_demo",
              media: "recording:bb56d70d-fba9-4d9e-9b00-656e7734339d"
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
