[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$destDir = "C:\Users\rafae_xicky\mingit"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$zipPath = "$destDir\mingit.zip"
$url = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip"

Write-Host "Downloading MinGit with TLS 1.2..."
$webClient = New-Object System.Net.WebClient
$webClient.Headers.Add("User-Agent", "PowerShell")
$webClient.DownloadFile($url, $zipPath)

Write-Host "Extracting MinGit..."
Expand-Archive -Path $zipPath -DestinationPath $destDir -Force
Remove-Item $zipPath -Force
Write-Host "MinGit successfully extracted!"
