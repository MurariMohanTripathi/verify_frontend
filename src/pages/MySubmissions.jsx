import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ExternalLink, Loader2, Newspaper, Plus, ShieldCheck } from "lucide-react";
import { auth } from "../firebase";
import AuthModal from "../components/AuthModal";
import { getMyNews } from "../services/backendAPI";

export default function MySubmissions() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadSubmissions = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getMyNews();
        setSubmissions(data);
      } catch (err) {
        console.error("My submissions error:", err);
        setError(err.response?.data?.message || "Unable to load your submissions.");
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [user]);

  const stats = useMemo(() => {
    return submissions.reduce(
      (total, item) => {
        total.submissions += 1;
        total.trueVotes += item.votes?.true || 0;
        total.falseVotes += item.votes?.false || 0;
        total.reviewVotes += item.votes?.review || 0;
        total.avgCredibility += item.moderation?.credibilityScore || 0;
        return total;
      },
      { submissions: 0, trueVotes: 0, falseVotes: 0, reviewVotes: 0, avgCredibility: 0 }
    );
  }, [submissions]);

  const averageCredibility = stats.submissions
    ? Math.round(stats.avgCredibility / stats.submissions)
    : 0;

  if (!authReady) {
    return (
      <div className="app-page flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-page px-4 py-10">
        <div className="app-shell">
          <div className="app-card mx-auto max-w-xl p-6 text-center">
            <Newspaper className="mx-auto h-10 w-10" style={{ color: "var(--app-accent)" }} />
            <h1 className="mt-4 text-2xl font-bold">My Submissions</h1>
            <p className="app-muted mt-2">
              Log in to see the news claims you submitted for community verification.
            </p>
            <button onClick={() => setShowAuthModal(true)} className="app-button mt-5 px-5 py-2">
              Login / Sign Up
            </button>
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="app-page px-4 py-8 sm:px-6 lg:py-10">
      <div className="app-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="app-muted text-sm font-semibold uppercase tracking-wide">Your activity</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">My Submissions</h1>
            <p className="app-muted mt-2 max-w-2xl">
              Track the claims you submitted, their AI moderation scores, and community voting response.
            </p>
          </div>
          <Link to="/submit-news" className="app-button px-5 py-2">
            <Plus className="h-4 w-4" />
            Submit News
          </Link>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Newspaper} label="Submissions" value={stats.submissions} />
          <StatCard icon={ShieldCheck} label="Avg credibility" value={`${averageCredibility}%`} />
          <StatCard icon={BarChart3} label="True votes" value={stats.trueVotes} />
          <StatCard icon={BarChart3} label="Needs review" value={stats.reviewVotes} />
        </div>

        {error && (
          <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        {loading ? (
          <div className="app-card flex items-center justify-center gap-3 p-8">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="app-card p-8 text-center">
            <Newspaper className="mx-auto h-10 w-10" style={{ color: "var(--app-accent)" }} />
            <h2 className="mt-4 text-xl font-semibold">No submissions yet</h2>
            <p className="app-muted mt-2">
              Your future approved submissions will appear here. Older submissions made before login tracking cannot be linked automatically.
            </p>
            <Link to="/submit-news" className="app-button mt-5 px-5 py-2">
              Submit your first claim
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {submissions.map((item) => (
              <SubmissionCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="app-card p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "var(--app-accent-soft)" }}>
        <Icon className="h-5 w-5" style={{ color: "var(--app-accent)" }} />
      </div>
      <p className="app-muted text-sm">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function SubmissionCard({ item }) {
  const createdAt = new Date(item.createdAt).toLocaleString();
  const totalVotes = (item.votes?.true || 0) + (item.votes?.false || 0) + (item.votes?.review || 0);

  return (
    <article className="app-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="app-muted mt-1 text-sm">{createdAt}</p>
        </div>
        {item.url && (
          <a href={item.url} target="_blank" rel="noreferrer" className="app-panel inline-flex h-10 w-10 shrink-0 items-center justify-center" title="Open source">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Score label="Credibility" value={item.moderation?.credibilityScore} />
        <Score label="Safety" value={item.moderation?.safetyScore} />
        <Score label="Votes" value={totalVotes} suffix="" />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <VotePill label="True" value={item.votes?.true || 0} className="bg-green-500/15 text-green-200" />
        <VotePill label="False" value={item.votes?.false || 0} className="bg-red-500/15 text-red-200" />
        <VotePill label="Review" value={item.votes?.review || 0} className="bg-yellow-500/15 text-yellow-100" />
      </div>

      {item.moderation?.summary && <p className="app-muted mt-4 text-sm">{item.moderation.summary}</p>}
    </article>
  );
}

function Score({ label, value, suffix = "%" }) {
  return (
    <div className="app-panel px-3 py-2">
      <p className="app-muted text-xs">{label}</p>
      <p className="mt-1 font-bold">{value ?? "-"}{value == null ? "" : suffix}</p>
    </div>
  );
}

function VotePill({ label, value, className }) {
  return <span className={`rounded-lg px-3 py-2 text-sm font-semibold ${className}`}>{label}: {value}</span>;
}
