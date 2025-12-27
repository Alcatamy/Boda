export const eventDetails = {
  title: "Boda de Adriana y Adrián",
  description: "¡Nos casamos! Acompáñanos en este día tan especial.",
  location: "Finca El Gasco, Torrelodones, Madrid",
  startDate: "2025-09-20T17:30:00",
  endDate: "2025-09-21T04:00:00",
};

export const googleCalendarUrl = () => {
  const { title, description, location, startDate, endDate } = eventDetails;
  const start = startDate.replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = endDate.replace(/[-:]/g, "").split(".")[0] + "Z";
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&dates=${start}/${end}`;
};

export const downloadIcs = () => {
  const { title, description, location, startDate, endDate } = eventDetails;
  const start = startDate.replace(/[-:]/g, "").replace("T", "T").split(".")[0].replace(/-/g,"");
  const end = endDate.replace(/[-:]/g, "").replace("T", "T").split(".")[0].replace(/-/g,"");
  
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
  link.setAttribute("download", "boda-adriana-y-adrian.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
