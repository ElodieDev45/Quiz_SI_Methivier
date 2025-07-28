# 🧠 Projet : Questionnaire Informatique

![Made with Python](https://img.shields.io/badge/Made%20with-Python-3776AB?style=flat&logo=python&logoColor=white)
![Excel Powered](https://img.shields.io/badge/Data%20Source-Excel-217346?style=flat&logo=microsoft-excel&logoColor=white)
![Auto-Updating JSON](https://img.shields.io/badge/JSON%20Output-Auto--Updating-4B8BBE?style=flat&logo=json&logoColor=white)
![SCSS to CSS](https://img.shields.io/badge/Style-SCSS→CSS-DD1B16?style=flat&logo=sass&logoColor=white)


Ce projet propose un système complet pour **créer, modifier et suivre dynamiquement un questionnaire** depuis un fichier Excel. Il surveille en temps réel les changements dans le tableur et génère automatiquement un fichier JSON contenant toutes les informations du quiz (titres, questions, réponses).

---

*🔹 Pour répondre simplement au questionnaire :*  
*Lancez le fichier `START.bat`*  
*→ Le quiz s’ouvrira directement dans votre navigateur*

*🔹 Pour modifier le projet ou utiliser les scripts Python :*  
*Ouvrez un terminal dans le dossier `systeme` et lancez `.\launch.ps1`*  
*→ Cela activera l’environnement virtuel `.venv`, nécessaire à vos modifications*

---



## 📑 Sommaire

- [Objectifs](#objectifs)
- [Technologies utilisées](#technologies-utilisees)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Compilation des styles (SCSS)](#compilation-des-styles-scss)
- [Utilisation](#utilisation)
- [Notes complémentaires](#notes-complementaires)
- [Structure/Formats des fichiers de données](#structureformats-des-fichiers-de-donnees)


---

<a name="objectifs"></a>
## 🔍 Objectifs

- ✏️ **Concevoir un questionnaire sur Excel** (modifiable à volonté)
- 🔄 **Surveiller automatiquement** les modifications du fichier
- 💾 **Générer et mettre à jour un fichier JSON** structuré contenant :
  - le titre du questionnaire
  - les questions
  - les réponses proposées
  - les réponses correctes

---

<a name="technologies-utilisees"></a>
## 🛠️ Technologies utilisées

### 🐍 Python (.venv)

#### Utilisé pour :
- Lire le fichier Excel (`openpyxl`, `pandas`)
- Surveiller les modifications (`watchdog`)
- Convertir en JSON structuré

#### Modules requis (`requirements.txt`) :
- `et_xmlfile`==2.0.0
- `Markdown`==3.8.2
- `numpy`==2.3.2
- `openpyxl`==3.1.5
- `pandas`==2.3.1
- `python-dateutil`==2.9.0.post0
- `pytz`==2025.2
- `six`==1.17.0
- `tzdata`==2025.2
- `watchdog`==6.0.0

### 🌐 Node.js

#### Utilisé pour :
- Compiler les styles du projet en CSS

#### Packages utilisés (`package.json`) :
- `sass@1.89.2` → SCSS → CSS
- `g@2.0.1` → Outils CLI

---

<a name="structure-du-projet"></a>
## 📁 Structure du projet

```text

"nom du dossier"/
├── README.md                           # Documentation principale
├── README.html                         # Version HTML du README
├── START.bat                           # Script de lancement du quiz
└── systeme/                            # Dossier contenant tous les composants du projet
    ├── package.json                    # Dépendances et configuration Node.js
    ├── package-lock.json               # Verrouillage des versions de modules
    ├── questions.json                  # Fichier JSON contenant les questions du quiz
    ├── quiz_informatique_complete.py   # Script principal du quiz (version complète)
    ├── script_lancement.py             # Script Python de lancement personnalisé
    ├── server.py                       # Serveur web (Flask)
    ├── Tableau-Questions.xlsx          # Tableur Excel contenant toutes les questions
    ├── .venv/                          # Environnement virtuel Python
    ├── css/
    │   ├── sass/                       # Fichiers source SASS
    │   ├── style.css                   # Feuille de style CSS compilée
    │   └── style.css.map               # Source map pour le CSS
    ├── images/                         # Ressources graphiques utilisées dans le quiz
    ├── js/
    │   └── script.js                   # Logique client pour l'interactivité du quiz
    ├── node_modules/                   # Modules Node.js installés automatiquement
    ├── pack-emoji-surveillance/        # Pack d’emojis pour les scores et effets visuels
    ├── Python/
    │   ├── auto_convert.py             # Script de surveillance du fichier Excel
    │   ├── convertisseur-excel-json.py # Conversion du tableau Excel vers JSON
    │   └── readme-en-html.py           # Générateur automatique du README HTML

```
---

<a name="installation"></a>
## ⚙️ Installation

### 🧨 Démarrage rapide avec ``START.bat``

Le fichier ``START.bat`` est un script Windows permettant de lancer automatiquement tous les éléments nécessaires au fonctionnement du questionnaire.

```console

@echo off
start "" python\auto_convert.py
start "" python\server.py
start "" "http://localhost:5000"

```

- ##### 📌 Il fait trois choses :
    - Lance la surveillance du fichier Excel pour générer le JSON (via ``auto_convert.py``)
    - Démarre le serveur Flask (``server.py``)
    - Ouvre automatiquement l’interface du questionnaire dans le navigateur

- ##### ⚠️ *Assurez-vous que :*
    - *L’environnement Python est bien configuré (voir ci-dessous)*
    - *Les modules requis sont installés*
    - *Le projet est lancé depuis le bon répertoire*



### 🐍 Python

- 🎯 **Le script `launch.ps1`** permet d'activer automatiquement l’environnement virtuel `.venv` et la surveillance du fichier Excel 

    *(Ouvrir un terminal PowerShell dans le dossier `systeme`, puis lancer `.\launch.ps1`)*

    > *Vous n’avez donc pas besoin d’entrer manuellement les commandes d’installation — tout est géré en une seule étape.*

 
- ⚠️ **Si vous configurez le projet pour la première fois**, voici les commandes PowerShell à lancer pour initialiser l’environnement virtuel :

```powershell

python -m venv .venv
& .venv\Scripts\Activate.ps1
pip install -r requirements.txt

```
> Une fois ces étapes réalisées, il suffit de lancer `launch.ps1` pour activer `.venv` et démarrer automatiquement la surveillance du fichier.


### 🌐 Node.js

```node

    npm install

```

---

<a name="compilation-des-styles-scss"></a>
## 🎨 Compilation des styles (SCSS)

```scss

    sass style.scss style.css
    sass --watch style.scss style.css  # Pour compiler automatiquement

```

---

<a name="utilisation"></a>
## 🎯 Utilisation

1- Créer/modifier le questionnaire dans Tableau-Questions.xlsx

2- Lancer le script de surveillance (présent dans le dossier "py"):

```python

    auto_convert.py

```

Le fichier questions.json sera mis à jour automatiquement à chaque modification du fichier Excel.

---

<a name="notes-complementaires"></a>
## ✨ Notes complémentaires

- Le projet permet une adaptation rapide à tout sujet ou thème.
- Aucune dépendance inutile : environnement Python et Node.js propre et à jour.
- L’environnement est audité sans vulnérabilités.

---

<a name="structureformats-des-fichiers-de-donnees"></a>
## ➕ Structure/Formats des fichiers de données

### 🧮 Excel

- Voici les titres des colonnes du tableau "Tableau-Questions.xlsx" :

```text

    "id"    "category"  "question"	"a"	"b"	"c"	"d" "correctAnswer"

```

* Consignes :

    - les données de la colonne "id" doivent être unique et correspondre au format : "q" + n° question (ex : q1)

    - Les colonnes de réponses ("a", "b", "c", ...) sont modulables à volonté (ajout ou suppression). Il suffit de suivre l’ordre alphabétique avec un seul caractère pour chaque titre.
    Ces colonnes deviennent un objet "options" dans le fichier JSON généré.

    - les autres colonnes sont FIXES et OBLIGATOIRES. Leur titres ne doivent PAS être modifiés.


### 🧾 JSON

La structure du JSON (questions.json) créé est la suivante :

```json

    {
        "id": "",
        "category": "",
        "question": "",
        "options": {
            "a": "",
            "b": "",
            "c": "",
            ...
        },
        "correctAnswer": ""
    }

```


### 📊 Exemple Correspondance Excel/JSON :

- #### Excel

```text

| id | category | question                 | a    | b     | c      | correctAnswer |
|----|----------|--------------------------------------|------|-------|--------|---|
| q1 | géo      | Quelle est la capitale de l’Italie ? | Rome | Milan | Naples | a |

```
- #### JSON
```json

    {
    "id": "q1",
    "category": "géo",
    "question": "Quelle est la capitale de l’Italie ?",
    "options": {
        "a": "Rome",
        "b": "Milan",
        "c": "Naples"
    },
    "correctAnswer": "a"
    }

```