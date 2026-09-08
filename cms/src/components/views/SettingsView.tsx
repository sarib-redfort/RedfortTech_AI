/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  Settings,
  User,
  ShieldCheck,
  KeyRound,
  UploadCloud,
} from "lucide-react";
import Button from "../forms/Button";
import Input from "../forms/Input";
import { toast } from "react-hot-toast";
import { profileService } from "../../services/api";
import { normalizeImageUrl } from "../../utils/image";

interface SettingsViewProps {
  currentUser: {
    id?: string;
    name: string;
    email: string;
    role: string;
  } | null;
  onProfileUpdated?: (user: {
    id?: string;
    name: string;
    email: string;
    role: string;
  }) => void;
}

export default function SettingsView({
  currentUser,
  onProfileUpdated,
}: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<
    "profile" | "security"
  >("profile");

  // Profile forms state
  const [profName, setProfName] = useState(currentUser?.name || "Admin User");
  const [profEmail, setProfEmail] = useState(
    currentUser?.email || "admin@redforai.com",
  );
  const [profAvatar, setProfAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  );

  // Security change password state
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");

  useEffect(() => {
    setProfName(currentUser?.name || "Admin User");
    setProfEmail(currentUser?.email || "admin@redforai.com");
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName.trim() || !profEmail.trim()) {
      toast.error("Name and Email are required.");
      return;
    }

    try {
      const updatedProfile = await profileService.updateProfile({
        id: currentUser?.id,
        name: profName.trim(),
        email: profEmail.trim(),
      });

      const nextUser = {
        id: currentUser?.id || updatedProfile.id,
        name: updatedProfile.name || profName.trim(),
        email: updatedProfile.email || profEmail.trim(),
        role: currentUser?.role || "Admin",
      };

      onProfileUpdated?.(nextUser);
      toast.success("Admin Profile Settings updated!");
    } catch (error: any) {
      console.error("[SETTINGS] Profile update failed:", error);
      toast.error(error?.message || "Failed to update profile");
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!curPass || !newPass || !confPass) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPass !== confPass ) {
      toast.error("New Password and Confirmation do not match!");
      return;
    }
    if(newPass.length<6){
      toast.error("password must be greater than 6 digit")
      return ;
    }

    try {
      await profileService.changePassword(curPass, newPass, currentUser?.id);
      toast.success("Password changed successfully!");
      setCurPass("");
      setNewPass("");
      setConfPass("");
    } catch (error: any) {
      console.error("[SETTINGS] Password change failed:", error);
      toast.error(error?.message || "Failed to change password");
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm shadow-gray-100/50 animate-fade-in select-none overflow-hidden flex flex-col md:flex-row">
      {/* Settings Side Controls */}
      <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-5 space-y-2 flex-shrink-0">
        <h3 className="text-xs font-bold text-text-gray uppercase tracking-wider px-3 mb-4 select-none">
          Settings Menu
        </h3>

        <button
          onClick={() => setActiveSection("profile")}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${
            activeSection === "profile"
              ? "bg-red-50 text-primary-red"
              : "text-text-gray hover:text-text-dark hover:bg-gray-50"
          }`}
        >
          <User className="w-4 h-4" /> Admin Profile
        </button>

        <button
          onClick={() => setActiveSection("security")}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${
            activeSection === "security"
              ? "bg-red-50 text-primary-red"
              : "text-text-gray hover:text-text-dark hover:bg-gray-50"
          }`}
        >
          <KeyRound className="w-4 h-4" /> Password & Security
        </button>

      </div>

      {/* Settings form workspace */}
      <div className="flex-1 p-6 md:p-8">
        {activeSection === "profile" && (
          /* ADMIN PROFILE FORM WITH AVATAR PREVIEW */
          <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
            <div>
              <h4 className="font-bold text-text-dark text-base mb-1">
                Administrative Profile Settings
              </h4>
              <p className="text-xs text-text-gray font-semibold">
                Change your system avatar logo, profile name and login email
                credentials
              </p>
            </div>

            {/* Profile image row */}
            <div className="flex items-center gap-5 p-4 border border-border-gray rounded-xl bg-gray-50/50">
              <img
                src={normalizeImageUrl(profAvatar)}
                alt="admin profile"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-16 h-16 rounded-full object-cover border border-[#E5E7EB]"
              />
              <div>
                <span className="text-xs font-bold text-text-dark block mb-2">
                  Configure profile icon
                </span>
                <input
                  type="text"
                  value={profAvatar}
                  onChange={(e) => setProfAvatar(e.target.value)}
                  placeholder="Paste profile image URL here..."
                  className="px-3 py-1.5 border border-border-gray rounded-lg text-xs text-text-dark bg-white outline-none focus:border-primary-red w-72 max-w-full"
                />
              </div>
            </div>

            <Input
              label="Administrative Username"
              value={profName}
              onChange={(e) => setProfName(e.target.value)}
              placeholder="e.g. Ali Raza Admin"
            />

            <Input
              label="Contact Email Address"
              value={profEmail}
              onChange={(e) => setProfEmail(e.target.value)}
              type="email"
              placeholder="e.g. admin@redforai.com"
            />

            <div className="pt-4 border-t border-gray-100">
              <Button
                type="submit"
                className="bg-[#DC2626] hover:bg-red-700 text-white font-semibold px-6"
              >
                Save profile settings
              </Button>
            </div>
          </form>
        )}

        {activeSection === "security" && (
          /* PASSWORD & SECURITY WORKSPACE */
          <form onSubmit={handleSaveSecurity} className="space-y-6 max-w-xl">
            <div>
              <h4 className="font-bold text-text-dark text-base mb-1">
                Update System Password
              </h4>
              <p className="text-xs text-text-gray font-semibold">
                Ensure a robust password setting to protect system databases
              </p>
            </div>

            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={curPass}
              onChange={(e) => setCurPass(e.target.value)}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confPass}
              onChange={(e) => setConfPass(e.target.value)}
            />

            <div className="pt-4 border-t border-gray-100">
              <Button
                type="submit"
                className="bg-[#DC2626] hover:bg-red-700 text-white font-semibold px-6"
              >
                Change password
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
