const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const API_KEY = "ab6c5a6ed9272683360eccdc1d49a933-1b3a03f6-78c381c1";
const DOMAIN = "sandboxf16c04dfb34d49a6832e19f795db5f01.mailgun.org";

const client = mailgun.client({ username: "api", key: API_KEY });

const messageData = {
  from: "Decision Maker<admin@decision-maker.com>",
  to: "archana.agrawal3@gmail.com",
  subject: "Hello",
  text: "Testing some Mailgun awesomeness!",
};

client.messages
  .create(DOMAIN, messageData)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
