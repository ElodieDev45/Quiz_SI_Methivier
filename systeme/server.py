from flask import Flask, request, jsonify, send_from_directory
import os
import json
import dropbox
import requests
from flask_cors import CORS

app = Flask(__name__, static_folder='systeme', static_url_path='')
CORS(app, resources={r"/submit": {"origins": "*"}})

def normalize(s):
    return ''.join(s.split()).lower()

# 📁 Chemins
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REPONSES_DIR = os.path.join(BASE_DIR, 'reponses')
REPONSES_FILE = os.path.join(REPONSES_DIR, 'reponses.json')
DROPBOX_PATH = '/Reponses/reponses.json'

# 🔧 Création du dossier local
os.makedirs(REPONSES_DIR, exist_ok=True)

# 🔐 Fonction pour générer un access_token à partir du refresh_token
def get_dropbox_access_token():
    url = "https://api.dropboxapi.com/oauth2/token"
    data = {
        "grant_type": "refresh_token",
        "refresh_token": os.getenv("DROPBOX_REFRESH_TOKEN"),
        "client_id": os.getenv("DROPBOX_CLIENT_ID"),
        "client_secret": os.getenv("DROPBOX_CLIENT_SECRET")
    }
    response = requests.post(url, data=data)
    token = response.json().get("access_token")
    if not token:
        print("⚠️ Impossible de récupérer le token Dropbox :", response.json())
    return token

# 📥 Restauration depuis Dropbox si fichier absent ou vide
def download_from_dropbox(local_path):
    try:
        dbx = dropbox.Dropbox(get_dropbox_access_token())
        metadata, res = dbx.files_download(DROPBOX_PATH)
        with open(local_path, 'wb') as f:
            f.write(res.content)
        print("📥 Fichier restauré depuis Dropbox")
    except Exception as e:
        print("⚠️ Erreur restauration Dropbox :", e)

if not os.path.exists(REPONSES_FILE) or os.path.getsize(REPONSES_FILE) == 0:
    download_from_dropbox(REPONSES_FILE)

# 🔼 Envoi vers Dropbox
def upload_to_dropbox(local_path):
    try:
        dbx = dropbox.Dropbox(get_dropbox_access_token())
        with open(local_path, 'rb') as f:
            dbx.files_upload(f.read(), DROPBOX_PATH, mode=dropbox.files.WriteMode.overwrite)
        print("✅ Fichier synchronisé avec Dropbox")
    except Exception as e:
        print("⚠️ Erreur Dropbox :", e)

@app.route('/')
def index():
    return send_from_directory(os.path.abspath(os.path.dirname(__file__) + '/../'), 'index.html')

@app.route('/reponses.json')
def get_json():
    return send_from_directory(REPONSES_DIR, 'reponses.json', mimetype='application/json')    

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    nom = normalize(data.get('nom', ''))
    prenom = normalize(data.get('prenom', ''))

    if not nom or not prenom:
        return jsonify({'status': 'error', 'message': 'Nom et prénom requis'}), 400

    with open(REPONSES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
        existing_data = json.loads(content) if content.strip() else []

    # 🔁 Remplacement si déjà existant
    updated = False
    for i, entry in enumerate(existing_data):
        if (normalize(entry.get('nom', '')) == nom and
            normalize(entry.get('prenom', '')) == prenom):
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
