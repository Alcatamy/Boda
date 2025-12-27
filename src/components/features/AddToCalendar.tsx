"use client";

import { CalendarPlus, Download } from "lucide-react";
import { googleCalendarUrl, downloadIcs } from "@/lib/calendar";
import styles from "./AddToCalendar.module.css";

export default function AddToCalendar() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Guárdalo en tu calendario</h3>
      <div className={styles.buttons}>
        <a 
          href={googleCalendarUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.button}
        >
          <CalendarPlus size={18} />
          Google Calendar
        </a>
        <button onClick={downloadIcs} className={styles.buttonOutline}>
          <Download size={18} />
          Apple / Outlook (.ics)
        </button>
      </div>
    </div>
  );
}
