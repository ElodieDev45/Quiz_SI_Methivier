import pandas as pd
import json
import os

# Dossier du script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Chemins vers le fichier Excel et les fichiers JSON
excel_path = os.path.join(script_dir, "..", "Tableau-Questions.xlsx")
json_path = os.path.join(script_dir, "..", "questions.json")
config_path = os.path.join(script_dir, "..", "config.json")

# Vérifie que le fichier Excel existe
if not os.path.exists(excel_path):
    print(f"❌ Fichier Excel introuvable : {excel_path}")
    exit()

# Chargement de la feuille "Questions"
df = pd.read_excel(excel_path, sheet_name="Questions")

# Colonnes principales à garder
core_columns = ['id', 'category', 'question', 'correctAnswer']

# Détection des colonnes de réponse : A, B, C, D...
response_columns = [col for col in df.columns if len(col) == 1 and col.isalpha() and col not in core_columns]

# Construction du JSON avec structure personnalisée
json_output = []
for _, row in df.iterrows():
    options = {
        col.lower(): row[col] for col in response_columns if pd.notna(row[col])
    }

    item = {
        "id": f"q{row['id']}",  # Préfixe "q" comme dans ton exemple
        "category": row["category"],
        "question": row["question"],
        "options": options,
        "correctAnswer": str(row["correctAnswer"]).lower()  # En minuscules
    }

    json_output.append(item)

# Écriture dans le fichier questions.json
print(f"➡️ Feuille 'Questions' chargée : {df.shape[0]} lignes, {df.shape[1]} colonnes")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(json_output, f, ensure_ascii=False, indent=2)

print(f"✅ Fichier questions.json exporté : {json_path}")


# 📝 Génération du fichier config.json depuis l’onglet "Infos"
try:
    df_infos = pd.read_excel(excel_path, sheet_name="Infos")
    df_infos.reset_index(drop=True, inplace=True)  # 👈 On remet l’index à zéro

    print("📊 Colonnes détectées :", df_infos.columns.tolist())
    print("🔢 Index disponibles :", df_infos.index.tolist())

    titre = df_infos.at[0, "Titre-principal"] if "Titre-principal" in df_infos.columns else "Titre par défaut"
    description = df_infos.at[0, "Description-projet"] if "Description-projet" in df_infos.columns else ""

    print("🎯 Titre extrait :", titre)
    print("📝 Description extraite :", description)

    with open(config_path, "w", encoding="utf-8") as f:
        json.dump({
            "titre-principal": titre,
            "description-projet": description
        }, f, ensure_ascii=False, indent=2)

    print(f"✅ Fichier config.json généré : {config_path}")

except Exception as e:
    import traceback
    print("❌ Erreur lors de la génération de config.json :")
    traceback.print_exc()

