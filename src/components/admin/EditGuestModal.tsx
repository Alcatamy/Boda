"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Save, FileEdit } from "lucide-react";

export default function EditGuestModal({ guest, onClose, onUpdate }: { guest: any; onClose: () => void; onUpdate: () => void }) {
  const [formData, setFormData] = useState({
    first_name: guest.first_name || "",
    last_name: guest.last_name || "",
    attending: guest.attending,
    menu_choice: guest.menu_choice || "",
    dietary_restrictions: guest.dietary_restrictions || "",
    has_plus_one: guest.has_plus_one || false,
    plus_one_name: guest.plus_one_name || "",
    plus_one_menu_choice: guest.plus_one_menu_choice || "",
    children_count: guest.children_count || 0,
    message: guest.message || ""
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('guests')
        .update(formData)
        .eq('id', guest.id);
      
      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error("Error updating guest:", error);
      alert("Error actualizando invitado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 50, padding: "1rem"
    }}>
      <div style={{
        background: "white", borderRadius: "12px", width: "100%", maxWidth: "500px",
        maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
      }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "white", zIndex: 10 }}>
          <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem" }}>
            <FileEdit size={20} /> Editar Invitado
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>Nombre</label>
              <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>Apellidos</label>
              <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} required />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>Asistencia</label>
            <select value={formData.attending === null ? "pending" : formData.attending ? "true" : "false"} onChange={e => setFormData({...formData, attending: e.target.value === "pending" ? null : e.target.value === "true"})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
              <option value="pending">Pendiente</option>
              <option value="true">Sí asiste</option>
              <option value="false">No asiste</option>
            </select>
          </div>

          {formData.attending && (
            <>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>Menú</label>
                <select value={formData.menu_choice} onChange={e => setFormData({...formData, menu_choice: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                  <option value="">No seleccionado</option>
                  <option value="meat">Carne</option>
                  <option value="fish">Pescado</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>Alergias / Restricciones</label>
                <input type="text" value={formData.dietary_restrictions} onChange={e => setFormData({...formData, dietary_restrictions: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              </div>

              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.has_plus_one} onChange={e => setFormData({...formData, has_plus_one: e.target.checked})} />
                  Trae acompañante (+1)
                </label>
                
                {formData.has_plus_one && (
                  <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Nombre +1</label>
                      <input type="text" value={formData.plus_one_name} onChange={e => setFormData({...formData, plus_one_name: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Menú +1</label>
                      <select value={formData.plus_one_menu_choice} onChange={e => setFormData({...formData, plus_one_menu_choice: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                        <option value="">Sin menú</option>
                        <option value="meat">Carne</option>
                        <option value="fish">Pescado</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>Número de niños</label>
                <input type="number" min="0" value={formData.children_count} onChange={e => setFormData({...formData, children_count: parseInt(e.target.value) || 0})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              </div>

            </>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>Mensaje del invitado</label>
            <textarea rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.75rem 1.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer", fontWeight: "600" }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", borderRadius: "6px", border: "none", background: "#1a1a1a", color: "white", cursor: saving ? "not-allowed" : "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Save size={18} /> {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
