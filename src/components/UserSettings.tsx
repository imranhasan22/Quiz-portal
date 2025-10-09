import React, { useMemo, useState } from "react";
import { Camera, Link as LinkIcon, CheckCircle2, XCircle } from "lucide-react";

const Switch: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
}> = ({ checked, onChange, disabled, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={[
      "inline-flex h-6 w-11 items-center rounded-full transition",
      checked ? "bg-gray-900" : "bg-gray-300",
      disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90",
    ].join(" ")}
  >
    <span
      className={[
        "mx-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
        checked ? "translate-x-5" : "translate-x-0",
      ].join(" ")}
    />
  </button>
);

const UserSettings: React.FC = () => {
  /* ---- Profile state (stub) ---- */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false); 

  const handlePickAvatar = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      setIsDirty(true);
    };
    input.click();
  };

  /* ---- Notifications state ---- */
  const [allowEmail, setAllowEmail] = useState(false);
  const [notifComments, setNotifComments] = useState(false);
  const [notifNagad, setNotifNagad] = useState(false);

  // when master toggle OFF, dependent toggles are disabled
  const depsDisabled = useMemo(() => !allowEmail, [allowEmail]);

  // Update isDirty when any setting is changed
  const handleAllowEmailChange = (value: boolean) => {
    setAllowEmail(value);
    setIsDirty(true); // Mark as dirty when there's a change
  };

  const handleNotifCommentsChange = (value: boolean) => {
    setNotifComments(value);
    setIsDirty(true); // Mark as dirty when there's a change
  };

  const handleNotifNagadChange = (value: boolean) => {
    setNotifNagad(value);
    setIsDirty(true); // Mark as dirty when there's a change
  };

  /* ---- Popups ---- */
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const resetForm = () => {
    setAvatarUrl(null);
    setAllowEmail(false);
    setNotifComments(false);
    setNotifNagad(false);
    setIsDirty(false); // Reset isDirty state when resetting form
  };

  const validate = () => {
    if (!allowEmail && (notifComments || notifNagad)) return { ok: false, reason: "Enable email notifications to toggle sub-options." };
    return { ok: true as const };
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    const payload = {
      avatarUrl: avatarUrl ?? undefined,
      notifications: {
        allowEmail,
        commentsOnQuiz: notifComments,
        nagadQuiz1: notifNagad,
      },
    };
    console.log("Settings save:", payload);

    const v = validate();
    if (!v.ok) {
      setShowFailure(true);
      return;
    }
    setShowSuccess(true);
  };

  const onClosePopup = () => {
    setShowSuccess(false);
    setShowFailure(false);
    resetForm();
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
      <form onSubmit={handleSave}>
        {/* Profile */}
        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>

          <div className="space-y-8 px-6 py-6">
            {/* avatar row */}
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-gray-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-7 w-7 text-gray-500" />
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handlePickAvatar}
                  className="rounded-lg border bg-[#CFF4E8] cursor-pointer px-4 py-2 text-sm font-medium hover:bg-blue-200"
                >
                  Change
                </button>
                {avatarUrl && (
                  <p className="mt-1 text-xs text-gray-500">This is local preview only.</p>
                )}
              </div>
            </div>

            {/* account settings */}
            <div>
              <p className="text-sm font-medium text-gray-900">Account Settings</p>
              <p className="mt-1 text-sm text-gray-600">
                Change your password and security options, and access other services.
                <button
                  type="button"
                  className="ml-2 inline-flex items-center gap-1 text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-700"
                  onClick={() => window.open("#", "_blank")}
                >
                  <LinkIcon className="h-4 w-4" />
                  Manage
                </button>
              </p>
            </div>

            {/* change name copy */}
            <div>
              <p className="text-sm font-medium text-gray-900">Change Name</p>
              <p className="mt-1 text-sm text-gray-600">
                To change your name, go to your{" "}
                <a href="#" className="text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-700">
                  account settings
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Notification */}
        <section className="mt-6 rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Notification</h2>
          </div>

          <div className="px-6 py-6">
            <p className="text-sm text-gray-600">
              These settings apply to the notifications you get by email.{" "}
              <a
                href="#"
                className="text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-700"
              >
                Learn more
              </a>
            </p>

            <div className="mt-6 grid gap-6">
              {/* master */}
              <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Allow email notifications</p>
                  <p className="text-xs text-gray-500">Receive updates about your quizzes.</p>
                </div>
                <Switch
                  checked={allowEmail}
                  onChange={handleAllowEmailChange}
                  label="Allow email notifications"
                />
              </div>

              {/* comments */}
              <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Comments</p>
                  <p className="text-xs text-gray-500">Comments on your quiz</p>
                </div>
                <Switch
                  checked={notifComments}
                  onChange={handleNotifCommentsChange}
                  disabled={depsDisabled}
                  label="Comments on your quiz"
                />
              </div>

              {/* quizzes */}
              <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Quizzes</p>
                  <p className="text-xs text-gray-500">Nagad quiz 1</p>
                </div>
                <Switch
                  checked={notifNagad}
                  onChange={handleNotifNagadChange}
                  disabled={depsDisabled}
                  label="Nagad quiz 1"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="sticky bottom-0 mt-8 rounded-2xl border bg-white/80 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex max-w-5xl items-center justify-end">
            <button
              type="submit"
              className={`${
                !isDirty
                  ? "bg-blue-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer hover:shadow-lg"
              } rounded-xl px-5 py-2 text-sm font-medium text-white`}
              disabled={!isDirty}
              title={!isDirty ? "Change something to enable Edit" : undefined}
            >
              Save
            </button>
          </div>
        </div>
      </form>

      {/* Failure popup */}
      {showFailure && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="failure-title"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />
          <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
            <div className="mb-4 flex items-center justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-red-100 shadow-inner">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p id="failure-title" className="mb-6 text-center text-lg font-semibold text-gray-800">
              ❌ Failed to save <br /> changes.
            </p>
            <button
              onClick={onClosePopup}
              className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm cursor-pointer font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success pop-up */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />
          <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
            <div className="mb-4 flex items-center justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-green-100 shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p id="success-title" className="mb-6 text-center text-lg font-semibold text-gray-800">
              🎉 Successfully save <br /> changes!
            </p>
            <button
              onClick={onClosePopup}
              className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm cursor-pointer font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;
