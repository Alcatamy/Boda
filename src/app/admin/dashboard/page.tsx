"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import GuestDashboard from "@/components/admin/GuestDashboard";
import PhotoModeration from "@/components/admin/PhotoModeration";
import SongRequestsPanel from "@/components/admin/SongRequestsPanel";
import MessagesPanel from "@/components/admin/MessagesPanel";
import TablePlanner from "@/components/admin/TablePlanner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, LogOut, Users, Image as ImageIcon, Music, MessageSquare, LayoutGrid, Menu, X } from "lucide-react";
import styles from "./Dashboard.module.css";

type Tab = "guests" | "tables" | "photos" | "songs" | "messages";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("guests");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f8f9fa" }}>
        <Loader2 className="animate-spin" size={32} color="#1a1a1a" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "guests", label: "Invitados y Asistencia", icon: <Users size={20} /> },
    { key: "tables", label: "Organizador de Mesas", icon: <LayoutGrid size={20} /> },
    { key: "photos", label: "Fotos Subidas", icon: <ImageIcon size={20} /> },
    { key: "songs", label: "Peticiones Musicales", icon: <Music size={20} /> },
    { key: "messages", label: "Mensajes (Visitas)", icon: <MessageSquare size={20} /> },
  ];

  const handleTabSwitch = (key: Tab) => {
    setActiveTab(key);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Top Header */}
      <div className={styles.mobileHeader}>
        <h1 className={styles.sidebarTitle}>Admin Panel</h1>
        <button className={styles.menuToggleBtn} onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <div 
        className={`${styles.sidebarOverlay} ${isMobileMenuOpen ? styles.open : ""}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar Navigation */}
      <nav className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 className={styles.sidebarTitle}>Adrián & Nadia</h1>
            {isMobileMenuOpen && (
              <button className={styles.menuToggleBtn} onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            )}
          </div>
          <p className={styles.sidebarSubtitle}>Centro de Control</p>
        </div>

        <div className={styles.navMenu}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabSwitch(tab.key)}
              className={`${styles.navItem} ${activeTab === tab.key ? styles.active : ""}`}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </nav>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: "100%", height: "100%" }}
          >
            {activeTab === "guests" && <GuestDashboard />}
            {activeTab === "tables" && <TablePlanner />}
            {activeTab === "photos" && <PhotoModeration />}
            {activeTab === "songs" && <SongRequestsPanel />}
            {activeTab === "messages" && <MessagesPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
