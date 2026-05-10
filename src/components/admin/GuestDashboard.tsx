"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Utensils,
  Download,
  Search,
  UserPlus,
  Baby,
  Trash2,
  AlertTriangle
} from "lucide-react";
import styles from "./GuestDashboard.module.css";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  attending: boolean | null;
  dietary_restrictions?: string;
  menu_choice?: string;
  has_plus_one: boolean;
  plus_one_name?: string;
  children_count: number;
  created_at: string;
}

interface Stats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  plusOnes: number;
  children: number;
  meat: number;
  fish: number;
}

export default function GuestDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    plusOnes: 0,
    children: 0,
    meat: 0,
    fish: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "declined" | "pending">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    filterGuests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests, searchTerm, filterStatus]);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newStats: Stats = {
      total: guests.length,
      confirmed: guests.filter(g => g.attending === true).length,
      declined: guests.filter(g => g.attending === false).length,
      pending: guests.filter(g => g.attending === null).length,
      plusOnes: guests.filter(g => g.has_plus_one).length,
      children: guests.reduce((sum, g) => sum + (g.children_count || 0), 0),
      meat: guests.filter(g => g.menu_choice === 'meat').length,
      fish: guests.filter(g => g.menu_choice === 'fish').length
    };
    setStats(newStats);
  }, [guests]);

  const filterGuests = () => {
    let filtered = guests;

    if (filterStatus !== "all") {
      filtered = filtered.filter(guest => {
        if (filterStatus === "confirmed") return guest.attending === true;
        if (filterStatus === "declined") return guest.attending === false;
        if (filterStatus === "pending") return guest.attending === null;
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(guest =>
        `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone?.includes(searchTerm)
      );
    }

    setFilteredGuests(filtered);
  };

  const handleDeleteGuest = async (guestId: string) => {
    setDeleting(guestId);
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      // Remove from local state immediately
      setGuests(prev => prev.filter(g => g.id !== guestId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting guest:', error);
      alert('Error al eliminar el invitado. Comprueba las políticas RLS de Supabase.');
    } finally {
      setDeleting(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Nombre', 'Apellidos', 'Email', 'Teléfono', 'Estado',
      'Restricciones', 'Menú', 'Acompañante', 'Niños', 'Fecha'
    ];

    const csvData = filteredGuests.map(guest => [
      guest.first_name,
      guest.last_name,
      guest.email || '',
      guest.phone || '',
      guest.attending === true ? 'Confirmado' : guest.attending === false ? 'No asiste' : 'Pendiente',
      guest.dietary_restrictions || '',
      guest.menu_choice === 'meat' ? 'Carne' : guest.menu_choice === 'fish' ? 'Pescado' : '',
      guest.has_plus_one ? guest.plus_one_name || 'Sí' : 'No',
      (guest.children_count || 0).toString(),
      new Date(guest.created_at).toLocaleDateString('es-ES')
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invitados_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (attending: boolean | null) => {
    if (attending === true) return <CheckCircle size={20} className={styles.confirmed} />;
    if (attending === false) return <XCircle size={20} className={styles.declined} />;
    return <Clock size={20} className={styles.pending} />;
  };

  const getStatusText = (attending: boolean | null) => {
    if (attending === true) return 'Confirmado';
    if (attending === false) return 'No asiste';
    return 'Pendiente';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <span>Cargando datos de invitados...</span>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <AlertTriangle size={36} color="#ef4444" />
              <h3>¿Eliminar invitado?</h3>
              <p>
                {(() => {
                  const g = guests.find(g => g.id === deleteConfirm);
                  return g ? `${g.first_name} ${g.last_name}` : '';
                })()}
              </p>
              <p className={styles.modalWarning}>Esta acción no se puede deshacer.</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancelar
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteGuest(deleteConfirm)}
                  disabled={deleting === deleteConfirm}
                >
                  {deleting === deleteConfirm ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Users size={32} className={styles.titleIcon} />
            <div>
              <h1 className={styles.title}>Panel de Invitados</h1>
              <p className={styles.subtitle}>Gestión de confirmaciones y estadísticas</p>
            </div>
          </div>
          <button onClick={exportToCSV} className={styles.exportBtn}>
            <Download size={20} />
            Exportar CSV
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className={styles.statsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Users size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>Total Invitados</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><CheckCircle size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.confirmed}</span>
            <span className={styles.statLabel}>Confirmados</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><XCircle size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.declined}</span>
            <span className={styles.statLabel}>No asisten</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Clock size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.pending}</span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><UserPlus size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.plusOnes}</span>
            <span className={styles.statLabel}>Acompañantes</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Baby size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.children}</span>
            <span className={styles.statLabel}>Niños</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Utensils size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.meat}</span>
            <span className={styles.statLabel}>Carne</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Utensils size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.fish}</span>
            <span className={styles.statLabel}>Pescado</span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className={styles.filters}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterButtons}>
          {(['all', 'confirmed', 'declined', 'pending'] as const).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filterStatus === f ? styles.active : ''}`}
              onClick={() => setFilterStatus(f)}
            >
              {f === 'all' && `Todos (${stats.total})`}
              {f === 'confirmed' && `Confirmados (${stats.confirmed})`}
              {f === 'declined' && `No asisten (${stats.declined})`}
              {f === 'pending' && `Pendientes (${stats.pending})`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Guest List */}
      <motion.div
        className={styles.guestList}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.listHeader}>
          <span>Invitado</span>
          <span>Contacto</span>
          <span>Estado</span>
          <span>Detalles</span>
          <span></span>
        </div>

        {filteredGuests.map((guest, index) => (
          <motion.div
            key={guest.id}
            className={styles.guestItem}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.03 }}
            layout
          >
            <div className={styles.guestInfo}>
              <div className={styles.guestName}>
                <span className={styles.firstName}>{guest.first_name}</span>
                <span className={styles.lastName}>{guest.last_name}</span>
              </div>
              <div className={styles.guestMeta}>
                {guest.has_plus_one && (
                  <span className={styles.metaTag}>
                    <UserPlus size={12} />+1
                  </span>
                )}
                {(guest.children_count || 0) > 0 && (
                  <span className={styles.metaTag}>
                    <Baby size={12} />{guest.children_count}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.guestContact}>
              {guest.email && (
                <div className={styles.contactItem}>
                  <Mail size={14} />
                  <span>{guest.email}</span>
                </div>
              )}
              {guest.phone && (
                <div className={styles.contactItem}>
                  <Phone size={14} />
                  <span>{guest.phone}</span>
                </div>
              )}
            </div>

            <div className