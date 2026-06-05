"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RefreshCw, Printer } from "lucide-react";
import styles from "./TablePlanner.module.css";

// ─── Interfaces ──────────────────────────────────────────────────────────────

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

interface SeatingGuest {
  id: string;
  name: string;
  ap: string;
  table: number | '__none__';
  menu: 'Carne' | 'Pescado' | 'Especial' | 'Infantil' | '?';
  conf: boolean;
  child: boolean;
  al: string;
  ac: string;
  guestId?: string;
  isPlusOne?: boolean;
  isChild?: boolean;
}

interface TableConfig {
  id: number;
  name: string;
  head?: boolean;
  pos?: number[];
}

interface SeatingPlanData {
  version: number;
  updatedAt: string;
  tables: TableConfig[];
  guests: SeatingGuest[];
  deletedSeatKeys: string[];
  hiddenGuestKeys: string[];
}

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'local' | 'error';

// ─── Constants ───────────────────────────────────────────────────────────────

const TABLES: TableConfig[] = [
  { id: 1, name: 'Balón de oro', head: true },
  { id: 2, name: 'MVP' },
  { id: 3, name: 'Pole Position' },
  { id: 6, name: 'Hoyo en uno' },
  { id: 7, name: 'Strike' },
  { id: 4, name: 'Maillot Amarillo' },
  { id: 5, name: 'ACE' },
  { id: 12, name: 'Smash' },
  { id: 13, name: 'Cinturón negro' },
  { id: 8, name: 'Home run' },
  { id: 9, name: 'Touchdown' },
  { id: 10, name: 'K.O.' },
  { id: 11, name: 'Jaque Mate' },
  { id: 14, name: 'Órdago' },
  { id: 15, name: '' },
  { id: 16, name: 'Foto Finish' },
  { id: 17, name: '180' },
  { id: 18, name: 'Triple Corona' }
];

const SEATS: Record<number, string[]> = {
  1: ['Adrián', 'Nadia', 'Antonio', 'Raquel', 'Rafael', 'Mariví'],
  2: ['Marta', 'Roberto', 'Ana', 'Nerea', 'Emma', 'Gabi', 'Silvia', 'Mary', 'Antonio'],
  3: ['Virtudes', 'Ana', 'Manolo', 'Kiko', 'Martín', 'Leti', 'Andrea', 'Raúl'],
  4: ['Josema', 'Soraya', 'Moreno', 'Nacho', 'Maca', 'Lucía', 'Pablo', 'Víctor', 'Aroa'],
  5: ['Óscar', 'Laura', 'Claudia', 'Myri', 'Álvaro', 'Patri', 'Ale', 'Ana R', 'Alex'],
  6: ['Mercedes', 'Carla', 'Víctor', 'Ana', 'Paula', 'Hugo', 'Jose V', 'Merce', 'Martín'],
  7: ['Gerardo', 'Jimena', 'Esther', 'Gabi', 'Lucía', 'Bea', 'Jesús'],
  8: ['Mariví', 'Juan Manuel', 'Beatriz', 'Gaizka', 'Ucho', 'Rafa', 'Úrsula', 'Novio'],
  9: ['Lupe', 'Jose', 'Sergio', 'Uxue', 'Maitane', 'Luken', 'Darío', 'Ashraf', 'Rubén'],
  10: ['Pepe', 'Lexis', 'Álvarez', 'Raquel', 'Claudia', 'Alex D.P', 'Vigar', 'Ludo', 'Giorgio'],
  11: ['Tamara', 'Nacho', 'Nacho', 'Sandra', 'Marcos', 'Oliver', 'Sara', 'Sandra', 'Enrique'],
  12: ['Luis', 'Juani', 'Javi', 'Luisje', 'Nines', 'Leo', 'Loli', 'Dioni', 'Rosi'],
  13: ['Charo', 'Chelo', 'Pedro', 'Samuel', 'Mariana', 'Nerea', 'Víctor', 'Joel'],
  14: ['Ernesto', 'Andoni', 'Alberto', 'Arturo', 'Lucía', 'Ignacio', 'Laia', 'Íñigo', 'Ainhoa'],
  15: ['Ana', 'Diana', 'Valle', 'Cris', 'Lola'],
  16: ['Alberto', 'Leticia', 'Alfredo', 'Alfredito', 'Alba', 'Alba', 'Elena', 'Fran', 'Kiko'],
  17: ['Joel', 'Iván', 'Elena', 'Mirian', 'Alba', 'Dieguito', 'Diego', 'Esther', 'Natalia'],
  18: ['Marisa', 'Gonzalo', 'Julián', 'Nieves', 'Adri', 'Andrei', 'Laura', 'Lucía']
};

const KIDS = new Set(['Emma', 'Martín', 'Paula', 'Hugo', 'Uxue', 'Luken', 'Darío', 'Fran', 'Dieguito']);

const ALIAS: Record<string, string> = {
  adri: 'adrian', myri: 'myriam', maca: 'maca', lexis: 'alexis',
  marivi: 'maria victoria', mari: 'maria victoria', ale: 'alejandro',
  rafa: 'rafael', 'jose v': 'jose vicente', merce: 'mercedes',
  juani: 'juani', javi: 'javier', luisje: 'luis', ruben: 'ruben',
  oscar: 'oscar', ursula: 'ursula', valle: 'maria del valle',
  cris: 'cristina', leti: 'leticia', raul: 'raul', mary: 'maria jesus',
  rosi: 'maria rosa', patri: 'patricia', 'ana r': 'ana',
  oliver: 'oliver', marisa: 'marisa', jose: 'jose'
};

const GRID_POSITIONS: Record<number, { row: number; col: string }> = {
  1: { row: 1, col: '3 / span 2' },
  2: { row: 1, col: '1' },
  3: { row: 1, col: '2' },
  6: { row: 1, col: '5' },
  7: { row: 1, col: '6' },
  4: { row: 2, col: '3' },
  5: { row: 2, col: '4' },
  8: { row: 3, col: '1' },
  9: { row: 3, col: '2' },
  10: { row: 3, col: '3' },
  11: { row: 3, col: '4' },
  12: { row: 3, col: '5' },
  13: { row: 3, col: '6' },
  14: { row: 4, col: '1' },
  15: { row: 4, col: '2' },
  16: { row: 4, col: '3 / span 2' },
  17: { row: 4, col: '5' },
  18: { row: 4, col: '6' }
};

