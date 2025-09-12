from flask import Flask, request, jsonify, send_from_directory
import os
import json
import dropbox

app = Flask(__name__, static_folder='systeme', static_url_path='')

# 📁 Chemins
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REPONSES_DIR = os.path.join(BASE_DIR, 'reponses')
REPONSES_FILE = os.path.join(REPONSES_DIR, 'reponses.json')

# 🔐 Token Dropbox (remplace par ton vrai token Dropbox)
DROPBOX_TOKEN = os.getenv('DROPBOX_TOKEN')
DROPBOX_PATH = '/reponses.json'

# 🔧 Création du dossier et fichier si nécessaire
os.makedirs(REPONSES_DIR, exist_ok=True)
if not os.path.exists(REPONSES_FILE):
    with open(REPONSES_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, indent=2, ensure_ascii=False)

def upload_to_dropbox(local_path):
    try:
        dbx = dropbox.Dropbox(DROPBOX_TOKEN)
        with open(local_path, 'rb') as f:
            dbx.files_upload(f.read(), DROPBOX_PATH, mode=dropbox.files.WriteMode.overwrite)
        print("✅ Fichier synchronisé avec Dropbox")
    except Exception as e:
        print("⚠️ Erreur Dropbox :", e)

@app.route('/')
def index():
    return send_from_directory(os.path.abspath(os.path.dirname(__file__) + '/../'), 'index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    nom = data.get('nom', '').strip().lower()
    prenom = data.get('prenom', '').strip().lower()

    if not nom or not prenom:
        return jsonify({'status': 'error', 'message': 'Nom et prénom requis'}), 400

    with open(REPONSES_FILE, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)

    # 🔁 Remplacement si déjà existant
    updated = False
    for i, entry in enumerate(existing_data):
        if entry.get('nom', '').strip().lower() == nom and entry.get('prenom', '').strip().lower() == prenom:
            existing_data[i] = data
            updated = True
            break

    if not updated:
        existing_data.append(data)

    with open(REPONSES_FILE, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)

    upload_to_dropbox(REPONSES_FILE)

    return jsonify({
        'status': 'updated' if updated else 'success',
        'message': 'Réponse mise à jour.' if updated else 'Réponse enregistrée avec succès.'
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
