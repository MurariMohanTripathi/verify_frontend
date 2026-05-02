import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import {
  Bell,
  CheckCircle2,
  Loader2,
  LogOut,
  MonitorCog,
  RotateCcw,
  Save,
  Shield,
  User,
} from "lucide-react";
import { auth, signOut } from "../firebase";
import AuthModal from "../components/AuthModal";
import {
  accentOptions,
  textColorOptions,
  themeOptions,
  useTheme,
} from "../context/ThemeContext";

const defaultPreferences = {
  emailAlerts: true,
  showScores: true,
  compactVoting: false,
  reduceMotion: false,
};

export default function Settings() {
  const { theme, setTheme, resetTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      setDisplayName(currentUser?.displayName || "");
      setPhotoURL(currentUser?.photoURL || "");
    });

    const savedPreferences = localStorage.getItem("verifyNewsSettings");
    if (savedPreferences) {
      setPreferences({ ...defaultPreferences, ...JSON.parse(savedPreferences) });
    }

    return () => unsubscribe();
  }, []);

  const handlePreferenceChange = (key) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await updateProfile(user, {
        displayName: displayName.trim() || null,
        photoURL: photoURL.trim() || null,
      });
      localStorage.setItem("verifyNewsSettings", JSON.stringify(preferences));
      setMessage("Settings saved.");
    } catch (error) {
      console.error("Settings save error:", error);
      setMessage("Unable to save settings right now.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!authReady) {
    return (
      <div className="app-page flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="app-page px-4 py-8 sm:px-6 lg:py-10">
      <div className="app-shell">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="app-muted text-sm font-semibold uppercase tracking-wide">Account controls</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Settings</h1>
            <p className="app-muted mt-2 max-w-2xl">
              Manage your VERIFYNews profile, preferences, and app-wide theme.
            </p>
          </div>
          <button type="button" onClick={resetTheme} className="app-panel inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
            <RotateCcw className="h-4 w-4" />
            Reset Theme
          </button>
        </div>

        {!user ? (
          <div className="app-card p-6">
            <h2 className="text-xl font-semibold">Sign in required</h2>
            <p className="app-muted mt-2">Log in to manage your profile, preferences, and theme.</p>
            <button onClick={() => setShowAuthModal(true)} className="app-button mt-5 px-5 py-2">
              Login / Sign Up
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <section className="app-card p-5 sm:p-6">
                <SectionTitle icon={User} title="Profile" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Display name">
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="app-input"
                      placeholder="Your public name"
                    />
                  </Field>
                  <Field label="Photo URL">
                    <input
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="app-input"
                      placeholder="https://..."
                    />
                  </Field>
                  <Field label="Email">
                    <input value={user.email || ""} disabled className="app-input opacity-70" />
                  </Field>
                  <Field label="User ID">
                    <input value={user.uid} disabled className="app-input opacity-70" />
                  </Field>
                </div>
              </section>

              <section className="app-card p-5 sm:p-6">
                <SectionTitle icon={MonitorCog} title="Theme" />
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Theme mode</label>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {Object.entries(themeOptions).map(([key, option]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTheme({ mode: key })}
                          className={`app-panel min-h-20 p-3 text-left transition ${
                            theme.mode === key ? "ring-2" : ""
                          }`}
                          style={{ ringColor: "var(--app-accent)" }}
                        >
                          <span className="block font-semibold">{option.label}</span>
                          <span className="app-muted mt-1 block text-xs">
                            {key.startsWith("gradient") ? "Gradient background" : "Clean solid theme"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Theme color</label>
                    <div className="flex flex-wrap gap-3">
                      {accentOptions.map((accent) => (
                        <button
                          key={accent.value}
                          type="button"
                          onClick={() => setTheme({ accent: accent.value })}
                          className={`h-10 w-10 rounded-full border-2 ${
                            theme.accent === accent.value ? "border-white" : "border-transparent"
                          }`}
                          style={{ background: accent.value }}
                          title={accent.label}
                        />
                      ))}
                      <input
                        type="color"
                        value={theme.accent}
                        onChange={(e) => setTheme({ accent: e.target.value })}
                        className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent"
                        title="Custom color"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Text color</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {textColorOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setTheme({ textColor: option.value })}
                          className={`app-panel flex items-center justify-between px-4 py-3 text-left ${
                            theme.textColor === option.value ? "ring-2" : ""
                          }`}
                        >
                          <span>{option.label}</span>
                          <span
                            className="h-5 w-5 rounded-full border"
                            style={{
                              background:
                                option.value === "default" ? theme.palette.text : option.value,
                              borderColor: "var(--app-border)",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="app-card p-5 sm:p-6">
                <SectionTitle icon={Shield} title="Account" />
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user.displayName || user.email || "User"}&background=3b82f6&color=fff`
                    }
                    alt="Profile"
                    className="h-14 w-14 rounded-full border object-cover"
                    style={{ borderColor: "var(--app-accent)" }}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{user.displayName || "VERIFYNews user"}</p>
                    <p className="app-muted truncate text-sm">{user.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </section>

              <section className="app-card p-5 sm:p-6">
                <SectionTitle icon={Bell} title="Preferences" />
                <div className="space-y-3">
                  <Toggle label="Email alerts" checked={preferences.emailAlerts} onChange={() => handlePreferenceChange("emailAlerts")} />
                  <Toggle label="Show AI scores" checked={preferences.showScores} onChange={() => handlePreferenceChange("showScores")} />
                  <Toggle label="Compact voting layout" checked={preferences.compactVoting} onChange={() => handlePreferenceChange("compactVoting")} />
                  <Toggle label="Reduce motion" checked={preferences.reduceMotion} onChange={() => handlePreferenceChange("reduceMotion")} />
                </div>
              </section>

              <button type="submit" disabled={saving} className="app-button w-full px-5 py-3">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {saving ? "Saving..." : "Save Settings"}
              </button>

              {message && (
                <p className="app-panel flex items-center gap-2 px-4 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {message}
                </p>
              )}
            </aside>
          </form>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "var(--app-accent-soft)" }}>
        <Icon className="h-5 w-5" style={{ color: "var(--app-accent)" }} />
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="app-panel flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
      <span className="font-medium">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 accent-blue-600" />
    </label>
  );
}
