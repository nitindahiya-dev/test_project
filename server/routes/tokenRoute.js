const express = require("express");

const {
  mintTokens,
  transferTokens,
  getBalance,
  getTotalSupply,
} = require("../controllers/tokenController");

const router = express.Router();

router.post("/mint", mintTokens);

router.post("/transfer", transferTokens);

router.get("/balance/:address", getBalance);

router.get("/supply", getTotalSupply);

module.exports = router;
