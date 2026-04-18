"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Users, GripVertical, AlertCircle, RefreshCw } from "lucide-react";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  attending: boolean | null;
  has_plus_one: boolean;
  plus_one_name: string;
  children_count: number;
}

interface SeatNode {
  id: string; 
  name: string;
  type: 'adult' | 'child';
  guestId: string;
}

interface TableConfig {
  id: string;
  name: string;
  maxSeats: number;
  seats: SeatNode[];
}

interface SeatingLayout {
  unassigned: SeatNode[];
  tables: TableConfig[];
}

export default function TablePlanner() {
  const [layout, setLayout] = useState<SeatingLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messageId, setMessageId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch confirmed guests
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .eq('attending', true);
      
      if (guestsError) throw guestsError;

      // Flatten guests into seats
      const allNodes: SeatNode[] = [];
      (guestsData as Guest[]).forEach(g => {
        allNodes.push({ id: `${g.id}_main`, name: `${g.first_name} ${g.last_name}`, type: 'adult', guestId: g.id });
        if (g.has_plus_one) {
          allNodes.push({ id: `${g.id}_plusone`, name: g.plus_one_name || `Acompañante de ${g.first_name}`, type: 'adult', guestId: g.id });
        }
        for (let i = 0; i < g.children_count; i++) {
          allNodes.push({ id: `${g.id}_child_${i+1}`, name: `Niño ${i+1} de ${g.first_name}`, type: 'child', guestId: g.id });
        }
      });

      // 2. Fetch saved layout from messages
      const { data: layoutData, error: layoutError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_name', 'SYSTEM_SEATING_PLAN')
        .maybeSingle();

      if (layoutError && layoutError.code !== 'PGRST116') {
        throw layoutError;
      }

      const savedLayout = layoutData ? JSON.parse(layoutData.message) as { tables: TableConfig[] } : null;
      if (layoutData) {
        setMessageId(layoutData.id);
      }

      // 3. Reconcile
      let tables = savedLayout?.tables || [
        { id: 'presidential', name: 'Mesa Presidencial', maxSeats: 12, seats: [] },
        { id: 'table_1', name: 'Mesa 1', maxSeats: 10, seats: [] },
        { id: 'table_2', name: 'Mesa 2', maxSeats: 10, seats: [] }
      ];

      // Extract all assigned node IDs to see who is missing
      const assignedNodeIds = new Set<string>();
      tables.forEach(t => t.seats.forEach(s => assignedNodeIds.add(s.id)));

      // Find guests that were deleted/un-RSVP'd and remove them from tables
      const validationNodeIds = new Set(allNodes.map(n => n.id));
      tables = tables.map(t => ({
        ...t,
        seats: t.seats.filter(s => validationNodeIds.has(s.id))
      }));

      // Find Unassigned guests
      const assignedFilteredSet = new Set<string>();
      tables.forEach(t => t.seats.forEach(s => assignedFilteredSet.add(s.id)));

      const unassigned = allNodes.filter(n => !assignedFilteredSet.has(n.id));

      setLayout({ unassigned, tables });
    } catch (err) {
      console.error(err);
      alert("Error cargando el organizador de mesas.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, nodeId: string, sourceContainerId: string) => {
    e.dataTransfer.setData('nodeId', nodeId);
    e.dataTransfer.setData('sourceContainerId', sourceContainerId);
  };

  const handleDrop = (e: React.DragEvent, targetContainerId: string) => {
    e.preventDefault();
    if (!layout) return;

    const nodeId = e.dataTransfer.getData('nodeId');
    const sourceContainerId = e.dataTransfer.getData('sourceContainerId');

    if (sourceContainerId === targetContainerId) return;

    // Find the node
    let node: SeatNode | undefined;
    if (sourceContainerId === 'unassigned') {
      node = layout.unassigned.find(n => n.id === nodeId);
    } else {
      for (const t of layout.tables) {
        if (t.id === sourceContainerId) {
          node = t.seats.find(n => n.id === nodeId);
          break;
        }
      }
    }

    if (!node) return; // shouldn't happen

    // Check capacity if target is a table
    if (targetContainerId !== 'unassigned') {
      const targetTable = layout.tables.find(t => t.id === targetContainerId);
      if (targetTable && targetTable.seats.length >= targetTable.maxSeats) {
        alert("Esta mesa ya está llena.");
        return;
      }
    }

    // Create a deep copy of layout to modify
    const newLayout = { ...layout };
    newLayout.tables = newLayout.tables.map(t => ({ ...t, seats: [...t.seats] }));
    newLayout.unassigned = [...newLayout.unassigned];

    // Remove from source
    if (sourceContainerId === 'unassigned') {
      newLayout.unassigned = newLayout.unassigned.filter(n => n.id !== nodeId);
    } else {
      const srcTable = newLayout.tables.find(t => t.id === sourceContainerId);
      if (srcTable) {
        srcTable.seats = srcTable.seats.filter(n => n.id !== nodeId);
      }
    }

    // Add to target
    if (targetContainerId === 'unassigned') {
      newLayout.unassigned.push(node);
    } else {
      const tgtTable = newLayout.tables.find(t => t.id === targetContainerId);
      if (tgtTable) {
        tgtTable.seats.push(node);
      }
    }

    setLayout(newLayout);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessary to allow drop
  };

  const addTable = () => {
    if (!layout) return;
    const number = layout.tables.length + 1;
    setLayout({
      ...layout,
      tables: [...layout.tables, { id: `table_${Date.now()}`, name: `Nueva Mesa ${number}`, maxSeats: 10, seats: [] }]
    });
  };

  const deleteTable = (id: string) => {
    if (!layout) return;
    if (confirm("¿Estás seguro de eliminar esta mesa? Los invitados volverán a 'Sin Asignar'.")) {
      const table = layout.tables.find(t => t.id === id);
      if (!table) return;

      const newLayout = { ...layout };
      newLayout.tables = newLayout.tables.filter(t => t.id !== id);
      newLayout.unassigned = [...newLayout.unassigned, ...table.seats];
      setLayout(newLayout);
    }
  };

  const changeTableName = (id: string, newName: string) => {
    if (!layout) return;
    setLayout({
      ...layout,
      tables: layout.tables.map(t => t.id === id ? { ...t, name: newName } : t)
    });
  };

  const changeTableCapacity = (id: string, maxSeats: number) => {
    if (!layout) return;
    setLayout({
      ...layout,
      tables: layout.tables.map(t => t.id === id ? { ...t, maxSeats } : t)
    });
  };

  const saveLayout = async () => {
    if (!layout) return;
    setSaving(true);
    try {
      const layoutDataToSave = {
        tables: layout.tables
      };
      
      if (messageId) {
        // Update existing definition
        const { error } = await supabase
          .from('messages')
          .update({ message: JSON.stringify(layoutDataToSave) })
          .eq('id', messageId);
        if (error) throw error;
      } else {
        // Insert new definition
        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_name: 'SYSTEM_SEATING_PLAN',
            message: JSON.stringify(layoutDataToSave)
          })
          .select('id')
          .single();
          
        if (error) throw error;
        if (data) setMessageId(data.id);
      }

      alert("Organizador guardado exitosamente!");
    } catch (err) {
      console.error(err);
      alert("Error guardando el organizador.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: "4rem", color: "#64748b" }}><RefreshCw className="animate-spin" size={32} /></div>;
  }

  if (!layout) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 40px)', paddingBottom: '2rem' }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", color: "#0f172a" }}>Organizador de Mesas</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Arrastra a los invitados a sus respectivas mesas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={addTable}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "8px", border: "1px dashed #cbd5e1", background: "transparent", color: "#475569", fontWeight: "600", cursor: "pointer" }}
          >
            <Plus size={18} /> Añadir Mesa
          </button>
          <button 
            onClick={saveLayout}
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", background: "#0f172a", color: "white", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer" }}
          >
            <Save size={18} /> {saving ? "Guardando..." : "Guardar Diseño"}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        {/* Unassigned Sidebar */}
        <div 
          style={{ width: "300px", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'unassigned')}
        >
          <div style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#334155", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={18} /> Sin asignar
            </h3>
            <span style={{ background: "#e2e8f0", color: "#475569", padding: "0.125rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
              {layout.unassigned.length}
            </span>
          </div>
          
          <div style={{ padding: "1rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {layout.unassigned.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <Users size={32} />
                <span style={{ fontSize: "0.875rem" }}>Todos los invitados están asignados</span>
              </div>
            ) : (
              layout.unassigned.map(node => (
                <div 
                  key={node.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node.id, 'unassigned')}
                  style={{ padding: "0.75rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "grab", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                >
                  <GripVertical size={14} color="#94a3b8" />
                  <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>
                    {node.name}
                  </span>
                  {node.type === 'child' && (
                    <span style={{ fontSize: "0.65rem", background: "#f1f5f9", padding: "0.125rem 0.375rem", borderRadius: "4px", color: "#64748b", textTransform: "uppercase" }}>Niño</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tables Canvas */}
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem", alignContent: "start" }}>
          {layout.tables.map(table => (
            <motion.div 
              key={table.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden", border: table.seats.length > table.maxSeats ? "2px solid #ef4444" : "1px solid #e2e8f0" }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, table.id)}
            >
              <div style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", background: table.id === 'presidential' ? "#f8fafc" : "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <input 
                    type="text" 
                    value={table.name} 
                    onChange={e => changeTableName(table.id, e.target.value)}
                    style={{ fontSize: "1.125rem", fontWeight: 700, border: "1px solid transparent", outline: "none", background: "transparent", color: "#0f172a", width: "100%", padding: "0.25rem", borderRadius: "4px" }}
                    onFocus={e => e.target.style.borderColor = "#cbd5e1"}
                    onBlur={e => e.target.style.borderColor = "transparent"}
                  />
                  {table.id !== 'presidential' && (
                    <button onClick={() => deleteTable(table.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "0.25rem" }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.875rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Capacidad: 
                    <input 
                      type="number" 
                      value={table.maxSeats} 
                      onChange={e => changeTableCapacity(table.id, parseInt(e.target.value) || 0)}
                      style={{ width: "40px", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "0.125rem", textAlign: "center", fontSize: "0.875rem" }}
                    />
                  </div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: table.seats.length > table.maxSeats ? "#ef4444" : table.seats.length === table.maxSeats ? "#10b981" : "#3b82f6" }}>
                    {table.seats.length} / {table.maxSeats}
                  </span>
                </div>
              </div>

              <div style={{ padding: "1rem", minHeight: "150px", display: "flex", flexDirection: "column", gap: "0.5rem", background: "#f8fafc", transition: "background 0.2s" }}>
                {table.seats.length === 0 ? (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.875rem", border: "1px dashed #cbd5e1", borderRadius: "8px" }}>
                    Arrastra invitados aquí
                  </div>
                ) : (
                  table.seats.map((node, idx) => (
                    <div 
                      key={node.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node.id, table.id)}
                      style={{ padding: "0.5rem 0.75rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "grab", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", position: "relative" }}
                    >
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8", minWidth: "1rem" }}>{idx + 1}.</span>
                      <GripVertical size={14} color="#cbd5e1" />
                      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>
                        {node.name}
                      </span>
                      {node.type === 'child' && (
                        <span style={{ fontSize: "0.65rem", background: "#f1f5f9", padding: "0.125rem 0.375rem", borderRadius: "4px", color: "#64748b", textTransform: "uppercase" }}>Niño</span>
                      )}
                    </div>
                  ))
                )}
                {table.seats.length > table.maxSeats && (
                  <div style={{ padding: "0.5rem", background: "#fef2f2", border: "1px dashed #fca5a5", color: "#ef4444", fontSize: "0.75rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <AlertCircle size={14} /> Excede límite
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
