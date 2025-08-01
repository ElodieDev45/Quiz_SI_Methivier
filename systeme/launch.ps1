Write-Host "\n--- Lancement de l'environnement virtuel ---"
& "$PSScriptRoot\.venv\Scripts\Activate.ps1"
Write-Host "✅ Environnement actif : $(Get-Command python).Source"

Write-Host "`n--- Surveillance du SASS ---"
node "$PSScriptRoot\systeme\css\sass-watcher.js"
Write-Host "👀 surveillance sass-watcher.js lancée et opérationnelle"

Write-Host "`n--- Lancement du script Python ---"
python "$PSScriptRoot\Python\auto_convert.py"
Write-Host "👀 surveillance fichier excel lancée et opérationnelle"
