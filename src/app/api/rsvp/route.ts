import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Initialize Supabase admin client (bypass RLS if needed, or just normal client)
// We use the normal client with anon key as it's sufficient for insert if RLS allows anon inserts,
// but server-side it's safer to use the service role key if available, or just regular env vars.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // 1. Check for duplicates
        const { data: existingGuest, error: searchError } = await supabase
            .from('guests')
            .select('id')
            .or(`first_name.ilike.${data.firstName},last_name.ilike.${data.lastName}`)
            .limit(1);

        if (searchError) {
            console.error("Supabase search error:", searchError);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        if (existingGuest && existingGuest.length > 0) {
            return NextResponse.json({ error: "duplicate" }, { status: 409 });
        }

        // 2. Insert into Supabase
        const { error: insertError } = await supabase
            .from('guests')
            .insert([
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    attending: data.attending === "yes",
                    dietary_restrictions: data.dietaryRestrictions || null,
                    menu_choice: data.menuChoice || null,
                    has_plus_one: data.hasPlusOne || false,
                    plus_one_name: data.hasPlusOne ? data.plusOneName : null,
                    children_count: data.childrenCount || 0,
                },
            ]);

        if (insertError) {
            if (insertError.code === '23505') {
                return NextResponse.json({ error: "duplicate" }, { status: 409 });
            }
            console.error("Supabase insert error:", insertError);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        // 3. Send Email Notification
        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD;

        if (gmailUser && gmailPass) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: gmailPass,
                },
            });

            const attendingText = data.attending === "yes" ? "✅ SÍ ASISTE" : "❌ NO ASISTE";
            const subject = `Nueva confirmación de Boda: ${data.firstName} ${data.lastName} - ${attendingText}`;

            let htmlContent = `
        <h2>Nueva confirmación de asistencia</h2>
        <p><strong>Invitado:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Asistencia:</strong> ${attendingText}</p>
      `;

            if (data.attending === "yes") {
                htmlContent += `
          <p><strong>Menú:</strong> ${data.menuChoice === "meat" ? "🥩 Carne" : data.menuChoice === "fish" ? "🐟 Pescado" : "No especificado"}</p>
          <p><strong>Restricciones alimentarias:</strong> ${data.dietaryRestrictions || "Ninguna"}</p>
          <p><strong>Acompañante:</strong> ${data.hasPlusOne ? `Sí (${data.plusOneName})` : "No"}</p>
          <p><strong>Niños:</strong> ${data.childrenCount}</p>
        `;
            }

            await transporter.sendMail({
                from: `"Web Boda" <${gmailUser}>`,
                to: gmailUser, // send to yourselves
                replyTo: gmailUser,
                subject: subject,
                html: htmlContent,
            });
        } else {
            console.warn("Email credentials not found. Skipping email notification.");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing RSVP:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
