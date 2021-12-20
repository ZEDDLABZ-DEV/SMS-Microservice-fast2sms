require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const sendMessage = async (message, numbers) => {
  const nums = numbers.map(phone => phone.startsWith("+91") ? phone.slice(3) : phone).join(",");
  const url = "https://www.fast2sms.com/dev/bulkV2";
  try {
    const response = await axios.post(
      url,
      {
        numbers: nums,
        message,
      },
      {
        headers: {
          "cache-control": "no-cache",
          authorization: process.env.SMS_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

app.post("/api/send-bulk-sms", (req, res) => {
  sendMessage(req.body.message, req.body.numbers).then((response) => {
    return res.send(response)
  });
});

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