const FORCE: Record<string, { menu?: 'Carne' | 'Pescado' | 'Especial' | 'Infantil' | '?'; conf?: boolean }> = {
  '1:Adrián': { menu: 'Pescado', conf: true },
  '1:Nadia': { menu: 'Pescado', conf: true }
};

const MENU_ICON: Record<string, string> = {
  Carne: '🥩', Pescado: '🐟', Especial: '🥗', Infantil: '🧒', '?': '❓'
};

const STORAGE_KEY = 'mesasBodaNA_v5';
const AUTOSAVE_DELAY_MS = 900;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function norm(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapDbMenu(choice: string | undefined | null): 'Carne' | 'Pescado' | 'Especial' | 'Infantil' | '?' {
  if (!choice) return '?';
  const c = choice.toLowerCase();
  if (c === 'meat' || c === 'carne') return 'Carne';
  if (c === 'fish' || c === 'pescado') return 'Pescado';
  if (c === 'special' || c === 'especial') return 'Especial';
  if (c === 'child' || c === 'infantil') return 'Infantil';
  return '?';
}

function mapMenuToDb(menu: string): string {
  if (menu === 'Carne') return 'meat';
  if (menu === 'Pescado') return 'fish';
  if (menu === 'Especial') return 'special';
  if (menu === 'Infantil') return 'child';
  return '';
}

function makePlanData(
  tables: TableConfig[],
  guests: SeatingGuest[],
  deletedSeatKeys: Set<string>,
  hiddenGuestKeys: Set<string>
): SeatingPlanData {
  return {
    version: 2,
    updatedAt: new Date().toISOString(),
    tables,
    guests,
    deletedSeatKeys: Array.from(deletedSeatKeys),
    hiddenGuestKeys: Array.from(hiddenGuestKeys),
  };
}

function normalizePlanData(raw: unknown): SeatingPlanData | null {
  if (!raw) return null;

  if (Array.isArray(raw)) {
    return {
      version: 1,
      updatedAt: '',
      tables: TABLES,
      guests: raw as SeatingGuest[],
      deletedSeatKeys: [],
      hiddenGuestKeys: [],
    };
  }

  if (typeof raw !== 'object') return null;
  const plan = raw as Partial<SeatingPlanData>;
  if (!Array.isArray(plan.guests) || plan.guests.length === 0) return null;

  return {
    version: typeof plan.version === 'number' ? plan.version : 1,
    updatedAt: typeof plan.updatedAt === 'string' ? plan.updatedAt : '',
    tables: Array.isArray(plan.tables) && plan.tables.length > 0 ? plan.tables : TABLES,
    guests: plan.guests as SeatingGuest[],
    deletedSeatKeys: Array.isArray(plan.deletedSeatKeys) ? plan.deletedSeatKeys : [],
    hiddenGuestKeys: Array.isArray(plan.hiddenGuestKeys) ? plan.hiddenGuestKeys : [],
  };
}

function getPlanTimestamp(plan: SeatingPlanData | null): number {
  if (!plan?.updatedAt) return 0;
  const timestamp = new Date(plan.updatedAt).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function chooseNewestPlan(
  supabasePlan: SeatingPlanData | null,
  localPlan: SeatingPlanData | null
): { plan: SeatingPlanData | null; source: 'supabase' | 'local' | 'none' } {
  if (supabasePlan && localPlan) {
    return getPlanTimestamp(localPlan) > getPlanTimestamp(supabasePlan)
      ? { plan: localPlan, source: 'local' }
      : { plan: supabasePlan, source: 'supabase' };
  }

  if (supabasePlan) return { plan: supabasePlan, source: 'supabase' };
  if (localPlan) return { plan: localPlan, source: 'local' };
  return { plan: null, source: 'none' };
}

function readLocalPlan(): SeatingPlanData | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizePlanData(JSON.parse(raw)) : null;
  } catch (err) {
    console.error("Error reading local seating plan:", err);
    return null;
  }
}

function writeLocalPlan(planData: SeatingPlanData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(planData));
}

function getSeatTemplateKey(guest: SeatingGuest): string | null {
  return guest.guestId || guest.table === '__none__' ? null : `${guest.table}:${guest.name}`;
}

function getGuestRecordKey(guest: Pick<SeatingGuest, 'guestId' | 'isPlusOne'>): string | null {
  if (!guest.guestId) return null;
  return `${guest.guestId}:${guest.isPlusOne ? 'plusone' : 'main'}`;
}

