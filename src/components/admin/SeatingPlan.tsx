"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus, Save, Trash2, Circle, Square, Users, RotateCcw,
  CheckCircle, Loader2
} from "lucide-react";
import styles from "./SeatingPlan.module.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  attending: boolean | null;
  has_plus_one: boolean;
  plus_one_name?: string;
}

interface Seat {
  index: number;      // seat position index in the table
  guestId: string | null;
}

interface TableItem {
  id: string;
  name: string;
  type: "circular" | "rectangular";
  capacity: number;
  x: number;  // % from left of floor plan
  y: number;  // % from top of floor plan
  seats: Seat[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSeat(index: number): Seat {
  return { index, guestId: null };
}

function makeTable(type: "circular" | "rectangular", count: number): TableItem {
  const capacity = type === "circular" ? 8 : 10;
  return {
    id: crypto.randomUUID(),
    name: `Mesa ${count + 1}`,
    type,
    capacity,
    x: 20 + (count % 4) * 18,
    y: 20 + Math.floor(count / 4) * 28,
    seats: Array.from({ length: capacity }, (_, i) => makeSeat(i)),
  };
}

// Seat position around a circular table (returns % offset from table center)
function circularSeatPos(index: number, total: number, radius: number) {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

// Seat positions around a rectangular table
function rectangularSeatPos(index: number, total: number, w: number, h: number) {
  const perSide = Math.ceil(total / 2);
  if (index < perSide) {
    // top row
    const spacing = w / (perSide + 1);
    return { x: -w / 2 + spacing * (index + 1), y: -h / 2 - 18 };
  } else {
    // bottom row
    const i2 = index - perSide;
    const spacing = w / (total - perSide + 1);
    return { x: -w / 2 + spacing * (i2 + 1), y: h / 2 + 18 };
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SeatingPlan() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Drag state
  const [draggingGuest, setDraggingGuest] = useState<string | null>(null);   // guestId
  const [draggingFromSeat, setDraggingFromSeat] = useState<{ tableId: string; seatIndex: number } | null>(null);
  const [dragOver, setDragOver] = useState<{ tableId: string; seatIndex: number } | null>(null);

  // Table drag (move table on floor plan)
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const tableDragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);

  // Table being renamed
  const [renamingId, setRenamingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load guests
      const { data: guestData } = await supabase
        .from("guests")
        .select("id, first_name, last_name, attending, has_plus_one, plus_one_name")
        .eq("attending", true)
        .order("first_name");

      setGuests(guestData || []);

      // Load seating plan
      const { data: planData } = await supabase
        .from("seating_plan")
        .select("plan_data")
        .limit(1)
        .maybeSingle();

      if (planData?.plan_data?.tables) {
        setTables(planData.plan_data.tables);
      }
    } catch (err) {
      console.error("Error loading seating plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    setSaving(true);
    try {
      const planJson = { tables };

      // Upsert with a fixed id so there's only one plan row
      const { error } = await supabase
        .from("seating_plan")
        .upsert({ id: "main", plan_data: planJson }, { onConflict: "id" });

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving plan:", err);
      alert("Error al guardar. Comprueba que la tabla seating_plan existe en Supabase.");
    } finally {
      setSaving(false);
    }
  };

  const addTable = (type: "circular" | "rectangular") => {
    setTables(prev => [...prev, makeTable(type, prev.length)]);
  };

  const removeTable = (tableId: string) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
  };

  const changeCapacity = (tableId: string, delta: number) => {
    setTables(prev => prev.map(t => {
      if (t.id !== tableId) return t;
      const newCap = Math.max(2, Math.min(20, t.capacity + delta));
      const seats = Array.from({ length: newCap }, (_, i) =>
        t.seats[i] ?? makeSeat(i)
      );
      return { ...t, capacity: newCap, seats };
    }));
  };

  // ── Guest assigned check ──────────────────────────────────────────────────

  const assignedGuestIds = new Set(
    tables.flatMap(t => t.seats.map(s => s.guestId).filter(Boolean))
  );

  const unassignedGuests = guests.filter(g => !assignedGuestIds.has(g.id));

  // ── Drag & Drop (guest → seat) ────────────────────────────────────────────

  const handleGuestDragStart = (guestId: string) => {
    setDraggingGuest(guestId);
    setDraggingFromSeat(null);
  };

  const handleSeatDragStart = (tableId: string, seatIndex: number, guestId: string) => {
    setDraggingGuest(guestId);
    setDraggingFromSeat({ tableId, seatIndex });
  };

  const handleSeatDrop = (targetTableId: string, targetSeatIndex: number) => {
    if (!draggingGuest) return;

    setTables(prev => {
      let next = prev.map(t => ({ ...t, seats: t.seats.map(s => ({ ...s })) }));

      // Remove from source seat if moving from seat
      if (draggingFromSeat) {
        next = next.map(t => {
          if (t.id !== draggingFromSeat.tableId) return t;
          return {
            ...t,
            seats: t.seats.map(s =>
              s.index === draggingFromSeat.seatIndex ? { ...s, guestId: null } : s
            ),
          };
        });
      }

      // Assign to target seat (swap if occupied)
      next = next.map(t => {
        if (t.id !== targetTableId) return t;
        const targetSeat = t.seats.find(s => s.index === targetSeatIndex);
        const evictedGuest = targetSeat?.guestId ?? null;

        const newSeats = t.seats.map(s => {
          if (s.index === targetSeatIndex) return { ...s, guestId: draggingGuest };
          return s;
        });

        // If there was a previous occupant and we came from a seat, put evicted there
        if (evictedGuest && draggingFromSeat && draggingFromSeat.tableId === t.id) {
          return {
            ...t,
            seats: newSeats.map(s =>
              s.index === draggingFromSeat.seatIndex ? { ...s, guestId: evictedGuest } : s
            ),
          };
        }

        return { ...t, seats: newSeats };
      });

      // If evicted guest needs to go back to source table (cross-table swap)
      // For simplicity just clear — user can re-assign
      return next;
    });

    setDraggingGuest(null);
    setDraggingFromSeat(null);
    setDragOver(null);
  };

  const handleDropToUnassigned = () => {
    if (!draggingFromSeat || !draggingGuest) return;
    setTables(prev => prev.map(t => {
      if (t.id !== draggingFromSeat!.tableId) return t;
      return {
        ...t,
        seats: t.seats.map(s =>
          s.index === draggingFromSeat!.seatIndex ? { ...s, guestId: null } : s
        ),
      };
    }));
    setDraggingGuest(null);
    setDraggingFromSeat(null);
  };

  // ── Table move (drag the table card itself) ───────────────────────────────

  const handleTableMouseDown = (e: React.MouseEvent, tableId: string) => {
    // Only drag on the header handle
    if (!(e.target as HTMLElement).closest("[data-handle]")) return;
    e.preventDefault();
    const table = tables.find(t => t.id === tableId);
    if (!table || !floorRef.current) return;
    const rect = floorRef.current.getBoundingClientRect();
    tableDragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      ox: table.x,
      oy: table.y,
    };
    setDraggingTable(tableId);
  };

  const handleFloorMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingTable || !tableDragStart.current || !floorRef.current) return;
    const rect = floorRef.current.getBoundingClientRect();
    const dx = ((e.clientX - tableDragStart.current.mx) / rect.width) * 100;
    const dy = ((e.clientY - tableDragStart.current.my) / rect.height) * 100;
    const newX = Math.max(2, Math.min(90, tableDragStart.current.ox + dx));
    const newY = Math.max(2, Math.min(90, tableDragStart.current.oy + dy));
    setTables(prev => prev.map(t =>
      t.id === draggingTable ? { ...t, x: newX, y: newY } : t
    ));
  }, [draggingTable]);

  const handleFloorMouseUp = useCallback(() => {
    setDraggingTable(null);
    tableDragStart.current = null;
  }, []);

  useEffect(() => {
    if (draggingTable) {
      window.addEventListener("mousemove", handleFloorMouseMove);
      window.addEventListener("mouseup", handleFloorMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleFloorMouseMove);
      window.removeEventListener("mouseup", handleFloorMouseUp);
    };
  }, [draggingTable, handleFloorMouseMove, handleFloorMouseUp]);

  // ── Guest name lookup ─────────────────────────────────────────────────────

  const guestName = (id: string | null) => {
    if (!id) return null;
    const g = guests.find(g => g.id === id);
    return g ? `${g.first_name} ${g.last_name}` : "?";
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 size={32} className={styles.spin} />
        <span>Cargando plano de mesas...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button className={styles.addBtn} onClick={() => addTable("circular")}>
            <Circle size={16} /> Mesa Circular
          </button>
          <button className={styles.addBtn} onClick={() => addTable("rectangular")}>
            <Square size={16} /> Mesa Rectangular
          </button>
        </div>
        <div className={styles.toolbarRight}>
          <span className={styles.hint}>
            <Users size={14} /> {assignedGuestIds.size} / {guests.length} invitados asignados
          </span>
          <button
            className={`${styles.saveBtn} ${saved ? styles.savedBtn : ""}`}
            onClick={savePlan}
            disabled={saving}
          >
            {saving ? (
              <><Loader2 size={16} className={styles.spin} /> Guardando...</>
            ) : saved ? (
              <><CheckCircle size={16} /> ¡Guardado!</>
            ) : (
              <><Save size={16} /> Guardar Plano</>
            )}
          </button>
        </div>
      </div>

      <div className={styles.workspace}>
        {/* ── Guest sidebar ── */}
        <div
          className={styles.sidebar}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropToUnassigned}
        >
          <div className={styles.sidebarHeader}>
            <Users size={18} />
            <span>Sin asignar ({unassignedGuests.length})</span>
          </div>
          <div className={styles.guestList}>
            {unassignedGuests.map(guest => (
              <div
                key={guest.id}
                className={styles.guestChip}
                draggable
                onDragStart={() => handleGuestDragStart(guest.id)}
                onDragEnd={() => setDraggingGuest(null)}
              >
                <span className={styles.guestInitial}>
                  {guest.first_name[0]}{guest.last_name[0]}
                </span>
                <span className={styles.guestChipName}>
                  {guest.first_name} {guest.last_name}
                </span>
                {guest.has_plus_one && (
                  <span className={styles.plusOneBadge}>+1</span>
                )}
              </div>
            ))}
            {unassignedGuests.length === 0 && (
              <p className={styles.allAssigned}>¡Todos asignados!</p>
            )}
          </div>
          <div className={styles.dropZone}>
            Suelta aquí para desasignar
          </div>
        </div>

        {/* ── Floor plan ── */}
        <div
          className={styles.floorPlan}
          ref={floorRef}
          style={{ cursor: draggingTable ? "grabbing" : "default" }}
        >
          {tables.length === 0 && (
            <div className={styles.emptyFloor}>
              <p>Añade mesas con los botones de arriba</p>
              <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                Arrastra los invitados desde la lista a los asientos
              </p>
            </div>
          )}

          {tables.map(table => {
            const isCirc = table.type === "circular";
            // Table visual dimensions (px in the floor plan)
            const TW = isCirc ? 80 : 130;
            const TH = isCirc ? 80 : 60;
            const seatR = 14; // seat circle radius
            const orbitR = isCirc ? TW / 2 + 26 : 0;

            return (
              <div
                key={table.id}
                className={styles.tableWrapper}
                style={{ left: `${table.x}%`, top: `${table.y}%` }}
                onMouseDown={e => handleTableMouseDown(e, table.id)}
              >
                {/* Rename input */}
                {renamingId === table.id ? (
                  <input
                    className={styles.renameInput}
                    autoFocus
                    value={table.name}
                    onChange={e => setTables(prev => prev.map(t =>
                      t.id === table.id ? { ...t, name: e.target.value } : t
                    ))}
                    onBlur={() => setRenamingId(null)}
                    onKeyDown={e => e.key === "Enter" && setRenamingId(null)}
                  />
                ) : (
                  <div
                    className={styles.tableLabel}
                    data-handle="true"
                    onDoubleClick={() => setRenamingId(table.id)}
                    title="Arrastra para mover · Doble clic para renombrar"
                  >
                    {table.name}
                  </div>
                )}

                {/* Table surface */}
                <div
                  className={`${styles.tableSurface} ${isCirc ? styles.circular : styles.rectangular}`}
                  style={{ width: TW, height: TH }}
                >
                  <span className={styles.tableCapacity}>{table.capacity}</span>
                </div>

                {/* Seats */}
                {table.seats.map(seat => {
                  let pos: { x: number; y: number };
                  if (isCirc) {
                    pos = circularSeatPos(seat.index, table.capacity, orbitR);
                  } else {
                    pos = rectangularSeatPos(seat.index, table.capacity, TW, TH);
                  }

                  const isOccupied = !!seat.guestId;
                  const isDragTarget = dragOver?.tableId === table.id && dragOver.seatIndex === seat.index;

                  return (
                    <div
                      key={seat.index}
                      className={`${styles.seat} ${isOccupied ? styles.occupied : styles.empty} ${isDragTarget ? styles.dragTarget : ""}`}
                      style={{
                        left: `calc(50% + ${pos.x}px - ${seatR}px)`,
                        top: isCirc
                          ? `calc(50% + ${pos.y}px - ${seatR}px)`
                          : pos.y < 0
                            ? `calc(0% + ${pos.y - seatR * 2}px)`
                            : `calc(100% + ${pos.y - seatR}px)`,
                        width: seatR * 2,
                        height: seatR * 2,
                      }}
                      draggable={isOccupied}
                      onDragStart={isOccupied
                        ? () => handleSeatDragStart(table.id, seat.index, seat.guestId!)
                        : undefined}
                      onDragEnd={() => { setDraggingGuest(null); setDraggingFromSeat(null); }}
                      onDragOver={e => { e.preventDefault(); setDragOver({ tableId: table.id, seatIndex: seat.index }); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={() => handleSeatDrop(table.id, seat.index)}
                      title={isOccupied ? guestName(seat.guestId) ?? "" : "Asiento libre"}
                    >
                      {isOccupied && (
                        <span className={styles.seatInitial}>
                          {guestName(seat.guestId)?.split(" ").map(p => p[0]).join("").slice(0, 2)}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Table controls */}
                <div className={styles.tableControls}>
                  <button
                    className={styles.controlBtn}
                    onClick={() => changeCapacity(table.id, -1)}
                    title="Reducir asientos"
                  >−</button>
                  <button
                    className={styles.controlBtn}
                    onClick={() => changeCapacity(table.id, 1)}
                    title="Añadir asiento"
                  >+</button>
                  <button
                    className={`${styles.controlBtn} ${styles.deleteTableBtn}`}
                    onClick={() => removeTable(table.id)}
                    title="Eliminar mesa"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendEmpty}`} /> Asiento libre
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendOccupied}`} /> Asiento ocupado
        </div>
        <div className={styles.legendItem}>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
            Doble clic en el nombre de mesa para renombrar · Arrastra la etiqueta para mover
          </span>
        </div>
      </div>
    </div>
  );
}
