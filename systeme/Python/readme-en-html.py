"""
# 🔄🌐 Script de transformation du fichier README.md en README.html
# Convertit le fichier Markdown (.md) en page HTML consultable via navigateur
# pour une lecture visuelle directe et améliorée du contenu du projet.
#
# ATTENTION !! : LANCER "Run Python File" sous VERSION PYTHON 3.11.4 
# si lancé sous une autre version il ne repèrera pas markdown et la génération ne se fera pas.
"""

import markdown
import os

# 📁 Détection du dossier actuel du script
script_dir = os.path.dirname(os.path.abspath(__file__))

# 📄 Chemin vers le README situé à la racine du projet
readme_path = os.path.join(script_dir, "..", "..", "README.md")

# 💾 Chemin pour générer le fichier HTML à côté du script
output_path = os.path.join(script_dir, "..", "..", "README.html")

# 🗂️ Lire le fichier README.md
with open(readme_path, "r", encoding="utf-8") as input_file:
    text = input_file.read()

# 🔄 Convertir le Markdown en HTML
html_content = markdown.markdown(
    text,
    extensions=["tables", "fenced_code"],
    output_format="html5"
)

# 🎨 Style inspiré du quiz
style = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600&display=swap');

    html {
        background: linear-gradient(135deg, #e0e7ff 0%, #fef6fb 100%);
    }

    body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #ffffff;
        color: #222;
        padding: 50px;
        max-width: 1000px;
        margin: auto;
        line-height: 1.7;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.04);
        border-radius: 12px;
    }

    h1, h2, h3 {
        color: #2868c7;
        margin-top: 40px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 6px;
    }

    ul {
        margin-left: 24px;
    }

    a {
        color: #1a73e8;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    pre, code {
        background-color: #f3f5f9;
        border-radius: 6px;
        padding: 8px 12px;
        font-family: Consolas, monospace;
        font-size: 0.95em;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        margin: 30px 0;
    }

    th, td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
        font-size: 0.95em;
        background-color: #fafafa;
    }

    hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 40px 0;
    }

    img {
        vertical-align: middle;
        margin-right: 6px;
    }
</style>
"""

# 🏷️ Récupérer le nom du projet
project_name = os.path.basename(os.path.join(script_dir, ".."))

# 🧱 Construire le HTML complet
html_page = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>README – {project_name}</title>
    {style}
</head>
<body>
{html_content}
</body>
</html>
"""

# 💾 Écrire le fichier HTML
with open(output_path, "w", encoding="utf-8") as output_file:
    output_file.write(html_page)

print(f"✅ Conversion réussie : {output_path}")
