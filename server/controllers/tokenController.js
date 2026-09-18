const tokenLedger = require("../services/tokenLedger");

const mintTokens = (req, res) => {
  try {
    const { to, amount } = req.body;

    const result = tokenLedger.mint(to, amount);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const transferTokens = (req, res) => {
  try {
    const { from, to, amount } = req.body;

    const result = tokenLedger.transfer(from, to, amount);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBalance = (req, res) => {
  try {
    const { address } = req.params;

    const balance = tokenLedger.getBalance(address);

    return res.status(200).json({
      success: true,
      address: address.toLowerCase(),
      balance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTotalSupply = (req, res) => {
  return res.status(200).json({
    success: true,
    totalSupply: tokenLedger.getTotalSupply(),
  });
};

module.exports = {
  mintTokens,
  transferTokens,
  getBalance,
  getTotalSupply,
};
