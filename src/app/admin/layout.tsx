// Layout exclusivo para las rutas /admin/*
// Omite el EnvelopeIntro, Header, MusicPlayer y efectos del layout principal

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {children}
    </main>
  );
}
