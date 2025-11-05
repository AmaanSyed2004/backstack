"use client";

import { Settings, Bell, Lock, Palette, Users, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";

const settingsSections = [
  {
    title: "Account Settings",
    icon: Users,
    settings: [
      { label: "Organization Name", value: "Acme Corp", type: "text" },
      { label: "Email", value: "admin@acme.com", type: "email" },
      { label: "Website", value: "https://acme.com", type: "url" },
    ],
  },
  {
    title: "Security",
    icon: Lock,
    settings: [
      { label: "Two-Factor Authentication", value: "Enabled", type: "toggle" },
      { label: "Session Timeout", value: "30 minutes", type: "select" },
      { label: "IP Whitelist", value: "192.168.1.0/24", type: "text" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    settings: [
      { label: "Email Alerts", value: true, type: "toggle" },
      { label: "Usage Warnings", value: true, type: "toggle" },
      { label: "Billing Notifications", value: true, type: "toggle" },
    ],
  },
  {
    title: "Appearance",
    icon: Palette,
    settings: [
      { label: "Theme", value: "Dark", type: "select" },
      { label: "Language", value: "English", type: "select" },
      { label: "Timezone", value: "UTC", type: "select" },
    ],
  },
];
const SettingsPage = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Settings
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Manage your account and preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} className="bg-zinc-900 border border-zinc-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-white">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.settings.map((setting, settingIdx) => (
                    <div
                      key={settingIdx}
                      className="flex items-center justify-between p-4 bg-zinc-800/50 rounded border border-zinc-700"
                    >
                      <label className="text-sm font-medium text-white">
                        {setting.label}
                      </label>
                      {setting.type === "toggle" ? (
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700 transition-colors hover:bg-zinc-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </button>
                      ) : setting.type === "select" ? (
                        <select className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-white hover:border-zinc-600 transition-colors">
                          <option>{setting.value}</option>
                        </select>
                      ) : (
                        <Input
                          type={setting.type}
                          defaultValue={setting.value}
                          className="max-w-xs bg-zinc-900 border-zinc-700 text-white"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold">
            <Save className="w-5 h-5" />
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
