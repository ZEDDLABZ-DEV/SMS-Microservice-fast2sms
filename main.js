require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const fast2sms = require("fast-two-sms");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const sendMessage = async (message, numbers) => {
  return fast2sms.sendMessage({
    authorization: process.env.SMS_KEY,
    language: 'unicode',
    message,
    numbers: numbers.map((phone) =>
      phone.startsWith("+91")
        ? phone.slice(3)
        : phone.startsWith("0")
        ? phone.slice(1)
        : phone
    ),
  });
};

app.post("/api/send-bulk-sms", (req, res) => {
  sendMessage(req.body.message, req.body.numbers).then((response) => {
    return res.send(response);
  });
});

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
