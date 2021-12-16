require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const _sendMessage = async (message, numbers) => {
  const nums = numbers.join(",");
  const url = "https://www.fast2sms.com/dev/bulkV2";
  try {
    const response = await axios.post(
      url,
      {
        numbers: nums,
        senderId: "AAMDHA",
        route: "p",
        message,
      },
      {
        headers: {
          "cache-control": "no-cache",
          authorization: process.env.SMS_KEY,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error.response?.data;
  }
};

const sendMessage = async (msg, phone) => {
  return _sendMessage(msg, [
    phone.startsWith("+91") ? phone.slice(3) : phone,
  ]).then((_res) => {
    return;
  });
};

app.post("/api/send-bulk-sms", (req, res) => {
  const numbers = req.body.numbers;
  for (const phone of numbers) {
    sendMessage(req.body.message, phone);
  }
  res.json({
    message: "Message sent to all numbers",
  });
});

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
