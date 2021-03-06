require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const sendMessage = async (message, numbers) => {
  return axios({
    method: "post",
    url: "https://www.fast2sms.com/dev/bulkV2",
    headers: {
      authorization: process.env.SMS_KEY,
      "Content-Type": "application/json",
    },
    data: {
      sender_id: "TXTIND",
      numbers: numbers
        .map((phone) =>
          phone.startsWith("+91")
            ? phone.slice(3)
            : phone.startsWith("0")
            ? phone.slice(1)
            : phone
        )
        .join(","),
      route: "v3",
      message,
    },
  });
};

app.post("/api/send-bulk-sms", (req, res) => {
  sendMessage(req.body.message, req.body.numbers)
    .then((response) => {
      return res.send(response.data);
    })
    .catch((err) => {
      console.log(err)
      return res.status(400).send(err.response.data);
    });
});

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
