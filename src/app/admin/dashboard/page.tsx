"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import GuestDashboard from "@/components/admin/GuestDashboard";
import PhotoModeration from "@/components/admin/PhotoModeration";
import SongRequestsPanel from "@/components/admin/SongRequestsPanel";
import MessagesPanel from "@/components/admin/MessagesPanel";
import { Loader2, LogOut, Users, Image as ImageIcon, Music, MessageSquare } from "lucide-react";

type Tab = "guests" | "photos" | "songs" | "messages";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("guests");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "guests", label: "Invitados", icon: <Users size={18} /> },
    { key: "photos", label: "Fotos", icon: <ImageIcon size={18} /> },
    { key: "songs", label: "Canciones", icon: <Music size={18} /> },
    { key: "messages", label: "Mensajes", icon: <MessageSquare size={18} /> },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem" }}>Panel de Control</h1>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.5rem 1rem", border: "1px solid #e5e5e5",
            borderRadius: "4px", background: "white", cursor: "pointer"
          }}
        >
          <LogOut size={16} /> Salir
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid #e5e5e5" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "1rem",
              borderBottom: activeTab === tab.key ? "2px solid black" : "none",
              fontWeight: activeTab === tab.key ? "bold" : "normal",
              cursor: "pointer", background: "none", border: "none",
              display: "flex", gap: "0.5rem", alignItems: "center"
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "guests" && <GuestDashboard />}
      {activeTab === "photos" && <PhotoModeration />}
      {activeTab === "songs" && <SongRequestsPanel />}
      {activeTab === "messages" && <MessagesPanel />}
    </div>
  );
}
