import pandas as pd
import json
import os

# Dossier du script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Chemins vers le fichier Excel et le nouveau fichier JSON
excel_path = os.path.join(script_dir, "..", "Tableau-Questions.xlsx")
json_path = os.path.join(script_dir, "..", "questions.json")

# Vérification de l'existence du fichier Excel
if not os.path.exists(excel_path):
    print(f"❌ Fichier Excel introuvable : {excel_path}")
    exit()

# Chargement du fichier Excel
df = pd.read_excel(excel_path)

# Colonnes à ignorer
core_columns = ['id', 'category', 'question', 'correctAnswer']
response_columns = [col for col in df.columns if len(col) == 1 and col.isalpha() and col not in core_columns]

# Construction de la structure JSON
json_output = []
for _, row in df.iterrows():
    item = {
        "id": row["id"],
        "category": row["category"],
        "question": row["question"],
        "options": {col: row[col] for col in response_columns if pd.notna(row[col])},
        "correctAnswer": row["correctAnswer"]
    }
    json_output.append(item)

# Écriture du fichier JSON
print(f"➡️ Fichier Excel chargé : {df.shape[0]} lignes, {df.shape[1]} colonnes")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(json_output, f, ensure_ascii=False, indent=2)

# Confirmation
print(f"✅ Fichier JSON exporté : {json_path}")
