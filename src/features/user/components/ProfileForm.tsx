"use client";

import { useEffect, useState } from "react";
import { useUserProfile, useUpdateProfile } from "../hooks/use-user";
import { UpdateProfileInput } from "../types/user.types";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  FileText,
  Camera,
  Loader2,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function ProfileForm() {
  const { data: profileResponse, isLoading, isError, refetch } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const profile = profileResponse?.data;

  const [formData, setFormData] = useState<UpdateProfileInput>({
    full_name: "",
    avatar_url: "",
    address: "",
    phone: "",
    bio: "",
    city: "",
    country: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        avatar_url: profile.avatar_url || "",
        address: profile.address || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateProfileMutation.mutateAsync(formData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to update profile"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-zinc-400 font-medium">Loading profile details...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Failed to load profile</h3>
        <p className="text-sm text-zinc-400">
          There was an error fetching your profile details. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const defaultAvatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <div className="relative space-y-8 overflow-hidden">
      {/* Background glow effects matching Dashboard Overview */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header Banner & Overview */}
        <div className="glass-panel-glow rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/5">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(255,1,79,0.3)] bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.avatar_url || profile?.avatar_url || defaultAvatar}
                  alt={profile?.full_name || "User Avatar"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultAvatar;
                  }}
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-zinc-900/90 border border-primary/40 p-1.5 rounded-full text-primary shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
                Account Settings
              </span>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-0.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {profile?.full_name || "User Profile"}
                </h1>
                {profile?.role && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/15 border border-primary/30 text-primary flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {profile.role}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  {profile?.email}
                </span>

                {profile?.created_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    Member since{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Alerts */}
      {successMessage && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-3.5 rounded-xl text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3.5 rounded-xl text-sm font-medium animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-bg-dark border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>Personal Details</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Update your personal details and account information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Email Address <span className="text-zinc-500 font-normal lowercase">(read-only)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-600" />
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full bg-zinc-950/60 border border-zinc-800/60 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Avatar Image URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
              Bio / About Me
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <textarea
                name="bio"
                rows={3}
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Tell us a little bit about yourself..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address & Location */}
        <div className="bg-bg-dark border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Location Details</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Your location and address specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="123 Innovation Way"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                City
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  placeholder="San Francisco"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Country
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                  placeholder="United States"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(255,1,79,0.25)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
