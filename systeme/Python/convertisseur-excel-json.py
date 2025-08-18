"""
# 🔄📊 Script de transformation du fichier excel "Tableau-Questions.xlsx"
# Convertit le tableau excel en fichiers question.json et config.json,
# utilisés pour alimenter dynamiquement les données du Quiz.
"""

import pandas as pd
import json
import os
import time
from datetime import datetime
import traceback

# 📁 Dossier du script
script_dir = os.path.dirname(os.path.abspath(__file__))

# 📄 Chemins vers les fichiers
excel_path = os.path.join(script_dir, "..", "Tableau-Questions.xlsx")
json_path = os.path.join(script_dir, "..", "questions.json")
config_path = os.path.join(script_dir, "..", "config.json")

# 📌 Fonction de vérification de mise à jour du fichier Excel
def attendre_modification_fichier(path, delai_sec=5):
    print("⏳ Vérification du fichier Excel...")
    if not os.path.exists(path):
        print(f"❌ Le fichier n’existe pas : {path}")
        return False

    derniere_modif = os.path.getmtime(path)
    print("🕒 Dernière modification détectée :", datetime.fromtimestamp(derniere_modif))

    print(f"⏲️ Attente pendant {delai_sec} secondes pour confirmer l’enregistrement...")
    time.sleep(delai_sec)

    nouvelle_modif = os.path.getmtime(path)
    if nouvelle_modif > derniere_modif:
        print("✅ Le fichier a été modifié durant l’attente.")
    else:
        print("⚠️ Pas de modification détectée pendant l’attente.")
    return True

# 🔍 Vérifie que le fichier existe
if not os.path.exists(excel_path):
    print(f"❌ Fichier Excel introuvable : {excel_path}")
    exit()

# 📥 Traitement de la feuille "Questions"
try:
    df = pd.read_excel(excel_path, sheet_name="Questions")

    core_columns = ['id', 'category', 'question', 'correctAnswer']
    response_columns = [col for col in df.columns if len(col) == 1 and col.isalpha() and col not in core_columns]

    json_output = []
    for _, row in df.iterrows():
        options = {
            col.lower(): row[col] for col in response_columns if pd.notna(row[col])
        }

        item = {
            "id": f"q{row['id']}",
            "category": row["category"],
            "question": row["question"],
            "options": options,
            "correctAnswer": str(row["correctAnswer"]).lower()
        }

        json_output.append(item)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_output, f, ensure_ascii=False, indent=2)

    print(f"➡️ Feuille 'Questions' chargée : {df.shape[0]} lignes, {df.shape[1]} colonnes")
    print(f"✅ Fichier questions.json exporté : {json_path}")

except Exception as e:
    print("❌ Erreur lors du traitement de la feuille Questions :")
    traceback.print_exc()

# 📝 Génération du fichier config.json depuis l’onglet "Infos"
try:
    if attendre_modification_fichier(excel_path):
        df_infos = pd.read_excel(excel_path, sheet_name="Infos")
        df_infos.reset_index(drop=True, inplace=True)

        print("📊 Colonnes détectées :", df_infos.columns.tolist())
        print("🔢 Index disponibles :", df_infos.index.tolist())

        titre = df_infos.at[0, "Titre-principal"] if "Titre-principal" in df_infos.columns else "Titre par défaut"
        description = df_infos.at[0, "Description-projet"] if "Description-projet" in df_infos.columns else ""
        graphique = df_infos.at[0, "Graphique-resultats"] if "Graphique-resultats" in df_infos.columns else ""

        print("🎯 Titre extrait :", titre)
        print("📝 Description extraite :", description)
        print("📊 Graphique extrait :", graphique)

        with open(config_path, "w", encoding="utf-8") as f:
            json.dump({
                "titre-principal": titre,
                "description-projet": description,
                "graphique-resultats": graphique,
            }, f, ensure_ascii=False, indent=2)

        print(f"✅ Fichier config.json généré : {config_path}")
    else:
        print("⛔ Le fichier Excel n’a pas pu être vérifié. Aucun config.json généré.")

except Exception as e:
    print("❌ Erreur lors de la génération de config.json :")
    traceback.print_exc()
