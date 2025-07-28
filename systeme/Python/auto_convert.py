from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import subprocess
import os
import datetime

# 📍 Chemin absolu vers le fichier Excel à surveiller
EXCEL_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Tableau-Questions.xlsx"))

# 🔍 Handler de surveillance
class ExcelChangeHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        print("🔍 Fichier touché :", event.src_path)

        # Si le bon fichier Excel a été modifié / créé / déplacé
        if event.event_type in ['modified', 'created', 'moved']:
            if os.path.abspath(event.src_path) == EXCEL_FILE:
                print("📄 Fichier Excel mis à jour → génération automatique du JSON...")

                # 📂 Chemin absolu vers le script convertisseur
                script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "convertisseur-excel-json.py"))

                # 🐍 Chemin absolu vers le python de l’environnement virtuel
                venv_python = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".venv", "Scripts", "python.exe"))

                # ✅ Vérification avant exécution
                if os.path.isfile(venv_python) and os.path.isfile(script_path):
                    subprocess.run([venv_python, script_path])
                    print("⏰ Mise à jour effectuée à :", datetime.datetime.now().strftime("%H:%M:%S"))
                else:
                    print("🚨 Erreur : fichier introuvable")
                    print("👉 python.exe :", venv_python)
                    print("👉 script     :", script_path)

# 🕵️ Lancement de la surveillance
print("🕵️ Surveillance activée depuis le sous-dossier Python")
print(f"👀 Cible surveillée : {EXCEL_FILE}")

observer = Observer()
observer.schedule(ExcelChangeHandler(), path=os.path.dirname(EXCEL_FILE), recursive=False)
observer.start()

# 🧘 Boucle infinie jusqu'à Ctrl+C
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()
    print("🛑 Surveillance arrêtée")
observer.join()
