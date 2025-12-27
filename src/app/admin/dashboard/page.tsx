"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import GuestTable from "@/components/admin/GuestTable";
import PhotoModeration from "@/components/admin/PhotoModeration";
import { Loader2, LogOut, Users, Image as ImageIcon } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guests' | 'photos'>('guests');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [guests, setGuests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      fetchGuests();
    };

    checkUser();
  }, [router]);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error("Error fetching guests:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <button 
          onClick={() => setActiveTab('guests')}
          style={{ 
            padding: "1rem", 
            borderBottom: activeTab === 'guests' ? "2px solid black" : "none",
            fontWeight: activeTab === 'guests' ? "bold" : "normal",
            cursor: "pointer", background: "none", border: "none",
            display: "flex", gap: "0.5rem", alignItems: "center"
          }}
        >
          <Users size={18} /> Invitados
        </button>
        <button 
          onClick={() => setActiveTab('photos')}
          style={{ 
            padding: "1rem", 
            borderBottom: activeTab === 'photos' ? "2px solid black" : "none",
            fontWeight: activeTab === 'photos' ? "bold" : "normal",
            cursor: "pointer", background: "none", border: "none",
             display: "flex", gap: "0.5rem", alignItems: "center"
          }}
        >
          <ImageIcon size={18} /> Fotos ({0}) {/* Pending count could be passed here */}
        </button>
      </div>
      
      {activeTab === 'guests' ? <GuestTable guests={guests} /> : <PhotoModeration />}
    </div>
  );
}
