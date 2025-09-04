import os
import subprocess
import sys
import webbrowser
import time
import shutil

npx_path = shutil.which("npx")
if not npx_path:
    print("❌ Impossible de localiser npx. Vérifie ton PATH ou l'installation de Node.js.")
    sys.exit(1)


# Répertoires et chemins
base_dir = os.path.abspath(os.path.dirname(__file__))
venv_dir = os.path.join(base_dir, ".venv")
python_exec = os.path.join(venv_dir, "Scripts", "python.exe")
requirements = os.path.join(base_dir, ".venv", "requirements.txt")
scss_input = os.path.join(base_dir, "css", "sass", "style.scss")
scss_output = os.path.join(base_dir, "css", "style.css")
html_path = os.path.join(base_dir, "..", "index.html")
convert_script = os.path.join(base_dir, "Python", "auto_convert.py")

# 1. Créer l'environnement virtuel si nécessaire
if not os.path.exists(python_exec):
    print("⚙️ Environnement virtuel introuvable → création...")
    subprocess.run([sys.executable, "-m", "venv", ".venv"])
else:
    print("✅ Environnement virtuel détecté")

# 2. Installer les dépendances Python
print("📦 Installation des modules Python requis...")
subprocess.run([python_exec, "-m", "pip", "install", "-r", requirements])

# 3. Vérifier/installer SASS via npm
print("🎨 Vérification de Sass...")
try:
    subprocess.run([npx_path, "sass", "--version"], check=True, stdout=subprocess.DEVNULL)
    print("🟢 Sass est déjà installé")
except (subprocess.CalledProcessError, FileNotFoundError):
    print("🔧 Sass non trouvé → installation via npm...")
    subprocess.run(["npm", "install", "sass"])

# 4. Compilation du SCSS en CSS
try:
    print("🪄 Compilation SCSS → CSS...")
    subprocess.run([npx_path, "sass", scss_input, scss_output], check=True)
except subprocess.CalledProcessError:
    print("❌ Erreur lors de la compilation Sass. Vérifie ton fichier SCSS.")

# 5. Lancer le script de surveillance du fichier Excel
print("🚀 Lancement de la surveillance Excel...")
subprocess.Popen([python_exec, convert_script])

# 6. Ouvrir la page HTML dans le navigateur
print("🌐 Ouverture du quiz dans le navigateur...")
time.sleep(1)
webbrowser.open(f"file://{html_path}")

print("🎉 Tout est en place ! Le projet est lancé 🚀")
