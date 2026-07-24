$git = "C:\Program Files\Git\cmd\git.exe"

& $git config user.name "Adrian Alcaide"
& $git config user.email "adrianalkide@gmail.com"

& $git add src/ next.config.mjs supabase_quiz_schema.sql
& $git commit -m "Actualizar preguntas del quiz y arreglar carga de imagenes para Vercel"
& $git push origin main
