import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3099/api/token";

function TokenLedger() {
  const [address, setAddress] = useState("alice");
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);

  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const fetchBalance = async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    clearMessages();

    try {
      const response = await axios.get(
        `${API_URL}/balance/${encodeURIComponent(address.trim())}`
      );

      setBalance(response.data.balance);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch balance"
      );
    }
  };

  const fetchSupply = async () => {
    try {
      const response = await axios.get(`${API_URL}/supply`);
      setTotalSupply(response.data.totalSupply);
    } catch (err) {
      console.error("Failed to fetch total supply:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchSupply();
  }, []);

  const handleMint = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/mint`, {
        to: mintAddress,
        amount: Number(mintAmount),
      });

      setMessage(
        `Successfully minted ${response.data.amount} tokens to ${response.data.to}`
      );

      setMintAddress("");
      setMintAmount("");

      setTotalSupply(response.data.totalSupply);

      if (
        address.trim().toLowerCase() ===
        response.data.to.toLowerCase()
      ) {
        setBalance(response.data.balance);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Mint operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/transfer`, {
        from,
        to,
        amount: Number(transferAmount),
      });

      setMessage(
        `Successfully transferred ${response.data.amount} tokens from ${response.data.from} to ${response.data.to}`
      );

      setFrom("");
      setTo("");
      setTransferAmount("");

      if (
        address.trim().toLowerCase() ===
        response.data.from.toLowerCase()
      ) {
        setBalance(response.data.fromBalance);
      }

      if (
        address.trim().toLowerCase() ===
        response.data.to.toLowerCase()
      ) {
        setBalance(response.data.toBalance);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Transfer operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
            RentVerse
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Token Ledger
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl">
            Simulated token operations through the RentVerse API.
            This ledger does not require a blockchain, wallet, or RPC
            connection.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400 text-sm">Total Supply</p>

            <p className="text-4xl font-bold mt-2">
              {totalSupply}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              RVT tokens
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400 text-sm">
              Current Balance
            </p>

            <p className="text-4xl font-bold mt-2">
              {balance === null ? "—" : balance}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              {address || "No address selected"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5">
            Check Balance
          </h2>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className="flex-1 rounded-lg bg-black border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            />

            <button
              onClick={fetchBalance}
              className="rounded-lg bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition"
            >
              Check Balance
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleMint}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-semibold mb-5">
              Mint Tokens
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Recipient
                </label>

                <input
                  type="text"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  placeholder="alice"
                  required
                  className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  min="1"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  placeholder="1000"
                  required
                  className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white text-black py-3 font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Mint Tokens"}
              </button>
            </div>
          </form>

          <form
            onSubmit={handleTransfer}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-semibold mb-5">
              Transfer Tokens
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  From
                </label>

                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="alice"
                  required
                  className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  To
                </label>

                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="bob"
                  required
                  className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  min="1"
                  value={transferAmount}
                  onChange={(e) =>
                    setTransferAmount(e.target.value)
                  }
                  placeholder="250"
                  required
                  className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white text-black py-3 font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Transfer Tokens"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-3">
            API Integration
          </h2>

          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <span className="text-white">POST</span>{" "}
              /api/token/mint
            </p>

            <p>
              <span className="text-white">POST</span>{" "}
              /api/token/transfer
            </p>

            <p>
              <span className="text-white">GET</span>{" "}
              /api/token/balance/:address
            </p>

            <p>
              <span className="text-white">GET</span>{" "}
              /api/token/supply
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenLedger;
