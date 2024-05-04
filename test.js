var client = require("ari-client");

// Define your Asterisk server connection parameters
const asteriskConfig = {
  username: "rumsan", // Your Asterisk username
  password: "temp9670", // Your Asterisk password
  hostname: "192.168.9.71", // Your Asterisk server hostname
  port: 8088, // Your Asterisk ARI port
};

var ENDPOINT = "SIP/9670";

// replace ari.js with your Asterisk instance
console.log("xxxxxxxxxxx");
client.connect(
  `http://${asteriskConfig.hostname}:${asteriskConfig.port}/ari`,
  asteriskConfig.username,
  asteriskConfig.password,
  /**
   *  Setup event listeners and start application.
   *
   *  @callback connectCallback
   *  @memberof originate-example
   *  @param {Error} err - error object if any, null otherwise
   *  @param {module:ari-client~Client} ari - ARI client
   */
  function (err, ari) {
    console.log(ari);
    ari
      .channels()
      .originate("SIP/GOIP1/41%2B9779801109670")
      .setExtension("mobile_n2")
      .setContext("from-internal")
      .setCallerId("222")
      .execute();
  }
);

// client
//   .connect(
//     `http://${asteriskConfig.hostname}:${asteriskConfig.port}/ari`,
//     asteriskConfig.username,
//     asteriskConfig.password
//   )
//   .then((ari) => {
//     var channel = ari.Channel();
//     return channel.originate({
//       endpoint: "SIP/101",
//       extension: "102",
//       context: "internal",
//       priority: "1",
//     });
//   })
//   .then((channel) => {
//     console.log("channel:", channel);
//   })
//   .catch((err) => {
//     console.log("err:", err);
//   });
