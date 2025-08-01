@echo off
cls
echo ===============================
echo        START DU QUIZ
echo ===============================
echo.

echo  1. Lancer le quiz
echo  2. Lire le README
echo  3. Quitter
echo.
set /p choix="Ton choix (1-3) : "

REM 📁 Se positionner dans le dossier 'systeme'
cd /d "%~dp0systeme"

if "%choix%"=="1" (
    echo.
    echo 🚀 Activation de l'environnement virtuel...
    call .venv\Scripts\activate.bat

    echo 🎨 Lancement de la compilation Sass...
    start "" cmd /c "sass --watch css/sass:css"

    echo 🔁 Surveillance du fichier Excel...
    start "" cmd /c "cd /d %cd% && .venv\Scripts\python.exe Python/auto_convert.py"

    echo 🌐 Démarrage du serveur local...
    start "" cmd /c "cd /d %cd% && .venv\Scripts\python.exe server.py"

    echo 💡 Tous les services sont lancés dans des fenêtres indépendantes.
    pause
)

if "%choix%"=="2" (
    echo 📖 Ouverture du fichier README...
    start "" "%~dp0README.html"
)

if "%choix%"=="3" (
    echo 👋 À bientôt !
    exit
)
