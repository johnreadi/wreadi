
param (
    [string]$XiboPath = "D:\xibo"
)

$ComposeFile = "$XiboPath\docker-compose.yml"

if (-not (Test-Path $ComposeFile)) {
    Write-Host "❌ Erreur : Le fichier docker-compose.yml n'a pas été trouvé dans $XiboPath" -ForegroundColor Red
    Write-Host "Veuillez vérifier le chemin de votre installation Xibo."
    return
}

$content = Get-Content $ComposeFile -Raw

if ($content -match "innodb-force-recovery") {
    Write-Host "⚠️ Le mode de récupération semble déjà activé dans le fichier." -ForegroundColor Yellow
    return
}

# Injection de la commande de récupération
# Recherche de l'image mysql:5.7 pour insérer la commande juste après
$newContent = $content -replace "image: mysql:5.7", "image: mysql:5.7`r`n        command: mysqld --innodb-force-recovery=1"

if ($newContent -eq $content) {
    Write-Host "❌ Erreur : Impossible de localiser 'image: mysql:5.7' dans le fichier." -ForegroundColor Red
    return
}

Set-Content $ComposeFile $newContent
Write-Host "✅ Fichier modifié avec succès !" -ForegroundColor Green
Write-Host "La commande 'mysqld --innodb-force-recovery=1' a été ajoutée."
Write-Host ""
Write-Host "👉 Prochaines étapes :"
Write-Host "1. Ouvrez un terminal dans $XiboPath"
Write-Host "2. Lancez : docker-compose up -d"
Write-Host "3. Si le conteneur démarre, faites une sauvegarde : docker exec -it xibo-cms-db-1 mysqldump -u cms -p cms > backup.sql"
