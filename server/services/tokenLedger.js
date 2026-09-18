class TokenLedger {
  constructor() {
    this.balances = new Map();
    this.totalSupply = 0;
  }

  normalizeAddress(address) {
    if (typeof address !== "string" || !address.trim()) {
      throw new Error("Address is required");
    }

    return address.trim().toLowerCase();
  }

  validateAmount(amount) {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    return value;
  }

  getBalance(address) {
    const normalizedAddress = this.normalizeAddress(address);

    return this.balances.get(normalizedAddress) || 0;
  }

  mint(to, amount) {
    const address = this.normalizeAddress(to);
    const value = this.validateAmount(amount);

    const currentBalance = this.getBalance(address);
    const newBalance = currentBalance + value;

    this.balances.set(address, newBalance);
    this.totalSupply += value;

    return {
      success: true,
      operation: "mint",
      to: address,
      amount: value,
      balance: newBalance,
      totalSupply: this.totalSupply,
    };
  }

  transfer(from, to, amount) {
    const sender = this.normalizeAddress(from);
    const receiver = this.normalizeAddress(to);
    const value = this.validateAmount(amount);

    if (sender === receiver) {
      throw new Error("Sender and receiver cannot be the same");
    }

    const senderBalance = this.getBalance(sender);

    if (senderBalance < value) {
      throw new Error("Insufficient balance");
    }

    const receiverBalance = this.getBalance(receiver);

    this.balances.set(sender, senderBalance - value);
    this.balances.set(receiver, receiverBalance + value);

    return {
      success: true,
      operation: "transfer",
      from: sender,
      to: receiver,
      amount: value,
      fromBalance: senderBalance - value,
      toBalance: receiverBalance + value,
    };
  }

  getTotalSupply() {
    return this.totalSupply;
  }
}

module.exports = new TokenLedger();
