export const eventDetails = {
  title: "Boda de Nadia y Adrián",
  description: "¡Nos casamos! Estamos deseando celebrar este día contigo. Todos los detalles en: https://boda-nadia-adrian.vercel.app/",
  location: "Hacienda Mityana, Ctra. M-607, Km 37.8, 28770 Colmenar Viejo, Madrid",
  startDate: "2026-07-25T18:00:00",
  endDate: "2026-07-26T05:00:00",
};

export const googleCalendarUrl = () => {
  const { title, description, location, startDate, endDate } = eventDetails;
  const start = startDate.replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = endDate.replace(/[-:]/g, "").split(".")[0] + "Z";

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&dates=${start}/${end}`;
};

export const downloadIcs = () => {
  const { title, description, location, startDate, endDate } = eventDetails;
  const start = startDate.replace(/[-:]/g, "").replace("T", "T").split(".")[0].replace(/-/g, "");
  const end = endDate.replace(/[-:]/g, "").replace("T", "T").split(".")[0].replace(/-/g, "");

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "boda-nadia-y-adrian.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
