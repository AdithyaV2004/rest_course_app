import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Alert from "../components/Alert";

export default function WalletPage() {
  const { token, user, refreshProfile } = useAuth();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setSubmitting(true);
    try {
      await api.addMoney(token, numericAmount);
      setSuccess(`₹${numericAmount} added to your wallet.`);
      setAmount("");
      refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-stone-900">Wallet</h1>
        <p className="text-sm text-stone-500">Top up your balance to purchase courses.</p>
      </div>

      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Current balance</p>
        <p className="mt-1 text-3xl font-semibold text-stone-900">₹{user?.wallet ?? 0}</p>
      </div>

      <div className="max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-stone-900">Add money</h2>

        <Alert>{error}</Alert>
        <Alert type="success">{success}</Alert>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Amount</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
          >
            {submitting ? "Adding…" : "Add money"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
