const express = require("express");
const cors = require("cors");
const { jwt } = require("twilio");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

app.post("/token", (req, res) => {
  const { identity, room } = req.body;

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  token.identity = identity;

  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);

  res.send({ token: token.toJwt() });
});

app.listen(5000, () => console.log("Token server running on http://localhost:5000"));
