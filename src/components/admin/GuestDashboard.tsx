"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  Utensils,
  Download,
  Search,
  Filter,
  UserPlus,
  Heart,
  Baby,
  Trash2,
  Edit,
  MessageSquare
} from "lucide-react";
import EditGuestModal from "./EditGuestModal";
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
  plus_one_menu_choice?: string;
  children_count: number;
  message?: string;
  created_at: string;
}

interface Stats {
  total: number;
  totalReal: number;
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
    totalReal: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    plusOnes: 0,
    children: 0,
    meat: 0,
    fish: 0
  });
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "declined" | "pending">("all");

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    filterGuests();
  }, [guests, searchTerm, filterStatus]);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que quieres borrar este invitado? Esta acción no se puede deshacer.")) {
      try {
        const { error } = await supabase.from('guests').delete().eq('id', id);
        if (error) throw error;
        setGuests(guests.filter(g => g.id !== id));
      } catch (error) {
        console.error('Error deleting guest:', error);
        alert('Error al borrar el invitado.');
      }
    }
  };

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
    if (guests.length > 0) {
      const newStats: Stats = {
        total: guests.length,
        totalReal: guests.reduce((sum, g) => sum + (g.attending === true ? (1 + (g.has_plus_one ? 1 : 0) + g.children_count) : 0), 0),
        confirmed: guests.filter(g => g.attending === true).length,
        declined: guests.filter(g => g.attending === false).length,
        pending: guests.filter(g => g.attending === null).length,
        plusOnes: guests.filter(g => g.has_plus_one).length,
        children: guests.reduce((sum, g) => sum + g.children_count, 0),
        meat: guests.filter(g => g.menu_choice === 'meat').length,
        fish: guests.filter(g => g.menu_choice === 'fish').length
      };
      setStats(newStats);
    }
  }, [guests]);

  const filterGuests = () => {
    let filtered = guests;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(guest => {
        if (filterStatus === "confirmed") return guest.attending === true;
        if (filterStatus === "declined") return guest.attending === false;
        if (filterStatus === "pending") return guest.attending === null;
        return true;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(guest =>
        `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone?.includes(searchTerm)
      );
    }

    setFilteredGuests(filtered);
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
      guest.children_count.toString(),
      new Date(guest.created_at).toLocaleDateString('es-ES')
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guests_${new Date().toISOString().split('T')[0]}.csv`;
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
        <div className={styles.statCard} style={{ background: '#ecfdf5', borderColor: '#d1fae5' }}>
          <div className={styles.statIcon} style={{ background: '#10b981', color: 'white' }}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber} style={{ color: '#065f46' }}>{stats.totalReal}</span>
            <span className={styles.statLabel} style={{ color: '#047857', fontWeight: 600 }}>Asistentes Reales</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>Respuestas</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.confirmed}</span>
            <span className={styles.statLabel}>Confirmados</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <XCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.declined}</span>
            <span className={styles.statLabel}>No asisten</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.pending}</span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <UserPlus size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.plusOnes}</span>
            <span className={styles.statLabel}>Acompañantes</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Baby size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.children}</span>
            <span className={styles.statLabel}>Niños</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Utensils size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.meat}</span>
            <span className={styles.statLabel}>Carne</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Utensils size={24} />
          </div>
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
          <button
            className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Todos ({stats.total})
          </button>
          <button
            className={`${styles.filterBtn} ${filterStatus === 'confirmed' ? styles.active : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmados ({stats.confirmed})
          </button>
          <button
            className={`${styles.filterBtn} ${filterStatus === 'declined' ? styles.active : ''}`}
            onClick={() => setFilterStatus('declined')}
          >
            No asisten ({stats.declined})
          </button>
          <button
            className={`${styles.filterBtn} ${filterStatus === 'pending' ? styles.active : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pendientes ({stats.pending})
          </button>
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
            className={styles.guestRowGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            {/* Fila del Invitado Principal */}
            <div className={styles.mainGuestRow}>
              {/* 1. Invitado */}
              <div className={styles.guestInfo}>
                <div className={styles.guestName}>
                  <span className={styles.firstName}>{guest.first_name}</span>
                  <span className={styles.lastName}>{guest.last_name}</span>
                </div>
                <div className={styles.guestMeta}>
                  {guest.children_count > 0 && (
                    <span className={styles.metaTag}>
                      <Baby size={12} />
                      {guest.children_count} Niños
                    </span>
                  )}
                  {guest.has_plus_one && (
                    <span className={styles.metaTag}>
                      <UserPlus size={12} />
                      Con acompañante
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Contacto */}
              <div className={styles.guestContact}>
                {guest.email ? (
                  <div className={styles.contactItem}>
                    <Mail size={14} />
                    <span>{guest.email}</span>
                  </div>
                ) : null}
                {guest.phone ? (
                  <div className={styles.contactItem}>
                    <Phone size={14} />
                    <span>{guest.phone}</span>
                  </div>
                ) : null}
                {!guest.email && !guest.phone && (
                  <span style={{ color: '#d9c1c3', fontStyle: 'italic', fontSize: '0.85rem' }}>Sin contacto</span>
                )}
              </div>

              {/* 3. Estado */}
              <div className={styles.guestStatus}>
                {getStatusIcon(guest.attending)}
                <span className={`${styles.statusText} ${
                  guest.attending === true ? styles.confirmed : 
                  guest.attending === false ? styles.declined : 
                  styles.pending
                }`}>
                  {getStatusText(guest.attending)}
                </span>
              </div>

              {/* 4. Detalles */}
              <div className={styles.guestDetails}>
                {guest.menu_choice && (
                  <span className={styles.detailTag}>
                    <Utensils size={12} />
                    {guest.menu_choice === 'meat' ? 'Carne' : 'Pescado'}
                  </span>
                )}
                {guest.dietary_restrictions && (
                  <span className={styles.allergyTag} title={guest.dietary_restrictions}>
                    Alergias: {guest.dietary_restrictions.substring(0, 20)}{guest.dietary_restrictions.length > 20 ? '...' : ''}
                  </span>
                )}
              </div>

              {/* 5. Acciones */}
              <div className={styles.actionButtons}>
                <button 
                  onClick={() => setEditingGuest(guest)}
                  className={styles.iconBtn}
                  title="Editar invitado"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(guest.id)}
                  className={`${styles.iconBtn} ${styles.deleteBtn}`}
                  title="Borrar invitado"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            {/* Fila de Mensaje (si existe) */}
            {guest.message && guest.message.trim() !== "" && (
              <div style={{
                padding: "0.5rem 1.5rem 1rem",
                background: "transparent",
                fontSize: "0.95rem",
                color: "#544244",
                fontFamily: "'Newsreader', serif",
                fontStyle: "italic",
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
                borderTop: "1px dashed #e4e3db",
                marginTop: "0.5rem",
                paddingTop: "1rem"
              }}>
                <MessageSquare size={16} style={{ flexShrink: 0, marginTop: "0.25rem", color: "#8c3b4a" }} />
                <span>&quot;{guest.message}&quot;</span>
              </div>
            )}
            </div>

            {/* Fila del Acompañante (si existe) */}
            {guest.has_plus_one && (
              <div className={styles.plusOneRow}>
                <div className={styles.plusOneIndicator} />
                
                {/* 1. Invitado (+1) */}
                <div className={styles.guestInfo}>
                  <span className={styles.plusOneNameTag}>
                    ↳ {guest.plus_one_name || "Acompañante sin registrar nombre"}
                  </span>
                </div>

                {/* 2. Contacto (vacío para +1) */}
                <div></div>

                {/* 3. Estado (hereda del principal) */}
                <div className={styles.guestStatus} style={{ opacity: 0.7 }}>
                  {getStatusIcon(guest.attending)}
                  <span className={`${styles.statusText} ${
                    guest.attending === true ? styles.confirmed : 
                    guest.attending === false ? styles.declined : 
                    styles.pending
                  }`}>
                    {getStatusText(guest.attending)}
                  </span>
                </div>

                {/* 4. Detalles (+1) */}
                <div className={styles.guestDetails}>
                  {guest.plus_one_menu_choice && (
                    <span className={styles.detailTag}>
                      <Utensils size={12} />
                      {guest.plus_one_menu_choice === 'meat' ? 'Carne' : 'Pescado'}
                    </span>
                  )}
                </div>

                {/* 5. Acciones (vacío) */}
                <div></div>
              </div>
            )}
          </motion.div>
        ))}

        {filteredGuests.length === 0 && (
          <div className={styles.emptyState}>
            <Users size={48} className={styles.emptyIcon} />
            <span>No se encontraron invitados</span>
          </div>
        )}
      </motion.div>

      {editingGuest && (
        <EditGuestModal 
          guest={editingGuest} 
          onClose={() => setEditingGuest(null)} 
          onUpdate={() => {
            setEditingGuest(null);
            fetchGuests();
          }} 
        />
      )}
    </div>
  );
}
