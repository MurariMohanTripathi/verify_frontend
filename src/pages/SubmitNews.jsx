import { useState } from "react";
import { submitNews } from "../services/backendAPI";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Link2, Loader2, Newspaper, Send, ShieldCheck } from "lucide-react";

export default function SubmitNews() {
  const [form, setForm] = useState({
    title: "",
    url: "",
    source: "",
    submittedBy: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);

    try {
      const result = await submitNews(form);
      setNotice({
        type: "success",
        message: result.message || "News submitted successfully.",
        moderation: result.moderation,
      });
      setForm({ title: "", url: "", source: "", submittedBy: "" });
    } catch (err) {
      console.log("Submit Error:", err);
      setNotice({
        type: "error",
        message:
          err.response?.data?.message ||
          "Unable to submit this news right now. Please try again.",
        moderation: err.response?.data?.moderation,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-page px-4 py-8 sm:px-6 lg:py-12">
      <div className="app-shell grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-5 lg:sticky lg:top-28">
          <div>
            <p className="app-muted text-sm font-semibold uppercase tracking-wide">AI guarded submissions</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Submit News for Verification</h1>
            <p className="app-muted mt-3 max-w-xl">
              Claims are screened by Gemini for credibility, abusive language, sexual content, criminal instructions, and spam before they reach community voting.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <InfoTile icon={ShieldCheck} title="Safety gate" text="Unsafe or abusive claims are rejected." />
            <InfoTile icon={Newspaper} title="Credibility gate" text="Likely fake or low-quality claims stay out." />
            <InfoTile icon={Link2} title="Source aware" text="URLs and platforms are included in review." />
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="app-card p-5 sm:p-7"
        >

        {notice && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              notice.type === "success"
                ? "border-green-500/40 bg-green-500/10 text-green-100"
                : "border-red-500/40 bg-red-500/10 text-red-100"
            }`}
          >
            <div className="flex items-start gap-3">
              {notice.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              )}
              <div>
                <p className="font-semibold">{notice.message}</p>
                {notice.moderation && (
                  <p className="mt-1 text-xs opacity-90">
                    Credibility: {notice.moderation.credibilityScore}/100 | Safety:{" "}
                    {notice.moderation.safetyScore}/100
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">News Title *</label>
            <input
              type="text"
              className="app-input"
              placeholder="Enter headline"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">News URL (Optional)</label>
            <input
              type="text"
              className="app-input"
              placeholder="https://example.com/article"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Source / Platform</label>
            <input
              type="text"
              className="app-input"
              placeholder="Twitter, Instagram, Website, etc."
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Your Name (Optional)</label>
            <input
              type="text"
              className="app-input"
              placeholder="Anonymous"
              value={form.submittedBy}
              onChange={(e) => setForm({ ...form, submittedBy: e.target.value })}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={submitting}
            className="app-button w-full px-6 py-3"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {submitting ? "Checking with AI..." : "Submit News"}
          </motion.button>
        </form>
        </motion.div>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, title, text }) {
  return (
    <div className="app-panel p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "var(--app-accent-soft)" }}>
        <Icon className="h-5 w-5" style={{ color: "var(--app-accent)" }} />
      </div>
      <h2 className="font-semibold">{title}</h2>
      <p className="app-muted mt-1 text-sm">{text}</p>
    </div>
  );
}
