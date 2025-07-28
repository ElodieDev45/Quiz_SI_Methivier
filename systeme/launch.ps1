& "$PSScriptRoot\.venv\Scripts\Activate.ps1"
Write-Host "✅ Environnement actif : $(Get-Command python).Source"
python "$PSScriptRoot\Python\auto_convert.py"
