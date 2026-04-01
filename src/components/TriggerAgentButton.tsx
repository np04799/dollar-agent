"use client";

import { useState } from "react";

export default function TriggerAgentButton() {
  const [loading, setLoading] = useState(false);

  async function runAgent() {
    setLoading(true);
    try {
      const res = await fetch("/api/check-rate?secret=nitesh123");
      if (!res.ok) throw new Error("Failed");

      alert("Agent triggered and email sent!");
    } catch (err) {
      alert("Failed to trigger agent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={runAgent}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? "Running..." : "Run Agent & Send Email →"}
    </button>
  );
}