export default function TablePlanner() {
  const [tables, setTables] = useState<TableConfig[]>(TABLES);
  const [guests, setGuests] = useState<SeatingGuest[]>([]);
  const [dbGuests, setDbGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [deletedSeatKeys, setDeletedSeatKeys] = useState<Set<string>>(new Set());
  const [hiddenGuestKeys, setHiddenGuestKeys] = useState<Set<string>>(new Set());
  const loadedRef = useRef(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveSeqRef = useRef(0);
  
  // Drag targets tracking
  const [overTableId, setOverTableId] = useState<number | '__none__' | null>(null);
  const [overSeatId, setOverSeatId] = useState<string | null>(null);
  const [addPersonTableId, setAddPersonTableId] = useState<number | null>(null);

  // Popover state
  const [popoverGuest, setPopoverGuest] = useState<SeatingGuest | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const planData = makePlanData(tables, guests, deletedSeatKeys, hiddenGuestKeys);
    writeLocalPlan(planData);

    if (!loadedRef.current) {
      loadedRef.current = true;
      return;
    }

    setSaveStatus('dirty');
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      void savePlanSnapshot(planData, { silent: true });
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [tables, guests, deletedSeatKeys, hiddenGuestKeys, loading]);

  const loadData = async () => {
    let localPlan: SeatingPlanData | null = null;

    try {
      setLoading(true);
      setSaveStatus('idle');
      localPlan = readLocalPlan();
      
      // 1. Fetch guests from DB, but keep the local plan usable if Supabase is unavailable.
      const { data: dbData, error: dbError } = await supabase.from('guests').select('*');
      if (dbError && !localPlan) throw dbError;
      const guestsList = (dbData || []) as Guest[];
      setDbGuests(guestsList);

      // 2. Fetch saved layout from seating_plan
      const { data: planData, error: planError } = await supabase
        .from('seating_plan')
        .select('plan_data')
        .eq('id', 'main')
        .maybeSingle();

      if (planError) {
        console.error("Error loading Supabase seating plan:", planError);
      }

      const supabasePlan = normalizePlanData(planData?.plan_data);
      const { plan: savedLayout, source: savedLayoutSource } = chooseNewestPlan(supabasePlan, localPlan);
      const loadedTables = savedLayout?.tables?.length ? savedLayout.tables : TABLES;
      const nextDeletedSeatKeys = new Set(savedLayout?.deletedSeatKeys || []);
      const nextHiddenGuestKeys = new Set(savedLayout?.hiddenGuestKeys || []);

      // 3. Reconcile or build initial
      let reconciled: SeatingGuest[] = [];
      const confirmedDbGuests = guestsList.filter(g => g.attending === true);

      if (dbError && savedLayout) {
        setTables(loadedTables);
        setDeletedSeatKeys(nextDeletedSeatKeys);
        setHiddenGuestKeys(nextHiddenGuestKeys);
        setGuests(savedLayout.guests);
        setLastSavedAt(savedLayout.updatedAt || '');
        setSaveStatus('local');
        return;
      }

      if (savedLayout && Array.isArray(savedLayout.guests)) {
        const savedGuests = savedLayout.guests;
        const dbMap = new Map<string, Guest>();
        guestsList.forEach(g => dbMap.set(g.id, g));

        const processedGuestKeys = new Set<string>();

        savedGuests.forEach(sg => {
          const guestKey = getGuestRecordKey(sg);
          const seatKey = getSeatTemplateKey(sg);
          if (guestKey && nextHiddenGuestKeys.has(guestKey)) return;
          if (seatKey && nextDeletedSeatKeys.has(seatKey)) return;

          if (sg.guestId) {
            const dbg = dbMap.get(sg.guestId);
            if (dbg && dbg.attending === true) {
              // Guest is still attending - update live details
              reconciled.push({
                ...sg,
                name: sg.isPlusOne ? (dbg.plus_one_name || sg.name) : dbg.first_name,
                ap: sg.isPlusOne ? "" : (dbg.last_name ? dbg.last_name.split(' ')[0] : ""),
                menu: sg.isChild 
                  ? 'Infantil' 
                  : (sg.isPlusOne ? mapDbMenu(dbg.plus_one_menu_choice || dbg.menu_choice) : mapDbMenu(dbg.menu_choice)),
                al: dbg.dietary_restrictions || "",
                ac: dbg.plus_one_name || "",
                conf: true
              });
              if (guestKey) processedGuestKeys.add(guestKey);
            }
            // If they are no longer attending, we drop them. 
            // If they occupied a default seat template, we will restore it later.
          } else {
            // Placeholder seat or child
            reconciled.push(sg);
          }
        });

        // Add default seat template placeholders for missing seats
        const reconciledSeatKeys = new Set(reconciled.map(g => `${g.table}:${g.name}`));
        loadedTables.forEach(t => {
          const originalSeats = SEATS[t.id] || [];
          originalSeats.forEach(seatName => {
            const key = `${t.id}:${seatName}`;
            if (!reconciledSeatKeys.has(key) && !nextDeletedSeatKeys.has(key)) {
              // Seat is missing, recreate it empty/unconfirmed
              reconciled.push({
                id: 'g_placeholder_' + t.id + '_' + seatName,
                name: seatName,
                ap: '',
                table: t.id,
                menu: KIDS.has(seatName) ? 'Infantil' : '?',
                conf: KIDS.has(seatName) ? true : false,
                child: KIDS.has(seatName),
                al: '',
                ac: ''
              });
            }
          });
        });

        // Add newly confirmed guests not yet in the layout to the tray
        confirmedDbGuests.forEach(dbg => {
          const mainKey = `${dbg.id}:main`;
          const plusOneKey = `${dbg.id}:plusone`;

          if (!processedGuestKeys.has(mainKey) && !nextHiddenGuestKeys.has(mainKey)) {
            reconciled.push({
              id: 'g_' + dbg.id + '_main',
              name: dbg.first_name,
              ap: dbg.last_name ? dbg.last_name.split(' ')[0] : "",
              table: '__none__',
              menu: mapDbMenu(dbg.menu_choice),
              conf: true,
              child: false,
              al: dbg.dietary_restrictions || "",
              ac: dbg.plus_one_name || "",
              guestId: dbg.id
            });
            processedGuestKeys.add(mainKey);
          }

          if (dbg.has_plus_one && !processedGuestKeys.has(plusOneKey) && !nextHiddenGuestKeys.has(plusOneKey)) {
            reconciled.push({
              id: 'g_' + dbg.id + '_plusone',
              name: dbg.plus_one_name || `Acompañante de ${dbg.first_name}`,
              ap: "",
              table: '__none__',
              menu: mapDbMenu(dbg.plus_one_menu_choice || dbg.menu_choice),
              conf: true,
              child: false,
              al: "",
              ac: "",
              guestId: dbg.id,
              isPlusOne: true
            });
            processedGuestKeys.add(plusOneKey);
          }
        });
      } else {
        // Fallback to initial build
        reconciled = buildInitial(confirmedDbGuests);
      }

      setTables(loadedTables);
      setDeletedSeatKeys(nextDeletedSeatKeys);
      setHiddenGuestKeys(nextHiddenGuestKeys);
      setGuests(reconciled);
      setLastSavedAt(savedLayout?.updatedAt || '');
      setSaveStatus(savedLayoutSource === 'supabase' ? 'saved' : savedLayoutSource === 'local' ? 'local' : 'idle');
    } catch (err) {
      console.error("Error loading visual planner data:", err);
      if (localPlan) {
        setTables(localPlan.tables);
        setDeletedSeatKeys(new Set(localPlan.deletedSeatKeys));
        setHiddenGuestKeys(new Set(localPlan.hiddenGuestKeys));
        setGuests(localPlan.guests);
        setLastSavedAt(localPlan.updatedAt);
        setSaveStatus('local');
      } else {
        alert("Error al cargar los datos del plano.");
        setSaveStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const buildInitial = (confirmedList: Guest[]): SeatingGuest[] => {
    const recs = confirmedList.map((r, i) => ({ ...r, _i: i }));
    const used: Record<number, boolean> = {};
    const arr: SeatingGuest[] = [];
    let idCounter = 0;

    // Accompanists list
    const compNames: string[] = [];
    const compMenu: Record<string, 'Carne' | 'Pescado' | 'Especial' | 'Infantil' | '?'> = {};

    recs.forEach(r => {
      if (r.plus_one_name) {
        r.plus_one_name.split(/[,/]| y | e /).forEach(p => {
          const fn = norm(p).split(' ')[0];
          if (fn.length >= 3) {
            compNames.push(fn);
            if (!compMenu[fn]) compMenu[fn] = mapDbMenu(r.plus_one_menu_choice || r.menu_choice);
          }
        });
      }
    });

    const take = (seatName: string) => {
      const key = ALIAS[norm(seatName)] || norm(seatName);
      const fn = key.split(' ')[0];
      let c: typeof recs[number] | undefined;

      if (key.indexOf(' ') >= 0) {
        c = recs.find(r => !used[r._i] && (norm(r.first_name + ' ' + r.last_name).indexOf(key) >= 0 || norm(r.first_name).indexOf(key) >= 0));
      }
      if (!c) {
        c = recs.find(r => !used[r._i] && norm(r.first_name).split(' ')[0] === fn);
      }
      if (c) {
        used[c._i] = true;
      }
      return c;
    };

    TABLES.forEach(t => {
      const seats = SEATS[t.id] || [];
      seats.forEach(seatName => {
        const kid = KIDS.has(seatName);
        const rec = take(seatName);
        const fn = (ALIAS[norm(seatName)] || norm(seatName)).split(' ')[0];

        // FIXED CLAUDE BUG: Use compMenu[fn] correctly to inherit menu
        let conf = rec ? true : (compNames.indexOf(fn) >= 0);
        let menu: SeatingGuest['menu'] = kid ? 'Infantil' : (rec ? mapDbMenu(rec.menu_choice) : (compMenu[fn] || '?'));
        if (kid) conf = true;

        const g: SeatingGuest = {
          id: 'g' + (idCounter++),
          name: seatName,
          ap: rec ? rec.last_name.split(' ')[0] : '',
          table: t.id,
          menu,
          conf: conf,
          child: kid,
          al: rec ? rec.dietary_restrictions || '' : '',
          ac: rec ? rec.plus_one_name || '' : '',
          guestId: rec ? rec.id : undefined,
          isPlusOne: !rec && (compNames.indexOf(fn) >= 0) ? true : undefined,
          isChild: kid ? true : undefined
        };

        const fx = FORCE[t.id + ':' + seatName];
        if (fx) {
          if (fx.menu) g.menu = fx.menu;
          if (fx.conf !== undefined) g.conf = fx.conf;
        }

        arr.push(g);
      });
    });

    // Unassigned confirmed guests
    recs.forEach(r => {
      if (!used[r._i]) {
        arr.push({
          id: 'g' + (idCounter++),
          name: r.first_name,
          ap: r.last_name ? r.last_name.split(' ')[0] : '',
          table: '__none__',
          menu: mapDbMenu(r.menu_choice),
          conf: true,
          child: false,
          al: r.dietary_restrictions || '',
          ac: r.plus_one_name || '',
          guestId: r.id
        });

        if (r.has_plus_one) {
          arr.push({
            id: 'g' + (idCounter++),
            name: r.plus_one_name || `Acompañante de ${r.first_name}`,
            ap: '',
            table: '__none__',
            menu: mapDbMenu(r.plus_one_menu_choice || r.menu_choice),
            conf: true,
            child: false,
            al: '',
            ac: '',
            guestId: r.id,
            isPlusOne: true
          });
        }
      }
    });

    return arr;
  };

  // Drag and drop mechanics
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setOverTableId(null);
    setOverSeatId(null);
  };

  const moveGuest = (id: string, targetTable: number | '__none__', beforeId?: string | null) => {
    setGuests(prev => {
      const next = [...prev];
      const i = next.findIndex(x => x.id === id);
      if (i < 0) return prev;

      const g = { ...next.splice(i, 1)[0] };
      g.table = targetTable;

      if (beforeId) {
        const j = next.findIndex(x => x.id === beforeId);
        if (j !== -1) {
          next.splice(j, 0, g);
          return next;
        }
      }

      // Re-add at the end of the table
      let lastIndex = -1;
      next.forEach((x, k) => {
        if (x.table === targetTable) lastIndex = k;
      });
      next.splice(lastIndex + 1, 0, g);
      return next;
    });
  };

  const handleTouchTableClick = (
    e: React.MouseEvent<HTMLElement>,
    tableId: number | '__none__',
    beforeId?: string | null
  ) => {
    if (!selectedGuestId) return;
    e.preventDefault();
    e.stopPropagation();
    moveGuest(selectedGuestId, tableId, beforeId);
    setSelectedGuestId(null);
  };

  const handleInsertClick = (
    e: React.MouseEvent<HTMLElement>,
    tableId: number | '__none__',
    beforeId?: string | null
  ) => {
    handleTouchTableClick(e, tableId, beforeId);
  };

  const handleGuestClick = (e: React.MouseEvent<HTMLElement>, guest: SeatingGuest) => {
    e.stopPropagation();

    if (selectedGuestId && selectedGuestId !== guest.id) {
      moveGuest(selectedGuestId, guest.table, guest.id);
      setSelectedGuestId(null);
      return;
    }

    openPopover(guest, e.currentTarget);
  };

  const handleTableDragOver = (e: React.DragEvent, tableId: number | '__none__') => {
    e.preventDefault();
    setOverTableId(tableId);
  };

  const handleTableDrop = (e: React.DragEvent, tableId: number | '__none__') => {
    e.preventDefault();
    if (!draggedId) return;
    moveGuest(draggedId, tableId, null);
    handleDragEnd();
  };

  const handleSeatDragOver = (e: React.DragEvent, seatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOverSeatId(seatId);
  };

  const handleSeatDrop = (e: React.DragEvent, targetGuest: SeatingGuest) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedId || draggedId === targetGuest.id) return;
    moveGuest(draggedId, targetGuest.table, targetGuest.id);
    handleDragEnd();
  };

  // Popup edition logic
  const openPopover = (guest: SeatingGuest, targetEl: HTMLElement) => {
    setPopoverGuest(guest);
    setPopoverAnchor(targetEl.getBoundingClientRect());
  };

  const closePopover = () => {
    setPopoverGuest(null);
    setPopoverAnchor(null);
  };

  const updateDbGuest = async (guestId: string, updates: Partial<Guest>) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', guestId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error updating guest in db:", err);
      setSaveStatus('local');
      return false;
    }
  };

  const handlePopoverMenuChoice = async (m: 'Carne' | 'Pescado' | 'Especial' | 'Infantil' | '?') => {
    if (!popoverGuest) return;
    
    // Update local state
    setGuests(prev => prev.map(g => g.id === popoverGuest.id ? { ...g, menu: m, child: m === 'Infantil' ? true : g.child } : g));
    
    // Sync to DB
    if (popoverGuest.guestId) {
      const dbMenu = mapMenuToDb(m);
      const updates: Partial<Guest> = {};
      if (popoverGuest.isPlusOne) {
        updates.plus_one_menu_choice = dbMenu;
      } else {
        updates.menu_choice = dbMenu;
      }
      await updateDbGuest(popoverGuest.guestId, updates);
    }

    setPopoverGuest(prev => prev ? { ...prev, menu: m, child: m === 'Infantil' ? true : prev.child } : null);
  };

  const handlePopoverConfChange = async (confVal: boolean) => {
    if (!popoverGuest) return;

    setGuests(prev => prev.map(g => g.id === popoverGuest.id ? { ...g, conf: confVal } : g));

    if (popoverGuest.guestId && !popoverGuest.isPlusOne) {
      await updateDbGuest(popoverGuest.guestId, { attending: confVal });
    }

    setPopoverGuest(prev => prev ? { ...prev, conf: confVal } : null);
  };

  const handlePopoverChildChange = async () => {
    if (!popoverGuest) return;

    const newChild = !popoverGuest.child;
    const newMenu: SeatingGuest['menu'] = newChild ? 'Infantil' : 'Carne';

    setGuests(prev => prev.map(g => g.id === popoverGuest.id ? { ...g, child: newChild, menu: newMenu } : g));

    if (popoverGuest.guestId) {
      if (popoverGuest.isPlusOne) {
        await updateDbGuest(popoverGuest.guestId, { plus_one_menu_choice: newChild ? 'child' : 'meat' });
      } else {
        await updateDbGuest(popoverGuest.guestId, { menu_choice: newChild ? 'child' : 'meat' });
      }
    }

    setPopoverGuest(prev => prev ? { ...prev, child: newChild, menu: newMenu } : null);
  };

  const deleteGuest = async (guest: SeatingGuest, confirmDelete = true) => {
    if (confirmDelete && !window.confirm(`¿Eliminar a ${guest.name} del organizador?`)) {
      return;
    }

    const guestKey = getGuestRecordKey(guest);
    const seatKey = getSeatTemplateKey(guest);

    setGuests(prev => prev.filter(g => g.id !== guest.id));
    setSelectedGuestId(prev => prev === guest.id ? null : prev);

    if (guestKey) {
      setHiddenGuestKeys(prev => new Set(prev).add(guestKey));
    }

    if (seatKey) {
      setDeletedSeatKeys(prev => new Set(prev).add(seatKey));
    }

    if (guest.guestId && !guest.isPlusOne && !guest.isChild) {
      const deleted = await deleteDbGuest(guest.guestId);
      if (!deleted) {
        await updateDbGuest(guest.guestId, { attending: false });
      }
    }

    closePopover();
  };

  const deleteDbGuest = async (guestId: string) => {
    try {
      const { error } = await supabase.from('guests').delete().eq('id', guestId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error deleting guest:", err);
      setSaveStatus('local');
      return false;
    }
  };

  const handlePopoverDelete = async () => {
    if (!popoverGuest) return;
    await deleteGuest(popoverGuest);
  };

  // Add guest manually
  const addGuest = () => {
    const name = prompt('Nombre de la persona a añadir:');
    if (!name) return;
    
    setGuests(prev => [
      ...prev,
      {
        id: 'g_manual_' + Date.now(),
        name: name.trim(),
        ap: '',
        table: '__none__',
        menu: '?',
        conf: false,
        child: false,
        al: '',
        ac: ''
      }
    ]);
  };

  const addTable = () => {
    const nextId = Math.max(0, ...tables.map(t => t.id)) + 1;
    const name = prompt('Nombre de la nueva mesa:', `Mesa ${nextId}`);
    if (name === null) return;

    setTables(prev => [
      ...prev,
      {
        id: nextId,
        name: name?.trim() || `Mesa ${nextId}`,
      }
    ]);
  };

  const removeTable = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    const guestsInTable = guests.filter(g => g.table === tableId).length;
    const tableName = table?.name ? `Mesa ${tableId} "${table.name}"` : `Mesa ${tableId}`;

    if (!window.confirm(`¿Quitar ${tableName}? ${guestsInTable} persona(s) volverán a "Sin asignar".`)) {
      return;
    }

    setGuests(prev => prev.map(g => g.table === tableId ? { ...g, table: '__none__' } : g));
    setTables(prev => prev.filter(t => t.id !== tableId));
    setAddPersonTableId(prev => prev === tableId ? null : prev);
  };

  const openAddPerson = (e: React.MouseEvent<HTMLButtonElement>, tableId: number) => {
    e.stopPropagation();
    setAddPersonTableId(tableId);
    closePopover();
  };

  const addUnassignedGuestToTable = (guestId: string, tableId: number) => {
    moveGuest(guestId, tableId, null);
    setAddPersonTableId(null);
  };

  const savePlanSnapshot = async (
    planData: SeatingPlanData,
    options: { silent?: boolean } = {}
  ) => {
    const saveSeq = ++saveSeqRef.current;
    setSaving(true);
    setSaveStatus('saving');

    try {
      writeLocalPlan(planData);
      
      const { error } = await supabase
        .from('seating_plan')
        .upsert({ id: 'main', plan_data: planData }, { onConflict: 'id' });

      if (error) throw error;

      if (saveSeq === saveSeqRef.current) {
        setLastSavedAt(planData.updatedAt);
        setSaveStatus('saved');
      }

      if (!options.silent) {
        alert("Diseño guardado correctamente en Supabase.");
      }
    } catch (err) {
      console.error("Error saving layout:", err);

      if (saveSeq === saveSeqRef.current) {
        setLastSavedAt(planData.updatedAt);
        setSaveStatus('local');
      }

      if (!options.silent) {
        alert("Guardado en este dispositivo. No se pudo sincronizar con Supabase.");
      }
    } finally {
      if (saveSeq === saveSeqRef.current) {
        setSaving(false);
      }
    }
  };

  // Save layout to Supabase, with an immediate local backup.
  const saveLayout = async () => {
    await savePlanSnapshot(makePlanData(tables, guests, deletedSeatKeys, hiddenGuestKeys));
  };

  // Reset layout
  const resetLayout = () => {
    if (window.confirm('¿Reiniciar al diseño original? Se perderán los cambios manuales de las mesas.')) {
      const confirmedList = dbGuests.filter(g => g.attending === true);
      const initial = buildInitial(confirmedList);
      setTables(TABLES);
      setGuests(initial);
      setDeletedSeatKeys(new Set());
      setHiddenGuestKeys(new Set());
      setSelectedGuestId(null);
      closePopover();
    }
  };

  // Print layout
  const printLayout = () => {
    window.print();
  };

  // Render Stats computations
  const getStats = () => {
    const seated = guests.filter(g => g.table !== '__none__');
    const counts = { Carne: 0, Pescado: 0, Especial: 0, Infantil: 0, '?': 0 };
    seated.forEach(g => {
      counts[g.menu] = (counts[g.menu] || 0) + 1;
    });
    const unconfirmed = seated.filter(g => !g.conf).length;
    const unassigned = guests.filter(g => g.table === '__none__').length;

    return {
      seated: seated.length,
      unassigned,
      unconfirmed,
      ...counts
    };
  };

  const stats = getStats();

  const getDups = () => {
    const dups: Record<string, number> = {};
    guests.forEach(g => {
      const k = norm(g.name).split(' ')[0];
      dups[k] = (dups[k] || 0) + 1;
    });
    return dups;
  };
  const dupNames = getDups();

  const renderLabel = (g: SeatingGuest) => {
    const isDup = dupNames[norm(g.name).split(' ')[0]] > 1 && g.ap;
    return (
      <>
        <span className={styles.nm}>{g.name}</span>
        {isDup && <span className={styles.ap}>{g.ap}</span>}
      </>
    );
  };

  const getMenuClass = (m: string) => {
    if (m === 'Carne') return styles.mCarne;
    if (m === 'Pescado') return styles.mPescado;
    if (m === 'Especial') return styles.mEspecial;
    if (m === 'Infantil') return styles.mInfantil;
    return styles.mUnassigned;
  };

  const saveStatusText = () => {
    if (saveStatus === 'saving') return 'Guardando...';
    if (saveStatus === 'dirty') return 'Cambios pendientes';
    if (saveStatus === 'local') return 'Guardado local';
    if (saveStatus === 'error') return 'Error de guardado';
    if (saveStatus === 'saved') return lastSavedAt ? `Sincronizado ${new Date(lastSavedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}` : 'Sincronizado';
    return 'Listo';
  };

  const selectedGuest = selectedGuestId ? guests.find(g => g.id === selectedGuestId) : null;
  const saveStatusClass: Record<SaveStatus, string> = {
    idle: styles.save_idle,
    dirty: styles.save_dirty,
    saving: styles.save_saving,
    saved: styles.save_saved,
    local: styles.save_local,
    error: styles.save_error,
  };

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f6f1e7" }}>
        <RefreshCw className="animate-spin" size={32} color="#b8893b" />
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer} onClick={closePopover}>
      
      {/* Header panel */}
      <div className={styles.headerPanel}>
        <div>
          <h1>Nadia <span>&</span> Adrián · <span>Organizador de Mesas</span></h1>
          <div className={styles.date}>Hacienda Mityana · 25/07/2026</div>
        </div>
        <div className={styles.tools}>
          <span className={`${styles.saveBadge} ${saveStatusClass[saveStatus]}`}>
            {saveStatusText()}
          </span>
          <input 
            type="search" 
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoComplete="off"
          />
          <button className={styles.btn} onClick={addGuest}>+ Persona</button>
          <button className={styles.btn} onClick={addTable}>+ Mesa</button>
          <button className={`${styles.btn} ${styles.btnSave}`} onClick={saveLayout} disabled={saving}>
            <Save size={16} /> {saving ? "Guardando..." : "Guardar Diseño"}
          </button>
          <button className={styles.btn} onClick={printLayout}>
            <Printer size={16} /> Imprimir
          </button>
          <button className={styles.btn} onClick={resetLayout}>Reiniciar</button>
        </div>
      </div>

      {selectedGuest && (
        <div className={styles.touchMoveBanner}>
          <b>Moviendo a {selectedGuest.name}</b>
          <span>Toca una mesa o una silla para colocarla ahí.</span>
          <button type="button" onClick={() => setSelectedGuestId(null)}>Cancelar</button>
        </div>
      )}

      {/* Stats list */}
      <div className={styles.stats}>
        <div className={styles.stat}><b>{stats.seated}</b> sentados</div>
        <div className={`${styles.stat} ${styles.statMeat}`}><b>{stats.Carne}</b> {MENU_ICON.Carne} carne</div>
        <div className={`${styles.stat} ${styles.statFish}`}><b>{stats.Pescado}</b> {MENU_ICON.Pescado} pescado</div>
        {stats.Especial > 0 && <div className={`${styles.stat} ${styles.statVeg}`}><b>{stats.Especial}</b> {MENU_ICON.Especial} especial</div>}
        <div className={`${styles.stat} ${styles.statKid}`}><b>{stats.Infantil}</b> {MENU_ICON.Infantil} infantil</div>
        {stats['?'] > 0 && <div className={styles.stat}><b>{stats['?']}</b> {MENU_ICON['?']} sin menú</div>}
        {stats.unconfirmed > 0 && <div className={`${styles.stat} ${styles.statOrange}`}><b>{stats.unconfirmed}</b> sin confirmar</div>}
        {stats.unassigned > 0 && <div className={styles.stat}><b>{stats.unassigned}</b> sin asignar</div>}
      </div>

      {/* Seating Layout Canvas */}
      <div className={styles.layout}>
        {/* Unassigned Guest Sidebar */}
        <aside className={styles.tray}>
          <h3>Sin asignar</h3>
          <p className={styles.traySubtitle}>Arrastra a una silla, o toca y selecciona mesa.</p>
          
          <div 
            className={`${styles.unassignedZone} ${overTableId === '__none__' ? styles.over : ''} ${guests.filter(g => g.table === '__none__').length === 0 ? styles.empty : ''}`}
            onDragOver={(e) => handleTableDragOver(e, '__none__')}
            onDragLeave={() => setOverTableId(null)}
            onDrop={(e) => handleTableDrop(e, '__none__')}
            onClick={(e) => handleTouchTableClick(e, '__none__')}
            data-table="__none__"
          >
            {guests
              .filter(g => g.table === '__none__')
              .map(g => {
                const dim = searchTerm && !g.name.toLowerCase().includes(searchTerm.toLowerCase());
                return (
                  <div
                    key={g.id}
                    className={`${styles.chip} ${getMenuClass(g.menu)} ${g.conf ? '' : styles.noconf} ${draggedId === g.id ? styles.dragging : ''} ${selectedGuestId === g.id ? styles.sel : ''} ${dim ? styles.dim : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, g.id)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => handleGuestClick(e, g)}
                    onDoubleClick={(e) => { e.stopPropagation(); void deleteGuest(g); }}
                    title={g.name}
                  >
                    <span>{MENU_ICON[g.menu]}</span>
                    {renderLabel(g)}
                    {g.al && ' ⚠️'}
                  </div>
                );
              })}
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#f5ddd6', borderColor: '#e3c4bc' }}></span> Carne
              <span className={styles.legendDot} style={{ background: '#d9e7f4', borderColor: '#b9cfd4' }}></span> Pescado
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#dcecd6', borderColor: '#c5dbbf' }}></span> Especial
              <span className={styles.legendDot} style={{ background: '#ece0f7', borderColor: '#d4c2ed' }}></span> Infantil
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ borderStyle: 'dashed', borderColor: '#e08a2b', background: '#fdeccf' }}></span> Sin confirmar
              <span className={styles.legendDot} style={{ background: '#eeebe6', borderColor: '#dcd9d4' }}></span> Menú sin saber
            </div>
          </div>
        </aside>

        {/* Tables Floor Plan */}
        <div className={styles.board}>
          <div className={styles.room}>
            <div className={styles.grid}>
              
              {/* Render all tables using custom grid coordinate mapping */}
              {tables.slice().sort((a,b) => a.id - b.id).map(t => {
                const arr = guests.filter(g => g.table === t.id);
                const moveTargets = arr.filter(g => g.id !== selectedGuestId);
                const n = arr.length;
                const isOver = overTableId === t.id;
                const pos = GRID_POSITIONS[t.id];
                const cellStyle = pos ? { gridRow: pos.row, gridColumn: pos.col } : {};
                const isSpanned = t.id === 1 || t.id === 16;

                if (t.head) {
                  return (
                    <div 
                      key={t.id} 
                      className={`${styles.cell} ${styles.headcell}`} 
                      style={cellStyle}
                    >
                      <div className={styles.tcap}>
                        {t.name || `Mesa ${t.id}`}
                        <span className={styles.cnt}>{arr.length} pers · 🥩{arr.filter(x => x.menu === 'Carne').length} 🐟{arr.filter(x => x.menu === 'Pescado').length}</span>
                        <span className={styles.tableActions}>
                          <button type="button" onClick={(e) => openAddPerson(e, t.id)}>+ persona</button>
                          <button type="button" className={styles.tableDanger} onClick={(e) => { e.stopPropagation(); removeTable(t.id); }}>quitar</button>
                        </span>
                      </div>
                      <div 
                        className={`${styles.head} ${isOver ? styles.over : ''}`}
                        onDragOver={(e) => handleTableDragOver(e, t.id)}
                        onDragLeave={() => setOverTableId(null)}
                        onDrop={(e) => handleTableDrop(e, t.id)}
                        onClick={(e) => handleTouchTableClick(e, t.id)}
                        data-table={t.id}
                      >
                        <div className={styles.toprow}>
                          {arr.map((g) => {
                            const dim = searchTerm && !g.name.toLowerCase().includes(searchTerm.toLowerCase());
                            return (
                              <Fragment key={g.id}>
                                {selectedGuestId && selectedGuestId !== g.id && (
                                  <button
                                    type="button"
                                    className={styles.inlineInsertSlot}
                                    onClick={(e) => handleInsertClick(e, t.id, g.id)}
                                    title={`Colocar antes de ${g.name}`}
                                  >
                                    +
                                  </button>
                                )}
                                <div
                                  className={`${styles.seat} ${getMenuClass(g.menu)} ${g.conf ? '' : styles.noconf} ${draggedId === g.id ? styles.dragging : ''} ${selectedGuestId === g.id ? styles.sel : ''} ${overSeatId === g.id ? styles.insbar : ''} ${dim ? styles.dim : ''}`}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, g.id)}
                                  onDragEnd={handleDragEnd}
                                  onDragOver={(e) => handleSeatDragOver(e, g.id)}
                                  onDragLeave={() => setOverSeatId(null)}
                                  onDrop={(e) => handleSeatDrop(e, g)}
                                  onClick={(e) => handleGuestClick(e, g)}
                                  onDoubleClick={(e) => { e.stopPropagation(); void deleteGuest(g); }}
                                  title={`${g.name} · ${g.menu}`}
                                >
                                  {renderLabel(g)}
                                  <span className={styles.tag}>{MENU_ICON[g.menu]}{g.al && ' ⚠️'}</span>
                                </div>
                              </Fragment>
                            );
                          })}
                          {selectedGuestId && (
                            <button
                              type="button"
                              className={styles.inlineInsertSlot}
                              onClick={(e) => handleInsertClick(e, t.id, null)}
                              title="Colocar al final de esta mesa"
                            >
                              +
                            </button>
                          )}
                        </div>
                        <div className={styles.rect}>
                          <span className={styles.tnum}>{t.id}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={t.id} 
                    className={`${styles.cell} ${isSpanned ? styles.spannedCell : ''}`} 
                    style={cellStyle}
                  >
                    <div className={styles.tcap}>
                      Mesa {t.id} {t.name && <small>“{t.name}”</small>}
                      <span className={styles.cnt}>
                        <span className={n > 10 ? styles.warn : ''}>
                          {n} pers · 🥩{arr.filter(x => x.menu === 'Carne').length} 🐟{arr.filter(x => x.menu === 'Pescado').length}
                        </span>
                      </span>
                      <span className={styles.tableActions}>
                        <button type="button" onClick={(e) => openAddPerson(e, t.id)}>+ persona</button>
                        <button type="button" className={styles.tableDanger} onClick={(e) => { e.stopPropagation(); removeTable(t.id); }}>quitar</button>
                      </span>
                    </div>

                    <div 
                      className={`${styles.round} ${isOver ? styles.over : ''}`}
                      onDragOver={(e) => handleTableDragOver(e, t.id)}
                      onDragLeave={() => setOverTableId(null)}
                      onDrop={(e) => handleTableDrop(e, t.id)}
                      onClick={(e) => handleTouchTableClick(e, t.id)}
                      data-table={t.id}
                    >
                      <div className={styles.cloth}>
                        <div className={styles.tnum}>{t.id}</div>
                        {t.name && <div className={styles.tnick}>{t.name}</div>}
                      </div>

                      {arr.map((g, idx) => {
                        const ang = (-90 + (idx * 360) / Math.max(n, 1)) * Math.PI / 180;
                        const left = `${50 + 42 * Math.cos(ang)}%`;
                        const top = `${50 + 42 * Math.sin(ang)}%`;
                        const dim = searchTerm && !g.name.toLowerCase().includes(searchTerm.toLowerCase());

                        return (
                          <div
                            key={g.id}
                            className={`${styles.seat} ${getMenuClass(g.menu)} ${g.conf ? '' : styles.noconf} ${draggedId === g.id ? styles.dragging : ''} ${selectedGuestId === g.id ? styles.sel : ''} ${overSeatId === g.id ? styles.insbar : ''} ${dim ? styles.dim : ''}`}
                            style={{ left, top }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, g.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleSeatDragOver(e, g.id)}
                            onDragLeave={() => setOverSeatId(null)}
                            onDrop={(e) => handleSeatDrop(e, g)}
                            onClick={(e) => handleGuestClick(e, g)}
                            onDoubleClick={(e) => { e.stopPropagation(); void deleteGuest(g); }}
                            title={`${g.name} · ${g.menu}`}
                          >
                            {renderLabel(g)}
                            <span className={styles.tag}>{MENU_ICON[g.menu]}{g.al && ' ⚠️'}</span>
                          </div>
                        );
                      })}

                      {selectedGuestId && (
                        <>
                          {moveTargets.map((target, idx) => {
                            const slotCount = Math.max(moveTargets.length + 1, 1);
                            const ang = (-90 + ((idx + 0.5) * 360) / slotCount) * Math.PI / 180;
                            const left = `${50 + 48 * Math.cos(ang)}%`;
                            const top = `${50 + 48 * Math.sin(ang)}%`;

                            return (
                              <button
                                type="button"
                                key={`insert-before-${target.id}`}
                                className={styles.radialInsertSlot}
                                style={{ left, top }}
                                onClick={(e) => handleInsertClick(e, t.id, target.id)}
                                title={`Colocar antes de ${target.name}`}
                              >
                                +
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            className={styles.radialInsertSlot}
                            style={{ left: '50%', top: '8%' }}
                            onClick={(e) => handleInsertClick(e, t.id, null)}
                            title="Colocar al final de esta mesa"
                          >
                            +
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
            <div className={styles.doorHint}>— — — ENTRADA — — —</div>
          </div>
        </div>
      </div>

      <div className={styles.hint}>
        💡 <b>Arrastra</b> a cada persona a su silla; suéltala sobre otra silla para intercalarla en ese orden. <b>Toca una persona</b> para cambiar menú, confirmar, marcar infantil o activar “Mover con toque”. <b>Doble clic</b> elimina. Naranja = sin confirmar. Se guarda en Supabase con copia local de seguridad.
      </div>

      <AnimatePresence>
        {addPersonTableId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
            onClick={() => setAddPersonTableId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className={styles.personPicker}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.personPickerHeader}>
                <div>
                  <h3>Añadir a mesa {addPersonTableId}</h3>
                  <p>Personas confirmadas o manuales que aún no están ubicadas.</p>
                </div>
                <button type="button" onClick={() => setAddPersonTableId(null)}>×</button>
              </div>

              <div className={styles.personPickerList}>
                {guests.filter(g => g.table === '__none__').length === 0 ? (
                  <div className={styles.emptyPicker}>No hay personas sin ubicar.</div>
                ) : (
                  guests
                    .filter(g => g.table === '__none__')
                    .map(g => (
                      <button
                        type="button"
                        key={g.id}
                        className={`${styles.personPickItem} ${getMenuClass(g.menu)} ${g.conf ? '' : styles.noconf}`}
                        onClick={() => addUnassignedGuestToTable(g.id, addPersonTableId)}
                      >
                        <span>{MENU_ICON[g.menu]}</span>
                        <strong>{g.name} {g.ap}</strong>
                        {g.al && <em>Restricción</em>}
                      </button>
                    ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editing popover dialog */}
      <AnimatePresence>
        {popoverGuest && popoverAnchor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles.popover}
            style={{
              top: `${popoverAnchor.bottom + window.scrollY + 6}px`,
              left: `${Math.max(6, Math.min(window.innerWidth - 248, popoverAnchor.left + window.scrollX))}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.close} onClick={closePopover}>×</span>
            <h4>{popoverGuest.name} {popoverGuest.ap}</h4>
            
            {popoverGuest.al && <div className={styles.al}>⚠️ {popoverGuest.al}</div>}
            {popoverGuest.ac && <div className={styles.ac}>+ {popoverGuest.ac}</div>}

            <div className={styles.row}>
              <div className={styles.lbl}>Menú</div>
              <div className={styles.opts}>
                {(['Carne', 'Pescado', 'Especial', 'Infantil', '?'] as const).map(m => (
                  <div 
                    key={m} 
                    className={`${styles.opt} ${popoverGuest.menu === m ? styles.on : ''}`}
                    onClick={() => handlePopoverMenuChoice(m)}
                  >
                    {MENU_ICON[m]} {m === '?' ? 'Sin saber' : m}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.lbl}>Estado</div>
              <div className={styles.opts}>
                <div 
                  className={`${styles.opt} ${popoverGuest.conf ? styles.on : ''}`}
                  onClick={() => handlePopoverConfChange(true)}
                >
                  ✔ Confirmado
                </div>
                <div 
                  className={`${styles.opt} ${!popoverGuest.conf ? styles.on : ''}`}
                  onClick={() => handlePopoverConfChange(false)}
                >
                  ⏳ Sin confirmar
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.lbl}>Tipo</div>
              <div className={styles.opts}>
                <div 
                  className={`${styles.opt} ${popoverGuest.child ? styles.on : ''}`}
                  onClick={handlePopoverChildChange}
                >
                  🧒 Niño (menú infantil)
                </div>
              </div>
            </div>

            <button
              type="button"
              className={styles.moveTouch}
              onClick={() => {
                setSelectedGuestId(popoverGuest.id);
                closePopover();
              }}
            >
              Mover con toque
            </button>

            <div className={styles.del} onClick={handlePopoverDelete}>
              🗑 Eliminar persona
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
