"use client";

import { useState } from "react";
import styles from "./GuestTable.module.css";
import { Check, X, MessageSquare, Utensils } from "lucide-react";

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  attending: boolean;
  dietary_restrictions: string;
  has_plus_one: boolean;
  plus_one_name: string;
  message: string;
  created_at: string;
};

export default function GuestTable({ guests }: { guests: Guest[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuests = guests.filter((guest) => 
    guest.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Respuestas</span>
            <span className={styles.statValue}>{guests.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Sí Asisten</span>
            <span className={styles.statValue}>
              {guests.filter(g => g.attending).length + 
               guests.filter(g => g.attending && g.has_plus_one).length}
            </span>
          </div>
        </div>
        
        <input 
          type="text" 
          placeholder="Buscar invitado..." 
          className={styles.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Asiste</th>
              <th>Acompañante</th>
              <th>Dieta / Alergias</th>
              <th>Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest) => (
              <tr key={guest.id}>
                <td className={styles.nameCell}>
                  {guest.first_name} {guest.last_name}
                </td>
                <td>
                  {guest.attending ? (
                    <span className={`${styles.badge} ${styles.yes}`}>
                      <Check size={14} /> SÍ
                    </span>
                  ) : (
                    <span className={`${styles.badge} ${styles.no}`}>
                      <X size={14} /> NO
                    </span>
                  )}
                </td>
                <td>
                  {guest.has_plus_one ? (
                    <div className={styles.plusOne}>
                      <span className={styles.smallLabel}>+1</span>
                      {guest.plus_one_name}
                    </div>
                  ) : (
                    <span className={styles.dash}>-</span>
                  )}
                </td>
                <td>
                  {guest.dietary_restrictions ? (
                    <div className={styles.diet}>
                      <Utensils size={14} className={styles.icon} />
                      {guest.dietary_restrictions}
                    </div>
                  ) : (
                    <span className={styles.dash}>-</span>
                  )}
                </td>
                <td className={styles.messageCell}>
                  {guest.message && (
                    <div className={styles.message} title={guest.message}>
                      <MessageSquare size={14} className={styles.icon} />
                      {guest.message}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.empty}>No se encontraron invitados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
