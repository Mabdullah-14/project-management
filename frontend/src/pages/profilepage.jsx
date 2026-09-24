import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/authcontext";
import { Camera, LogOut, ChevronsUpDown } from "lucide-react";
import { updateImage } from "../services/auth";
import { useNavigate } from "react-router-dom";

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Avatar = ({ src, name, className = "", textClass = "text-xs" }) => (
  <div
    className={`shrink-0 overflow-hidden rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 border border-white shadow-sm flex items-center justify-center ${className}`}
  >
    {src ? (
      <img
        src={src}
        alt={name || "Profile"}
        className="h-full w-full object-cover"
      />
    ) : (
      <span className={`font-bold text-white uppercase select-none ${textClass}`}>
        {getInitials(name)}
      </span>
    )}
  </div>
);

// Usage in Sidebar: <Profilepage isSidebarOpen={!isCollapsed} />
const Profilepage = ({ isSidebarOpen = true }) => {
  const { user, logout, handleLogOut, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgForm, setImgForm] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Your Sidebar used `logout`, your old profile code used `handleLogOut`.
  // This works with whichever one your AuthContext provides.
  const performLogout = logout || handleLogOut;

  const hasValidProfileImage =
    user?.profileImage && user.profileImage.trim() !== "";
  const currentImage = hasValidProfileImage ? user.profileImage : "";
  const shownImage = preview || currentImage;
  const roleLabel = user?.role?.toLowerCase() || "member";

  // Preview of the selected file (cleaned up automatically)
  useEffect(() => {
    if (!imgForm) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(imgForm);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imgForm]);

  const closeModal = () => {
    setIsModalOpen(false);
    setImgForm(null);
    setError("");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    e.target.value = ""; 
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Only JPG, PNG or WebP images are allowed.");
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    setError("");
    setImgForm(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imgForm) return;

    const formData = new FormData();
    formData.append("profileImage", imgForm);

    try {
      setLoading(true);
      setError("");

      const res = await updateImage(formData);

      if (res.success) {
        if (setUser && res.user) {
          setUser(res.user);
        }
        setImgForm(null);
        setIsModalOpen(false);
      } else {
        setError(res.message || "Could not update photo. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Could not update photo. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onLogoutClick = async () => {
    setLoggingOut(true);
    try {
      await performLogout?.();
    } catch (err) {
      console.log(err);
    } finally {
      setLoggingOut(false);
      closeModal();
      navigate("/login");
    }
  };

  return (
    <div className="relative w-full">
      {/* Click outside to close */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50" onClick={closeModal} />
      )}

      {/* Trigger (same look as your old footer card) */}
      <button
        type="button"
        onClick={() => setIsModalOpen((open) => !open)}
        aria-haspopup="true"
        aria-expanded={isModalOpen}
        title={!isSidebarOpen ? user?.name || "Profile" : ""}
        className={`
          w-full flex items-center cursor-pointer text-left
          ${isSidebarOpen
            ? "gap-3 px-3 py-2.5 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-100/70"
            : "justify-center py-2 rounded-xl hover:bg-slate-50"}
          transition
        `}
      >
        <Avatar src={currentImage} name={user?.name} className="h-8 w-8" />

        {isSidebarOpen && (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.name || "Unknown User"}
              </p>
              <p className="text-[11px] font-semibold capitalize text-indigo-500 truncate">
                {roleLabel}
              </p>
            </div>
            <ChevronsUpDown size={14} className="shrink-0 text-slate-400" />
          </>
        )}
      </button>

      {/* Popup (opens upward) */}
      <div
        className={`
          absolute bottom-[115%] mb-2
          bg-white rounded-2xl shadow-xl border border-slate-100 z-50
          ${isSidebarOpen ? "left-0 w-full" : "left-1 w-[240px]"}
          ${isModalOpen ? "block" : "hidden"}
        `}
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex flex-col items-center text-center">
            {/* Avatar with camera button */}
            <div className="relative">
              <Avatar
                src={shownImage}
                name={user?.name}
                className="h-16 w-16"
                textClass="text-xl"
              />

              <label
                htmlFor="profile-image-input"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white ring-2 ring-white transition hover:bg-indigo-700 focus-within:ring-indigo-300"
              >
                <Camera size={14} />
                <span className="sr-only">Change profile photo</span>
              </label>
              <input
                id="profile-image-input"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>

            {/* User info */}
            <p className="mt-3 w-full truncate text-sm font-bold text-slate-800">
              {user?.name || "Unknown User"}
            </p>
            <p className="w-full truncate text-xs text-slate-500">
              {user?.email}
            </p>

            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-indigo-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {roleLabel}
            </span>
          </div>

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {error}
            </p>
          )}

          {/* Save / Cancel (only after a new photo is picked) */}
          {imgForm && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setImgForm(null);
                  setError("");
                }}
                disabled={loading}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save photo"}
              </button>
            </div>
          )}
        </form>

        {/* Logout */}
        <div className="border-t border-slate-100 p-2">
          <button
            type="button"
            onClick={onLogoutClick}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 cursor-pointer disabled:opacity-50"
          >
            <LogOut size={18} className="shrink-0" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
