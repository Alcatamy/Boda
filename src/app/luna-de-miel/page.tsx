"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  Compass,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Info,
  Phone,
  ExternalLink,
  Plane,
  Train,
  Ship,
  Utensils,
  Check,
  RotateCcw,
  Sparkles,
  Smartphone,
  Map,
  Plus,
  Trash2,
  Euro,
  DollarSign,
  Briefcase
} from "lucide-react";
import styles from "@/styles/Honeymoon.module.css";

// Interface definitions
interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  region: "Vietnam" | "Bali" | "Gili";
  title: string;
  morning?: (string | React.ReactNode)[];
  lunch?: string;
  afternoon?: (string | React.ReactNode)[];
  dinner?: string;
  hotel?: {
    name: string;
    details?: string;
    bookingRef?: string;
    pinCode?: string;
    payment?: string;
  };
  tips?: string[];
  mapsUrl?: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  done: boolean;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: "VND" | "IDR" | "EUR";
  amountInEur: number;
  date: string;
}

interface Destination {
  id: string;
  name: string;
  region: string;
  desc: string;
  highlights: string[];
  tip: string;
  imageUrl: string;
}

// Honeymoon Itinerary Data (Aug 3 & 4 updated with Roxanne and transport options)
const itineraryData: ItineraryDay[] = [
  {
    day: 1,
    date: "28 de Julio",
    location: "Hanói",
    region: "Vietnam",
    title: "Llegada y Primer Contacto",
    morning: [
      "Llegada en avión a las 6:40 AM.",
      "Coger un taxi Grab al hotel (45 min de coche).",
      "Desayuno o primer café en The Note Coffee o La Place para empezar con energía."
    ],
    lunch: "Almuerzo cerca del hotel (Old Quarter).",
    afternoon: [
      "Hacer Check-in en Hanoi Dalvostro Valentino Hotel & Spa (desde las 14:00h).",
      "Paseo por el Lago Hoan Kiem: ver el puente rojo, Templo Ngoc Son y la Torre de la Tortuga.",
      "Cambiar euros a dongs en las joyerías de la zona centro (calle famosa: HA TRUNG).",
      "Asegurar entradas: comprar en taquilla del teatro Thang Long las entradas para el show de hoy (18:30h).",
      "Preguntar a qué hora pasa el tren grande por la calle del tren (Train Street) y tomar algo."
    ],
    dinner: "Espectáculo de marionetas de agua (18:30h). Cena recomendada en ZO 26 o Duong's Restaurant. Copas por la Catedral de San José.",
    hotel: {
      name: "Hanoi Dalvostro Valentino Hotel & Spa",
      details: "Check-in 14:00h. Tarjeta asociada al pago en Booking.",
      bookingRef: "Pago ya gestionado en Booking"
    },
    tips: [
      "Cambiar euros a dongs en las joyerías de la calle HA TRUNG (Old Quarter) para mejor cambio.",
      "Preguntar en la Train Street a qué hora pasa el tren grande hoy."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hanoi+Dalvostro+Valentino+Hotel+Spa"
  },
  {
    day: 2,
    date: "29 de Julio",
    location: "Hanói -> Sapa",
    region: "Vietnam",
    title: "Explorando la Capital e Historia",
    morning: [
      "Desayuno incluido en el hotel.",
      "Coger Grab a la Pagoda Tran Quoc + Templo Quanh Tanh.",
      "Visitar el Mausoleo de Ho Chi Minh + Pagoda del Pilar Único.",
      "Ir al Templo de la Literatura (abierto de 7:30 a 18:00).",
      "Visitar la Catedral de San José (cerca del hotel)."
    ],
    lunch: "Recomendado: Banh Mi 25 (el bocadillo vietnamita más famoso).",
    afternoon: [
      "Pasear y perderse por los puestos callejeros del Old Quarter y el Mercado de Dong Xuan y hacer compras.",
      "Último paseo de tarde-noche por el Lago Hoan Kiem iluminado de noche."
    ],
    dinner: "Cena: Opciones recomendadas (Pizza 4 P's anulada. Sugerencias: El Gaucho Argentinian Steakhouse, Green Tangerine, The Moose & Roo Smokehouse, Le Beaulieu o Anita's Cantina).",
    hotel: {
      name: "Tren Nocturno a Sapa",
      details: "Salida a las 22:40h - Llegada 6:25h. Coche compartimentado de primera clase.",
      bookingRef: "12GO25042303"
    },
    tips: [
      "Llega a la estación de tren de Hanói al menos 40 minutos antes de la salida."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pizza+4+Ps+Hanoi"
  },
  {
    day: 3,
    date: "30 de Julio",
    location: "Sapa",
    region: "Vietnam",
    title: "Ascenso al Techo de Indochina",
    morning: [
      "Llegada a Lao Cai a las 6:25 AM. Recogida en coche compartido (conductor con cartel a nombre de 'Nadia', $5 por persona).",
      "Traslado Lao Cai -> Sapa (1h). Desayuno en Le Gecko Cafe y dejar maletas en el Eden Boutique Hotel.",
      "Subida al Fansipan (3.143m) por la mañana (comprar ticket combinado en Sapa Sun Plaza):",
      "Punto 1: Coger tren cremallera hasta la estación de Muong Hoa.",
      "Punto 2: Andar a la estación de Hoang Lien y coger el teleférico hasta la cima.",
      "Punto 3: Subir los 600 escalones a pie (aire fino a más de 3000m) o coger el pequeño funicular superior opcional hasta la cima."
    ],
    lunch: "Good Morning Vietnam / Little Sapa / The Hill Station Deli.",
    afternoon: [
      "Tarde de cataratas: Silver Waterfall (20.000 VND / 0.8€) y Love Waterfall (70.000 VND / 2.9€).",
      "Alternativa: Masaje y relax tradicional en Eden Massage & Spa, Sapa Summit o Halosa Massage."
    ],
    dinner: "Cena en Moment Romantic Restaurant o Le Bordeaux.",
    hotel: {
      name: "Eden Boutique Hotel & Spa",
      details: "El alojamiento gestiona el pago de la estancia.",
      payment: "Pago directo en el alojamiento"
    },
    tips: [
      "Pregunta en recepción si la cima del Fansipan está despejada antes de subir.",
      "En Sapa NO hay Grab, hay que moverse en taxis locales (¡lleva dinero en efectivo!)."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Eden+Boutique+Hotel+Sapa"
  },
  {
    day: 4,
    date: "31 de Julio",
    location: "Sapa -> Hanói",
    region: "Vietnam",
    title: "Trekking entre Arrozales",
    morning: [
      "Desayuno en el hotel y hacer checkout. Dejar maletas en recepción.",
      "Trekking por los arrozales de Sapa contratado con HMONG SAPA HIKING TOURS. Comida de trekking incluida."
    ],
    lunch: "Comida incluida en el trekking local.",
    afternoon: [
      "Fin del trekking, regreso al hotel. Pedir en recepción poder ducharse antes del viaje.",
      "Paseo por Sapa Lake o Viettrekking Café para tomar algo con vistas al valle."
    ],
    dinner: "Cena cerca de la estación: HI NI RESTAURANT (muy recomendado).",
    hotel: {
      name: "Tren Nocturno de Regreso a Hanói",
      details: "Salida a las 21:30h - Llegada 5:30h. Tren gestionado con Hai Ni Restaurant.",
      bookingRef: "BW4405710"
    },
    tips: [
      "El trekking se paga en efectivo (~13€ p.p.). Lleva billetes pequeños para dar propina.",
      "Cierra el traslado de vuelta Sapa -> Estación de Lao Cai previamente con el hotel."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sapa+Lake+Vietnam"
  },
  {
    day: 5,
    date: "1 de Agosto",
    location: "Ninh Binh",
    region: "Vietnam",
    title: "Naturaleza y Moto en Tam Coc",
    morning: [
      "Llegada en tren nocturno a Hanói a las 5:30 AM. Reservar en 12go.asia y coger autobús a Ninh Binh.",
      "Llegada a Tam Coc: ir andando hasta el hotel (paseo de 14 min) o coger Grab.",
      "Desayunar en Le Brick Coffee Shop o Gao Restaurant & Bar Coffee.",
      "Dejar maletas en Tam Coc Serenity Hotel & Bungalow.",
      "Alquilar motos para 2 días: [Alquiler de Motos en Google Maps](https://maps.app.goo.gl/V9sAFL5Bdzwg28t89?g_st=iw).",
      "Recorrer arrozales en dirección a la Bich Dong Pagoda y después visitar la Buffalo Cave."
    ],
    lunch: "Gao Restaurant & Bar Coffee / Tam Coc Kitchen / Family Restaurant.",
    afternoon: [
      "Por la tarde, visitar únicamente Mua Cave: pasear por los jardines del lago de lotos, subir los 500 escalones y ver el atardecer sobre el río Ngo Dong."
    ],
    dinner: "Cena en Chookie's Beer Garden.",
    hotel: {
      name: "Tam Coc Serenity Hotel & Bungalow",
      details: "Desayuno incluido. Lavandería disponible. Tarjeta en Booking.",
      bookingRef: "Pago directo / Tarjeta asociada en Booking"
    },
    tips: [
      "Al alquilar motos, deja el DNI antiguo como fianza, NUNCA el pasaporte.",
      "Evita estafas en Mua Cave: ignora a los locales que gritan para que aparques fuera. Ve directo hasta la entrada oficial."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tam+Coc+Serenity+Hotel+Bungalow"
  },
  {
    day: 6,
    date: "2 de Agosto",
    location: "Ninh Binh",
    region: "Vietnam",
    title: "Paseo Fluvial por Trang An",
    morning: [
      "Desayuno en el hotel.",
      "Paseo en barca por Trang An (Ruta 3). Ir en moto hasta el embarcadero oficial: [Embarcadero de Trang An en Google Maps](https://www.google.com/maps/place/Trang+An+Departure+Boat+Ticket/@20.2531292,105.918861,17z/data=!3m1!4b1!4m6!3m5!1s0x31367bd3eb4b4685:0x617ada48f3f271e!8m2!3d20.2531292!4d105.918861!16s%2Fg%2F11c6fdbyth?cid=439010410981435166&entry=tts)."
    ],
    lunch: "Comida en Thao Beo Restaurant.",
    afternoon: [
      "Tarde de relax y masaje tradicional en Tam Coc Lotus Spa o Tâm Spa.",
      "Visitar Hoa Lu Old Town iluminado de noche (coger Grab o devolver la moto antes)."
    ],
    dinner: "Cena en Bamboo Bar & Restaurant / Tung De / Hoang Viet.",
    hotel: {
      name: "Tam Coc Serenity Hotel & Bungalow",
      details: "Segunda noche en Ninh Binh."
    },
    tips: [
      "Devuelve las motos esta noche por si la recogida del día siguiente para el crucero es muy temprano.",
      "Hablar con recepción para que nos dejen el desayuno listo para llevar (takeaway) mañana temprano."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Trang+An+Departure+Boat+Ticket"
  },
  {
    day: 7,
    date: "3 de Agosto",
    location: "Ha Long Bay",
    region: "Vietnam",
    title: "Crucero de Lujo por la Bahía",
    morning: [
      "Traslado de Ninh Binh (Tam Coc) a Ha Long Bay. Recogida sobre las 7:00-7:30 AM (llegar antes de las 11:30 AM).",
      <div key="options-aug3" className="mt-3 p-3 rounded-lg border border-[rgba(197,160,89,0.2)] bg-[rgba(10,25,20,0.5)] text-sm">
        <div className="font-semibold text-[#D4AF37] mb-2 flex items-center gap-1.5 text-xs tracking-wider uppercase">
          🚗 Opciones de Traslado Ninh Binh ➔ Ha Long (3 de Agosto)
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="p-2.5 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <span className="font-semibold text-white text-xs">1a. Le Journey (Compartido - Roxanne)</span>
              <span className="text-[#D4AF37] font-semibold text-xs">550.000 VND (~20€) p.p. / 40€ total</span>
            </div>
            <p className="text-slate-300 text-xs m-0 leading-relaxed">
              <strong>Horario:</strong> Recogida ~7:00-7:20 AM. Van Limusina compartida de Le Journey Cruise.
            </p>
            <p className="text-slate-400 text-[11px] m-0 mt-0.5">
              <strong>Contacto:</strong> Roxanne (+84 38 958 6465).
            </p>
          </div>
          <div className="p-2.5 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <span className="font-semibold text-white text-xs">1b. Le Journey (Privado - Roxanne)</span>
              <span className="text-[#D4AF37] font-semibold text-xs">desde 2.800.000 VND (~103€) total</span>
            </div>
            <p className="text-slate-300 text-xs m-0 leading-relaxed">
              <strong>Horario:</strong> Recogida 7:30 AM en Tam Coc Serenity. Coche privado 4-7 plazas.
            </p>
            <p className="text-slate-400 text-[11px] m-0 mt-0.5">
              <strong>Contacto:</strong> Roxanne (+84 38 958 6465).
            </p>
          </div>
          <div className="p-2.5 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <span className="font-semibold text-white text-xs">2. Cat Ba Express (Compartido - Limusina Bus) 🌟 MÁS ECONÓMICA</span>
              <span className="text-[#D4AF37] font-semibold text-xs">15€ (408.000 VND) p.p. / 30€ total</span>
            </div>
            <p className="text-slate-300 text-xs m-0 leading-relaxed">
              <strong>Horario:</strong> Recogida 7:00 AM en Estación de Botes de Tam Coc. Llegada al muelle a las 11:30 AM.
            </p>
            <p className="text-slate-400 text-[11px] m-0 mt-0.5">
              <strong>Logística:</strong> Deja en Cherry Coffee (Tuan Chau). WhatsApp +84 84 824 4999.
            </p>
          </div>
          <div className="p-2.5 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <span className="font-semibold text-white text-xs">3. Tommy's Travel (Privado - SUV Innova) 🌟 PRIVADO ECONÓMICO</span>
              <span className="text-[#D4AF37] font-semibold text-xs">~81€ (2.203.200 VND) total</span>
            </div>
            <p className="text-slate-300 text-xs m-0 leading-relaxed">
              <strong>Horario:</strong> Recogida 7:30 AM en el hotel. Llegada directa al muelle a las 11:00 AM.
            </p>
            <p className="text-slate-400 text-[11px] m-0 mt-0.5">
              <strong>Logística:</strong> Puerta a puerta. Conductor privado de Tommy Pham. WhatsApp +84 916 998 777.
            </p>
          </div>
        </div>
      </div>,
      "Llegada al puerto de Tuan Chau a las 11:00h - 11:30h. Embarque en Le Journey Luxury Cruise."
    ],
    lunch: "Almuerzo de bienvenida a bordo del crucero.",
    afternoon: [
      "Navegación por la bahía, actividades guiadas (kayak, visitas a cuevas).",
      "Sunset party en la cubierta del barco."
    ],
    dinner: "Cena gourmet de marisco a bordo.",
    hotel: {
      name: "Le Journey Luxury Cruise (Camarote de Lujo)",
      details: "Pensión completa incluida. Pago directo en el alojamiento.",
      bookingRef: "6293559034",
      pinCode: "1888"
    },
    tips: [
      "Asegúrate de rellenar el formulario único de Bali hoy (es en los 3 días previos al vuelo).",
      "El pago del crucero se realiza en el barco (recargo del 4% en tarjeta)."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tuan+Chau+Port+Ha+Long"
  },
  {
    day: 8,
    date: "4 de Agosto",
    location: "Ha Long Bay -> Hanói",
    region: "Vietnam",
    title: "Retorno a Hanói e Hito de Vuelo",
    morning: [
      "Clase de Tai Chi al amanecer en cubierta y desayuno a bordo.",
      "Navegación de retorno al puerto de Tuan Chau y checkout (11:00 AM)."
    ],
    lunch: "Comida en Hanói centro tras el traslado de vuelta.",
    afternoon: [
      "Traslado de vuelta del Crucero (Tuan Chau) a Hanói centro (Old Quarter).",
      <div key="options-aug4" className="mt-3 p-3 rounded-lg border border-[rgba(197,160,89,0.2)] bg-[rgba(10,25,20,0.5)] text-sm">
        <div className="font-semibold text-[#D4AF37] mb-2 flex items-center gap-1.5 text-xs tracking-wider uppercase">
          🚗 Opciones de Traslado Ha Long ➔ Hanói Centro (4 de Agosto)
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="p-2.5 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <span className="font-semibold text-white text-xs">1a. Le Journey Limousine Estándar (Compartido - Roxanne)</span>
              <span className="text-[#D4AF37] font-semibold text-xs">250.000 VND (~9,20€) p.p. / 18,40€ total</span>
            </div>
            <p className="text-slate-300 text-xs m-0 leading-relaxed">
              <strong>Horario:</strong> Salida 11:15 AM del puerto. Deja en el hotel de Hanói a las 3:00 - 3:30 PM.
            </p>
            <p className="text-slate-400 text-[11px] m-0 mt-0.5">
              <strong>Logística:</strong> Minibús compartido estándar del crucero. Roxanne (+84 38 958 6465).
            </p>
          </div>
          <div className="p-2.5 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <span className="font-semibold text-white text-xs">1b. Le Journey Limousine VIP (Compartido - Roxanne)</span>
              <span className="text-[#D4AF37] font-semibold text-xs">350.000 VND (~13€) p.p. / 26€ total</span>
            </div>
            <p className="text-slate-300 text-xs m-0 leading-relaxed">
              <strong>Horario:</strong> Salida 11:15 AM del puerto. Van VIP D-Car Limusina del crucero.
            </p>
            <p className="text-slate-400 text-[11px] m-0 mt-0.5">
              <strong>Logística:</strong> Confort mejorado. Roxanne (+84 38 958 6465).
            </p>
          </div>
          <div className="p-2.5 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <span className="font-semibold text-white text-xs">2. Le Journey Coche Privado (Privado - Roxanne)</span>
              <span className="text-[#D4AF37] font-semibold text-xs">1.800.000 VND (~66€) total por coche</span>
            </div>
            <p className="text-slate-300 text-xs m-0 leading-relaxed">
              <strong>Horario:</strong> Salida 11:30 AM tras desembarcar. Llegada directa al hotel Valentino sobre las 2:00 PM.
            </p>
            <p className="text-slate-400 text-[11px] m-0 mt-0.5">
              <strong>Logística:</strong> Puerta a puerta directo por autopista exprés. Roxanne (+84 38 958 6465).
            </p>
          </div>
          <div className="p-2.5 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <span className="font-semibold text-white text-xs">3. Saigon DMC (Privado - vía 12Go Asia) 🌟 PRIVADO MÁS ECONÓMICO</span>
              <span className="text-[#D4AF37] font-semibold text-xs">~46€ (1.251.200 VND) total por coche</span>
            </div>
            <p className="text-slate-300 text-xs m-0 leading-relaxed">
              <strong>Horario:</strong> Salida 12:15 PM de Tuan Chau. Llegada al hotel Valentino sobre las 2:15 PM.
            </p>
            <p className="text-slate-400 text-[11px] m-0 mt-0.5">
              <strong>Logística:</strong> Reservable online en 12Go.asia. Coche privado para 2 personas.
            </p>
          </div>
        </div>
      </div>,
      "Dejar maletas en hotel del primer día (Dalvostro Valentino) dándoles una pequeña propina.",
      "Tarde libre de paseos y compras en el Old Quarter. Subir al Lotte Center Observation Deck a las 19:00h."
    ],
    dinner: "Cena especial en Grill 63 o Jacksons Steakhouse.",
    hotel: {
      name: "Success Airport Hanoi Hotel",
      details: "Ubicado cerca del aeropuerto para el vuelo de mañana. Desayuno incluido. Pago en alojamiento.",
      payment: "Pago en el alojamiento"
    },
    tips: [
      "Coge un taxi Grab hacia el Success Airport Hotel sobre las 22:30h."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Success+Airport+Hanoi+Hotel"
  },
  {
    day: 9,
    date: "5 de Agosto",
    location: "Bali (Ubud)",
    region: "Bali",
    title: "Vuelo a Bali (Isla de los Dioses)",
    morning: [
      "Grab al aeropuerto de Hanói temprano.",
      "Vuelo Hanói -> Bali a las 10:05 AM (Llegada 16:25h)."
    ],
    lunch: "Comida rápida en el aeropuerto.",
    afternoon: [
      "Llegada al Aeropuerto de Denpasar (Bali). Pasar inmigración con la e-VoA y código QR de Aduanas.",
      "Traslado Grab/Gojek a Ubud (Kubu Cemcem Mesari Private Villas).",
      "Opcional (si no, hacer mañana): Paseo corto por Ubud centro en Grab para ver Ubud Palace, Saraswati Temple (exterior iluminado) y tiendas en calle Jalan Raya Ubud."
    ],
    dinner: "Cena en la villa (solicitar por WhatsApp antes de llegar) o restaurantes en el centro (Pistachio Ubud o Donna Ubud).",
    hotel: {
      name: "Kubu Cemcem Mesari Private Villas",
      details: "Villa privada con piscina. Desayuno incluido. Pagado en Booking."
    },
    tips: [
      "Lleva listos los códigos QR de la Tasa de Bali y de Aduanas antes de pasar el control."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kubu+Cemcem+Mesari+Private+Villas"
  },
  {
    day: 10,
    date: "6 de Agosto",
    location: "Bali (Ubud)",
    region: "Bali",
    title: "Ruta de Templos y Atardecer",
    morning: [
      "Desayuno en la villa.",
      "Ruta en coche con conductor privado (Pak Hendrik: +62 81999111798).",
      "Visita al templo Tirta Empul (ritual de purificación Melukat opcional) + Templo Gunung Kawi Sebatu."
    ],
    lunch: "Comida en Suka Espresso (Ubud centro). Sacar dinero en efectivo en cajero BNI o Mandiri.",
    afternoon: [
      "Masaje relajante en [Gisella Spa en Google Maps](https://www.google.com/maps/place/Gisella+Spa+-+Jl+Pengosekan/@-8.5223961,115.2629111,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd23d3ccf0a5bcf:0x31212e456b9211be!8m2!3d-8.5223961!4d115.2629111!16s%2Fg%2F11fhr1z65y!18m1!1e1?entry=ttu).",
      "Paseo por el Monkey Forest (opcional) o tiendas de Ubud (si no se hizo ayer)."
    ],
    dinner: "Atardecer y cena en Cantina Rooftop Restaurant (Reservado Nadia Alonso 18:30h).",
    hotel: {
      name: "Kubu Cemcem Mesari Private Villas",
      details: "Segunda noche en Ubud."
    },
    tips: [
      "Escribe a Pak Hendrik por WhatsApp unos días antes para acordar la hora de recogida."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cantina+Rooftop+Ubud"
  },
  {
    day: 11,
    date: "7 de Agosto",
    location: "Bali (Ubud)",
    region: "Bali",
    title: "Desayuno Flotante y Arrozales",
    morning: [
      "8:00 AM - Desayuno flotante en la piscina de la villa.",
      "Excursión a las Terrazas de Arroz de Tegallalang.",
      "Visita a la cascada Kanto Lampo o Suwat Waterfall."
    ],
    lunch: "Comida en local cercano a Tegallalang.",
    afternoon: [
      "Tarde de relax disfrutando de la piscina de la villa.",
      "Tarde-noche: Visita a Bias Tugel Beach o Pantai Lebih."
    ],
    dinner: "Cena en Teba Sari Resto (mesas flotantes sobre arrozales).",
    hotel: {
      name: "Kubu Cemcem Mesari Private Villas",
      details: "Tercera noche en Ubud."
    },
    tips: [
      "Escribe a Nyoman (+62 878-6214-1641) hoy para confirmar la recogida del Monte Batur.",
      "Avisa al hotel para que os dejen el desayuno para llevar mañana a las 4 AM."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tegallalang+Rice+Terrace"
  },
  {
    day: 12,
    date: "8 de Agosto",
    location: "Bali (Ubud)",
    region: "Bali",
    title: "Amanecer en el Volcán Monte Batur",
    morning: [
      "4:00 AM - Recogida para la excursión del Monte Batur con Nyoman.",
      "5:30 AM - Llegada al amanecer en el volcán (tour 4x4) y paseo por campos de lava negra.",
      "8:30 AM - Relajarse en las aguas termales con vistas al lago Batur."
    ],
    lunch: "Comida de camino de vuelta a Ubud.",
    afternoon: [
      "Regreso a la villa para descansar del madrugón.",
      "Masaje relajante en la propia villa o en Svaha Spa Kanten."
    ],
    dinner: "Cena en Warung Kopi & Makan Legong o Warung d'Alas Gianyar.",
    hotel: {
      name: "Kubu Cemcem Mesari Private Villas",
      details: "Última noche en Ubud."
    },
    tips: [
      "Lleva abrigo (chaqueta) para el volcán al amanecer, hace bastante frío."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mount+Batur+Volcano"
  },
  {
    day: 13,
    date: "9 de Agosto",
    location: "Islas Gili (Trawangan)",
    region: "Gili",
    title: "Ferry al Paraíso",
    morning: [
      "Desayuno en la villa.",
      "Traslado en taxi/Grab al puerto de Padang Bai.",
      "Ferry rápido a las 11:30 AM rumbo a Gili Trawangan."
    ],
    lunch: "Llegada a las 13:00h y comida en Gili Trawangan o en el hotel.",
    afternoon: [
      "Traslado al hotel en carro de caballos (no hay coches).",
      "Hacer check-in en Aston Sunset Beach Resort.",
      "Paseo por Sunset Beach frente al resort y fotos en los columpios."
    ],
    dinner: "Cena en The Beach House Gili Trawangan o Casa Vintage Beach.",
    hotel: {
      name: "Aston Sunset Beach Resort (Habitación Deluxe)",
      details: "Desayuno incluido. Pagado previamente.",
      bookingRef: "Pagado"
    },
    tips: [
      "Lleva escarpines para los columpios; hay coral y rocas.",
      "Los billetes del ferry rápido están ya comprados con Wahana Virendra (Localizador: ABE59377)."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aston+Sunset+Beach+Resort+Gili"
  },
  {
    day: 14,
    date: "10 de Agosto",
    location: "Islas Gili (Trawangan)",
    region: "Gili",
    title: "Bicicletas y Tortugas",
    morning: [
      "Desayuno en el hotel.",
      "Alquilar bicicletas en el hotel y dar la vuelta completa a la isla (1.5 horas).",
      "Brunch en Kayu Cafe o The Loft."
    ],
    lunch: "Brunch/Comida ligera en el centro de Gili.",
    afternoon: [
      "13:00 PM - Tour de Snorkel compartido de 4 horas (Turtle Point, las famosas estatuas submarinas de Gili Meno). Estar 30 min antes.",
      "Masaje relajante después del snorkel en You Spa Trawangan."
    ],
    dinner: "Cena en Ko Ko Mo Beach Club, Casa Vintage Beach o PinkCoco Sunset.",
    hotel: {
      name: "Aston Sunset Beach Resort",
      details: "Segunda noche en Gili."
    },
    tips: [
      "La reserva del snorkel está en el PDF de tu WhatsApp.",
      "Utiliza protector solar biodegradable para proteger la vida marina."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gili+Trawangan+Turtle+Point"
  },
  {
    day: 15,
    date: "11 de Agosto",
    location: "Islas Gili (Trawangan)",
    region: "Gili",
    title: "Relax Absoluto",
    morning: [
      "Desayuno en el hotel.",
      "Relax en las tumbonas de la playa del resort o piscina."
    ],
    lunch: "Almuerzo relajado en el restaurante del hotel.",
    afternoon: [
      "Tarde libre para disfrutar de la isla, leer o hacer compras.",
      "Opcional: Masaje de spa en las instalaciones del Aston Resort."
    ],
    dinner: "Cena de despedida con los pies en la arena.",
    hotel: {
      name: "Aston Sunset Beach Resort",
      details: "Última noche en las islas Gili."
    },
    tips: [
      "Disfruta del último atardecer en los columpios.",
      "Prepara las maletas por la noche; el ferry de mañana sale temprano."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aston+Sunset+Beach+Resort+Gili"
  },
  {
    day: 16,
    date: "12 de Agosto",
    location: "Islas Gili -> Madrid",
    region: "Gili",
    title: "Regreso a Casa",
    morning: [
      "Desayuno en el hotel y check-out.",
      "Ferry rápido de vuelta a Padang Bai a las 10:30 AM (Llegada a las 13:00h). Localizador: ABE59378."
    ],
    lunch: "Comida en el puerto de Padang Bai o de camino.",
    afternoon: [
      "Traslado en taxi/Grab al aeropuerto de Bali (30-60 min).",
      "Vuelo internacional de regreso Bali -> Madrid con salida a las 19:20h."
    ],
    dinner: "Cena a bordo del avión.",
    hotel: {
      name: "Vuelo Internacional (Noche a bordo)",
      details: "Llegada a Madrid el 13 de agosto a las 7:35 AM."
    },
    tips: [
      "Prepara el check-in online del vuelo internacional 24 horas antes."
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Denpasar+Airport+Bali"
  }
];

// Checklist items from the Audit
const initialChecklist: ChecklistItem[] = [
  { id: "grab", text: "Descargar y configurar app GRAB con tarjeta de crédito", category: "Apps/Prep", done: false },
  { id: "gojek", text: "Descargar y configurar app Gojek / InDrive para Bali", category: "Apps/Prep", done: false },
  { id: "cards", text: "Llevar tarjetas sin comisiones (Revolut, N26, etc.)", category: "Finanzas", done: false },
  { id: "cash", text: "Llevar euros en efectivo para cambiar en joyería Ha Trung", category: "Finanzas", done: false },
  { id: "seguro", text: "Verificar póliza activa de IATI Mochilero en el correo", category: "Docs", done: true },
  { id: "sim", text: "Adquirir eSIM / tarjeta SIM local (Viettel)", category: "Apps/Prep", done: false },
  { id: "visa", text: "Visado e-VoA Indonesia (Web Molina)", category: "Docs", done: true },
  { id: "levy", text: "Tasa Turística de Bali (Love Bali)", category: "Docs", done: true },
  { id: "customs", text: "Formulario Inmigración/Aduanas Indonesia (3 días antes del vuelo)", category: "Docs", done: false },
  { id: "sapa_pickup", text: "Confirmar recogida en Lao Cai (Coche compartido Sapa $5)", category: "Reservas", done: false },
  { id: "trekking", text: "Confirmar trekking arrozales con Hmong Sapa Hiking Tours", category: "Reservas", done: false },
  { id: "hendrik", text: "Contactar a Pak Hendrik (+62 81999111798) para el 6 de agosto", category: "Reservas", done: false },
  { id: "batur", text: "Contactar a Nyoman (+62 878-6214-1641) para el Monte Batur", category: "Reservas", done: false }
];

// Destinations Data
const destinationsData: Destination[] = [
  {
    id: "hanoi",
    name: "Hanói",
    region: "Vietnam",
    desc: "La vibrante y caótica capital de Vietnam, famosa por su arquitectura centenaria, su gastronomía callejera de primer nivel y su mezcla de influencias chinas y francesas.",
    highlights: ["Pasear por el Lago Hoan Kiem al amanecer", "Café de huevo tradicional en Old Quarter", "Ver pasar el tren por la mítica Train Street", "Cruzar el puente rojo hacia el Templo Ngoc Son"],
    tip: "Cambia tu dinero en las joyerías de la calle HA TRUNG; tienen el tipo de cambio oficial más alto de la ciudad sin comisiones.",
    imageUrl: "https://images.unsplash.com/photo-1509060464153-44667396260f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "sapa",
    name: "Sapa",
    region: "Vietnam",
    desc: "Un destino montañoso rodeado de terrazas de arroz verdes talladas en las colinas, cascadas atronadoras y hogar de diversas minorías étnicas como los H'mong.",
    highlights: ["Subir al Fansipan (el pico más alto de Indochina)", "Trekking a través de los arrozales locales", "Conocer las aldeas locales de Ta Van y Lao Chai", "Masaje herbal tradicional H'mong"],
    tip: "Lleva ropa de abrigo y chubasquero impermeable; el clima a 3000 metros de altitud cambia en minutos y suele hacer frío y niebla.",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df519f0397e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "ninhbinh",
    name: "Ninh Binh",
    region: "Vietnam",
    desc: "Conocida como la 'Bahía de Ha Long terrestre', esta provincia ofrece paisajes kársticos brutales recortados entre campos de arroz y ríos serpenteantes.",
    highlights: ["Paseo en barca tradicional de Trang An", "Subir los 500 escalones de Mua Cave al atardecer", "Bicicleta o moto entre campos de lotos en Tam Coc", "Cruzar Bich Dong Pagoda por su puente de piedra"],
    tip: "Alquila una moto por unos 100,000 VND (~4€ al día). Es la forma más rápida y cómoda de explorar los templos y cuevas de la región.",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "halong",
    name: "Bahía de Ha Long",
    region: "Vietnam",
    desc: "Patrimonio de la Humanidad por la UNESCO, esta bahía alberga miles de islas de caliza de formas caprichosas que sobresalen de aguas de color verde esmeralda.",
    highlights: ["Navegar en un camarote de lujo con balcón privado", "Hacer kayak entre acantilados marinos", "Explorar cuevas ocultas como Sung Sot o Luon", "Ver el amanecer haciendo Tai Chi en la cubierta"],
    tip: "El pago de los extras del crucero se hace a bordo. Ojo con el recargo del 4% por pagar con tarjeta; si puedes, reserva algo de efectivo.",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "ubud",
    name: "Ubud",
    region: "Bali",
    desc: "El corazón cultural y espiritual de Bali. Un paraje selvático salpicado de templos hinduistas, santuarios, retiros de yoga y el famoso bosque de los monos.",
    highlights: ["Ritual de purificación hinduista en Tirta Empul", "Safari en 4x4 por la lava negra del volcán Monte Batur", "Terrazas de arroz Tegallalang en columpio gigante", "Cena en un restaurante sobre arrozales"],
    tip: "Habla con Pak Hendrik por WhatsApp 2-3 días antes del 6 de agosto para coordinar su recogida. Es un conductor privado de total confianza.",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "gili",
    name: "Gili Trawangan",
    region: "Islas Gili",
    desc: "Una pequeña isla paradisíaca rodeada de aguas cristalinas, playas de arena blanca y arrecifes de coral llenos de tortugas. No se permiten vehículos a motor.",
    highlights: ["Snorkel con tortugas en Turtle Point", "Dar la vuelta a la isla entera en bicicleta", "Ver el atardecer en los columpios dentro del agua", "Cena de marisco fresco con los pies en la arena"],
    tip: "Lleva escarpines para bañarte y andar por el agua; la costa está repleta de corales muertos afilados y rocas que pueden cortarte.",
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop"
  }
];

export default function HoneymoonPage() {
  const [activeTab, setActiveTab] = useState<"itinerario" | "checklist" | "expenses" | "destinations">("itinerario");
  const [activeRegion, setActiveRegion] = useState<"All" | "Vietnam" | "Bali" | "Gili">("All");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  
  // Expenses states
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expDescription, setExpDescription] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expCurrency, setExpCurrency] = useState<"VND" | "IDR" | "EUR">("VND");

  // Currency Converter states (approximate rates: 1 EUR = ~26,500 VND | 1 EUR = ~17,600 IDR)
  const [vndInput, setVndInput] = useState<string>("100000");
  const [idrInput, setIdrInput] = useState<string>("150000");
  const [eurResultVnd, setEurResultVnd] = useState<number>(3.77);
  const [eurResultIdr, setEurResultIdr] = useState<number>(8.52);

  // Load state from localStorage on mount
  useEffect(() => {
    // Checklist
    const savedCheck = localStorage.getItem("honeymoon_checklist");
    if (savedCheck) {
      try { setChecklist(JSON.parse(savedCheck)); } catch (e) { console.error(e); }
    }
    
    // Expenses
    const savedExp = localStorage.getItem("honeymoon_expenses");
    if (savedExp) {
      try { setExpenses(JSON.parse(savedExp)); } catch (e) { console.error(e); }
    }
  }, []);

  // Save checklist toggle
  const handleToggleCheck = (id: string) => {
    const updated = checklist.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    );
    setChecklist(updated);
    localStorage.setItem("honeymoon_checklist", JSON.stringify(updated));
  };

  const handleResetChecklist = () => {
    if (window.confirm("¿Seguro que quieres reiniciar la lista de tareas?")) {
      setChecklist(initialChecklist);
      localStorage.removeItem("honeymoon_checklist");
    }
  };

  // Convert inputs dynamically
  useEffect(() => {
    const val = parseFloat(vndInput);
    setEurResultVnd(!isNaN(val) ? Math.round((val / 26500) * 100) / 100 : 0);
  }, [vndInput]);

  useEffect(() => {
    const val = parseFloat(idrInput);
    setEurResultIdr(!isNaN(val) ? Math.round((val / 17600) * 100) / 100 : 0);
  }, [idrInput]);

  // Log Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription.trim() || !expAmount || isNaN(parseFloat(expAmount))) return;
    
    const amountNum = parseFloat(expAmount);
    let inEur = amountNum;
    
    if (expCurrency === "VND") {
      inEur = Math.round((amountNum / 26500) * 100) / 100;
    } else if (expCurrency === "IDR") {
      inEur = Math.round((amountNum / 17600) * 100) / 100;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: expDescription,
      amount: amountNum,
      currency: expCurrency,
      amountInEur: inEur,
      date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem("honeymoon_expenses", JSON.stringify(updated));
    
    // Clear inputs
    setExpDescription("");
    setExpAmount("");
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(item => item.id !== id);
    setExpenses(updated);
    localStorage.setItem("honeymoon_expenses", JSON.stringify(updated));
  };

  const handleClearExpenses = () => {
    if (window.confirm("¿Deseas vaciar todo el registro de gastos?")) {
      setExpenses([]);
      localStorage.removeItem("honeymoon_expenses");
    }
  };

  // Filter itinerary
  const filteredItinerary = itineraryData.filter(item => 
    activeRegion === "All" ? true : item.region === activeRegion
  );

  const doneCount = checklist.filter(item => item.done).length;
  const progressPercent = Math.round((doneCount / checklist.length) * 100);
  
  // Total expenses in EUR
  const totalSpentInEur = expenses.reduce((sum, item) => sum + item.amountInEur, 0);

  return (
    <div className={styles.wrapper}>
      {/* Custom Travel Companion Header */}
      <header className={styles.appHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.appLogo}>
            ✈️ COMPAÑERO DE VIAJE <span>LUNA DE MIEL</span>
          </div>
          <Link href="/" className={styles.backToWeddingLink}>
            ← Volver a la Boda
          </Link>
        </div>
      </header>

      {/* Hero Travel Banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.preTitle}>Aventura de Dos</span>
          <h1 className={styles.mainTitle}>Nuestra Luna de Miel</h1>
          <p className={styles.dates}>28 de Julio — 13 de Agosto, 2026</p>
          <div className={styles.badgesContainer}>
            <span className={styles.badge}>🇻🇳 Vietnam</span>
            <span className={styles.badge}>🇮🇩 Bali</span>
            <span className={styles.badge}>🏝️ Gili Trawangan</span>
          </div>
        </div>
      </section>

      <div className={styles.contentContainer}>
        {/* TAB NAVIGATION BAR */}
        <div className={styles.tabNav}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "itinerario" ? styles.activeTabBtn : ""}`}
            onClick={() => setActiveTab("itinerario")}
          >
            🗺️ Itinerario
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "checklist" ? styles.activeTabBtn : ""}`}
            onClick={() => setActiveTab("checklist")}
          >
            📋 Auditoría & Tareas
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "expenses" ? styles.activeTabBtn : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            💵 Gastos & Conversor
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "destinations" ? styles.activeTabBtn : ""}`}
            onClick={() => setActiveTab("destinations")}
          >
            🌴 Guía de Destinos
          </button>
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">
          {activeTab === "itinerario" && (
            <motion.div
              key="itinerary-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Region Filter Buttons */}
              <div className={styles.filterBar}>
                <button 
                  className={activeRegion === "All" ? styles.activeFilter : ""} 
                  onClick={() => setActiveRegion("All")}
                >
                  Ver Todo el Viaje
                </button>
                <button 
                  className={activeRegion === "Vietnam" ? styles.activeFilter : ""} 
                  onClick={() => setActiveRegion("Vietnam")}
                >
                  🇻🇳 Vietnam
                </button>
                <button 
                  className={activeRegion === "Bali" ? styles.activeFilter : ""} 
                  onClick={() => setActiveRegion("Bali")}
                >
                  🇮🇩 Bali
                </button>
                <button 
                  className={activeRegion === "Gili" ? styles.activeFilter : ""} 
                  onClick={() => setActiveRegion("Gili")}
                >
                  🏝️ Islas Gili
                </button>
              </div>

              {/* Day-by-Day Accordions */}
              <div className={styles.timelineContainer}>
                {filteredItinerary.map((dayData) => {
                  const isExpanded = expandedDay === dayData.day;
                  return (
                    <div 
                      key={dayData.day} 
                      className={`${styles.timelineCard} ${isExpanded ? styles.timelineCardExpanded : ""}`}
                    >
                      <div 
                        className={styles.timelineHeader}
                        onClick={() => setExpandedDay(isExpanded ? null : dayData.day)}
                      >
                        <div className={styles.timelineHeaderMain}>
                          <div className={styles.dayIndicator}>
                            <span>Día</span>
                            <strong>{dayData.day}</strong>
                          </div>
                          <div className={styles.timelineHeaderTitle}>
                            <span className={styles.timelineDate}>{dayData.date} — {dayData.location}</span>
                            <h3>{dayData.title}</h3>
                          </div>
                        </div>
                        <div className={styles.expandIcon}>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            className={styles.timelineContent}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className={styles.itineraryGrid}>
                              {/* Details */}
                              <div className={styles.itinerarySteps}>
                                {dayData.morning && (
                                  <div className={styles.timeBlock}>
                                    <h4>🌅 Mañana</h4>
                                    <ul>
                                      {dayData.morning.map((step, idx) => {
                                        if (typeof step !== "string") {
                                          return <div key={idx} className={styles.customStepContainer}>{step}</div>;
                                        }
                                        return <li key={idx}>{step}</li>;
                                      })}
                                    </ul>
                                  </div>
                                )}

                                {dayData.lunch && (
                                  <div className={styles.timeBlock}>
                                    <h4>🍽️ Almuerzo</h4>
                                    <p className={styles.foodText}>{dayData.lunch}</p>
                                  </div>
                                )}

                                {dayData.afternoon && (
                                  <div className={styles.timeBlock}>
                                    <h4>🌇 Tarde</h4>
                                    <ul>
                                      {dayData.afternoon.map((step, idx) => {
                                        if (typeof step !== "string") {
                                          return <div key={idx} className={styles.customStepContainer}>{step}</div>;
                                        }
                                        return <li key={idx}>{step}</li>;
                                      })}
                                    </ul>
                                  </div>
                                )}

                                {dayData.dinner && (
                                  <div className={styles.timeBlock}>
                                    <h4>🌙 Cena</h4>
                                    <p className={styles.foodText}>{dayData.dinner}</p>
                                  </div>
                                )}
                              </div>

                              {/* Sidebar */}
                              <div className={styles.logisticsSidebar}>
                                {dayData.hotel && (
                                  <div className={styles.sidebarWidget}>
                                    <div className={styles.widgetHeader}>
                                      <Sparkles size={14} />
                                      <h5>Alojamiento</h5>
                                    </div>
                                    <p className={styles.hotelName}>{dayData.hotel.name}</p>
                                    {dayData.hotel.details && <p className={styles.widgetText}>{dayData.hotel.details}</p>}
                                    {dayData.hotel.bookingRef && (
                                      <div className={styles.codeItem}>
                                        <span>Localizador:</span>
                                        <code>{dayData.hotel.bookingRef}</code>
                                      </div>
                                    )}
                                    {dayData.hotel.pinCode && (
                                      <div className={styles.codeItem}>
                                        <span>Código PIN:</span>
                                        <code>{dayData.hotel.pinCode}</code>
                                      </div>
                                    )}
                                    {dayData.hotel.payment && <span className={styles.paymentInfo}>{dayData.hotel.payment}</span>}
                                  </div>
                                )}

                                {dayData.mapsUrl && (
                                  <a 
                                    href={dayData.mapsUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={styles.mapBtn}
                                  >
                                    <Map size={15} /> Ver en Google Maps
                                  </a>
                                )}

                                {dayData.tips && dayData.tips.length > 0 && (
                                  <div className={styles.sidebarWidgetTips}>
                                    <div className={styles.widgetHeaderTips}>
                                      <Info size={14} />
                                      <h5>Consejos del Día</h5>
                                    </div>
                                    <ul>
                                      {dayData.tips.map((tip, idx) => (
                                        <li key={idx}>{tip}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "checklist" && (
            <motion.div
              key="checklist-tab"
              className={styles.glassCard}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className={styles.cardHeader}>
                <CheckCircle className={styles.goldIcon} size={22} />
                <h2>Control de Tareas y Auditoría del Viaje</h2>
              </div>
              
              <div className={styles.progressContainer}>
                <div className={styles.progressBarWrapper}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
                <span className={styles.progressText}>
                  {doneCount} de {checklist.length} ({progressPercent}%) completadas. ¡Llevas buen ritmo de preparación!
                </span>
              </div>

              <div className={styles.checklistList}>
                {checklist.map((item) => (
                  <div 
                    key={item.id} 
                    className={`${styles.checkItem} ${item.done ? styles.checkItemDone : ""}`}
                    onClick={() => handleToggleCheck(item.id)}
                  >
                    <div className={styles.checkbox}>
                      {item.done ? (
                        <CheckCircle size={18} className={styles.goldText} />
                      ) : (
                        <div className={styles.uncheckedCircle} />
                      )}
                    </div>
                    <div className={styles.checkTextContainer}>
                      <p className={styles.checkText}>{item.text}</p>
                      <span className={styles.checkCategory}>{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleResetChecklist} className={styles.resetBtn}>
                <RotateCcw size={13} /> Reiniciar Lista de Tareas
              </button>
            </motion.div>
          )}

          {activeTab === "expenses" && (
            <motion.div
              key="expenses-tab"
              className={styles.expensesGrid}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Left Column: Log Expense & Converter */}
              <div className={styles.sidebarColumn}>
                
                {/* Logger Form */}
                <div className={styles.glassCard}>
                  <div className={styles.cardHeader}>
                    <Plus className={styles.goldIcon} size={22} />
                    <h2>Anotar Nuevo Gasto</h2>
                  </div>
                  <p className={styles.calcIntro}>Registra los dongs (VND), rupias (IDR) o euros (EUR) que vayáis gastando sobre la marcha para controlar el presupuesto:</p>
                  
                  <form onSubmit={handleAddExpense} className={styles.expenseForm}>
                    <div className={styles.calcGroup}>
                      <label>Descripción / Concepto</label>
                      <div className={styles.inputWrapper}>
                        <input 
                          type="text" 
                          placeholder="Ej: Taxi a Sapa, Cena en Ubud..." 
                          value={expDescription}
                          onChange={(e) => setExpDescription(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.calcGroup}>
                        <label>Importe</label>
                        <div className={styles.inputWrapper}>
                          <input 
                            type="number" 
                            step="any"
                            placeholder="Importe" 
                            value={expAmount}
                            onChange={(e) => setExpAmount(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.calcGroup}>
                        <label>Divisa</label>
                        <div className={styles.inputWrapper}>
                          <select 
                            value={expCurrency} 
                            onChange={(e) => setExpCurrency(e.target.value as any)}
                          >
                            <option value="VND">VND (₫)</option>
                            <option value="IDR">IDR (Rp)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className={styles.submitExpenseBtn}>
                      Registrar Gasto
                    </button>
                  </form>
                </div>

                {/* Currency Converter */}
                <div className={styles.glassCard}>
                  <div className={styles.cardHeader}>
                    <Compass className={styles.goldIcon} size={22} />
                    <h2>Calculadora de Cambio Rápida</h2>
                  </div>
                  
                  <div className={styles.calcGroup}>
                    <label>Vietnam Dong (VND)</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        type="number" 
                        value={vndInput}
                        onChange={(e) => setVndInput(e.target.value)}
                      />
                      <span className={styles.inputSuffix}>₫</span>
                    </div>
                    <div className={styles.calcResult}>
                      Equivale a: <strong>{eurResultVnd.toLocaleString("de-DE")} EUR</strong>
                    </div>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.calcGroup}>
                    <label>Indonesian Rupiah (IDR)</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        type="number" 
                        value={idrInput}
                        onChange={(e) => setIdrInput(e.target.value)}
                      />
                      <span className={styles.inputSuffix}>Rp</span>
                    </div>
                    <div className={styles.calcResult}>
                      Equivale a: <strong>{eurResultIdr.toLocaleString("de-DE")} EUR</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Expense Log List */}
              <div className={styles.glassCard}>
                <div className={styles.cardHeader}>
                  <Euro className={styles.goldIcon} size={22} />
                  <h2>Historial de Gastos Acumulados</h2>
                </div>

                {/* Total box */}
                <div className={styles.expenseSummaryCard}>
                  <span className={styles.expenseSummaryTotal}>Gasto Total Estimado</span>
                  <span className={styles.expenseSummaryAmount}>{totalSpentInEur.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                </div>

                {expenses.length === 0 ? (
                  <p className={styles.calcIntro} style={{ textAlign: "center", marginTop: "2rem" }}>
                    No hay ningún gasto registrado todavía. ¡Vuestros registros aparecerán aquí!
                  </p>
                ) : (
                  <>
                    <div className={styles.expensesList}>
                      {expenses.map((item) => (
                        <div key={item.id} className={styles.expenseLogItem}>
                          <div className={styles.expenseInfo}>
                            <span className={styles.expenseDesc}>{item.description}</span>
                            <span className={styles.expenseOrig}>
                              {item.amount.toLocaleString("de-DE")} {item.currency} ({item.date})
                            </span>
                          </div>
                          <div className={styles.expenseMath}>
                            <span className={styles.expenseEur}>{item.amountInEur.toFixed(2)} €</span>
                            <button 
                              onClick={() => handleDeleteExpense(item.id)} 
                              className={styles.deleteExpenseBtn}
                              title="Eliminar gasto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={handleClearExpenses} 
                      className={styles.resetBtn} 
                      style={{ marginTop: "1.5rem" }}
                    >
                      Vaciar Registro de Gastos
                    </button>
                  </>
                )}

                {/* WhatsApp Contacts Area inside Panel */}
                <div className={styles.divider} style={{ marginTop: "2rem" }} />
                <div className={styles.cardHeader} style={{ borderBottom: "none", marginBottom: "0.5rem", paddingBottom: "0" }}>
                  <MessageSquare className={styles.goldIcon} size={18} />
                  <h3 style={{ fontSize: "1rem", color: "#ffffff", fontWeight: 600 }}>Enlaces Rápidos a Coordinadores</h3>
                </div>
                <div className={styles.contactsList}>
                  <a href="https://wa.me/84389586465" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                    <div className={styles.contactDetails}>
                      <strong>Roxanne (Crucero Vietnam)</strong>
                      <span>+84 38 958 6465</span>
                    </div>
                    <ExternalLink size={14} />
                  </a>
                  <a href="https://wa.me/6281999111798" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                    <div className={styles.contactDetails}>
                      <strong>Pak Hendrik (Chofer Ubud)</strong>
                      <span>+62 819-9911-1798</span>
                    </div>
                    <ExternalLink size={14} />
                  </a>
                  <a href="https://wa.me/6287862141641" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                    <div className={styles.contactDetails}>
                      <strong>Nyoman (Volcán Monte Batur)</strong>
                      <span>+62 878-6214-1641</span>
                    </div>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "destinations" && (
            <motion.div
              key="destinations-tab"
              className={styles.destinationsGrid}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {destinationsData.map((dest) => (
                <div key={dest.id} className={styles.destinationCard}>
                  {/* Photo container */}
                  <div 
                    className={styles.destImageContainer}
                    style={{
                      background: `linear-gradient(to bottom, rgba(5, 12, 10, 0) 30%, rgba(5, 12, 10, 0.95) 100%), 
                                   url('${dest.imageUrl}') center/cover no-repeat`
                    }}
                  >
                    <div className={styles.destImageOverlay} />
                    <div className={styles.destTitleContainer}>
                      <span className={styles.destRegion}>{dest.region}</span>
                      <h4 className={styles.destName}>{dest.name}</h4>
                    </div>
                  </div>

                  <div className={styles.destBody}>
                    <p className={styles.destDesc}>{dest.desc}</p>
                    
                    <div className={styles.destHighlights}>
                      <h6>Experiencias Clave</h6>
                      <ul>
                        {dest.highlights.map((hl, idx) => (
                          <li key={idx}>{hl}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.destTipsWidget}>
                      <strong>💡 Consejo Especial: </strong>
                      {dest.tip}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
