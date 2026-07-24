$lines = Get-Content .env.local
$tokenLine = $lines | Where-Object { $_ -like "VERCEL_OIDC_TOKEN=*" }
$token = $tokenLine.Split("=", 2)[1].Trim('"')

$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $res = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/boda-nadia-adrian/env" -Headers $headers
    $res | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Vercel API error: $_"
}
