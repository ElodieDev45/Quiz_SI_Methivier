Write-Host "`n--- Lancement de l'environnement virtuel ---"
& "$PSScriptRoot\.venv\Scripts\Activate.ps1"
Write-Host "`n--- Environnement actif : $(Get-Command python).Source ---"

Write-Host "`n--- Lancement du script Python en parallèle ---"
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "`"$PSScriptRoot\Python\auto_convert.py`""
Write-Host "`n--- Surveillance Excel lancee en tache de fond ---"

Write-Host "`n--- Surveillance des modifications SASS ---"
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "sass", "--watch", "`"$PSScriptRoot\css\sass:$PSScriptRoot\css`""
Write-Host "`n--- Le SASS est desormais surveille en tache de fond ---"
