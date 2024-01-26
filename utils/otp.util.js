let collection = [];
const fs = require("fs");
const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_PHONE } = require("../config");
const { SERVER_ERR } = require("../errors");
const fast2sms = require("fast-two-sms");
var unirest = require("unirest");

exports.generateOTP = (otp_length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";

  while (OTP.length < otp_length) {
    OTP = "";
    for (let i = 0; i < otp_length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
  }

  return OTP;
  //let OTP2 = parseInt(OTP)
  //return OTP2;
};

// exports.fast2sms = async ({ message, contactNumber }, next, res) => {
//   const accounSid = TWILIO_ACCOUNT_SID;
//   const authToken = TWILIO_AUTH_TOKEN;
//   const client = require("twilio")(accounSid, authToken);
//   await client.messages
//     .create({
//       body: message,
//       from: TWILIO_PHONE,
//       to: contactNumber,
//     })
//     .then(
//       (message) => {
//         //console.log(message.sid);
//         ////console.log("opt sent");
//         return message.sid;
//       },
//       (error) => //console.log({ status: 500, message: error})
//     );
// }

exports.fast2sms = async (otp, contactNumber) => {
  // //console.log("fast2sms started");
  var unirest = require("unirest");

  var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
  // //console.log(typeof otp);

  req.query({
    authorization: "mSqeyUGhtg2i3dnFzk6x8JfXo4YAaw0ENLsPHRBWlQbKZOvCuIHgAPkimoq09z7sGnT5wjMId1t6XEL3",
    //authorization: "kuM9ZYAPpRt0hFqVW71UbOxygli64dDrQzew3JLojN5HTfaIvskCR4bYSDAznIa6VxGmuq0ytT72LZ5f",
    variables_values: otp,
    route: "otp",
    numbers: contactNumber,
  });

  req.headers({
    "cache-control": "no-cache",
  });

  // req.end(function (res) {
  //   if (res.error)
  //     //throw res.error

  //     console.log(res.body);
  // });
};
