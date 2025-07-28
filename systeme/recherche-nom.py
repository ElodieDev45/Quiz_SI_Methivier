import os

# 📁 Dossier à scanner
dossier = "."  # ← modifie ici si ton dossier a un autre nom

# 🔍 Nom HTML à rechercher
nom_cible = "quiz_informatique_complete.html"

# 📄 Extensions de fichiers à analyser
extensions = (".html", ".js", ".py")

print(f"\n📦 Scan en cours dans : {dossier}\n")

for racine, _, fichiers in os.walk(dossier):
    for fichier in fichiers:
        if fichier.endswith(extensions):
            chemin = os.path.join(racine, fichier)
            try:
                with open(chemin, "r", encoding="utf-8") as f:
                    contenu = f.read()
                if nom_cible in contenu:
                    print(f"✅ Fichier à modifier : {chemin}")
            except Exception as e:
                print(f"⚠️ Problème avec {chemin} : {e}")
