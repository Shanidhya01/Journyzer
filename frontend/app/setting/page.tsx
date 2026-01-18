"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Settings,
  Bell,
  Lock,
  Globe,
  Palette,
  Shield,
  Mail,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

type UserSettings = {
  notifications: {
    email: boolean;
    push: boolean;
    tripReminders: boolean;
    promotions: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private" | "friends";
    showEmail: boolean;
    showLocation: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    theme: "light" | "dark" | "auto";
    budgetDefault: string;
  };
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: false,
      tripReminders: true,
      promotions: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
    },
    preferences: {
      language: "en",
      currency: "USD",
      theme: "light",
      budgetDefault: "moderate",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/settings");
      setSettings(res.data as UserSettings);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/user/settings", settings);
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordChange(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/user/account");
      await auth.signOut();
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              </div>
              <Loader2 className="relative w-20 h-20 text-indigo-600 animate-spin mx-auto" />
            </div>
            <p className="text-gray-700 font-bold text-xl">Loading settings...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 max-w-5xl py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-5xl font-black text-gray-900">Settings</h1>
            </div>
            <p className="text-gray-600 text-lg">Manage your account preferences and settings</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-semibold">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-md">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Notifications</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <div>
                      <p className="font-bold text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: e.target.checked }
                    })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    <div>
                      <p className="font-bold text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Get notified on your device</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: e.target.checked }
                    })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                    <div>
                      <p className="font-bold text-gray-900">Trip Reminders</p>
                      <p className="text-sm text-gray-600">Reminders for upcoming trips</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.tripReminders}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, tripReminders: e.target.checked }
                    })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    <div>
                      <p className="font-bold text-gray-900">Promotions & Updates</p>
                      <p className="text-sm text-gray-600">Special offers and news</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.promotions}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, promotions: e.target.checked }
                    })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Privacy</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <label className="block font-bold text-gray-900 mb-3">Profile Visibility</label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, profileVisibility: e.target.value as any }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium"
                  >
                    <option value="public">Public - Anyone can see</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>

                <label className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-gray-900">Show Email on Profile</p>
                    <p className="text-sm text-gray-600">Let others see your email address</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showEmail: e.target.checked }
                    })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-gray-900">Show Location</p>
                    <p className="text-sm text-gray-600">Display your location on profile</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showLocation}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showLocation: e.target.checked }
                    })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Preferences</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-900 mb-2">Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, language: e.target.value }
                      })}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-2">Currency</label>
                  <select
                    value={settings.preferences.currency}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, currency: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-2">Theme</label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, theme: e.target.value as any }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-2">Default Budget</label>
                  <select
                    value={settings.preferences.budgetDefault}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, budgetDefault: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  >
                    <option value="budget">Budget</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-md">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Security</h2>
              </div>

              {!showPasswordChange ? (
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </div>
                  </div>
                  <span className="text-indigo-600 font-bold">Change →</span>
                </button>
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-900 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-900 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Change Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                      disabled={saving}
                      className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-md">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-red-900">Danger Zone</h2>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black text-gray-900 mb-2">Delete Account</h3>
                    <p className="text-gray-600">
                      Permanently delete your account and all data. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Saving..." : "Save All Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 text-center">Delete Account?</h3>
              <p className="text-gray-600 mb-6 text-center">
                Are you sure you want to delete your account? All your data will be permanently removed. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
} 