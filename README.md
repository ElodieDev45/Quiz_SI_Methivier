# 🧠 Projet : Questionnaire Informatique

![Made with Python](https://img.shields.io/badge/Made%20with-Python-3776AB?style=flat&logo=python&logoColor=white)
![Excel Powered](https://img.shields.io/badge/Data%20Source-Excel-217346?style=flat&logo=microsoft-excel&logoColor=white)
![Auto-Updating JSON](https://img.shields.io/badge/JSON%20Output-Auto--Updating-4B8BBE?style=flat&logo=json&logoColor=white)
![SCSS to CSS](https://img.shields.io/badge/Style-SCSS→CSS-DD1B16?style=flat&logo=sass&logoColor=white)


Ce projet propose un système complet pour **créer, modifier et suivre dynamiquement un questionnaire** depuis un fichier Excel. Il surveille en temps réel les changements dans le tableur et génère automatiquement un fichier JSON contenant toutes les informations du quiz (titres, questions, réponses).

---

*🔹 Pour répondre simplement au questionnaire :*  
*Lancez le fichier `START.bat`*  
***→ Le quiz s’ouvrira directement dans votre navigateur*** *(il s’agit de la page `projet.html`, rendue automatiquement par le serveur Flask (server.py).)*

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
- [Architecture JavaScript Modulaire](#architecture-javascript-modulaire)
- [Utilisation](#utilisation)
- [Notes complémentaires](#notes-complementaires)
- [Structure/Formats des fichiers de données](#structureformats-des-fichiers-de-donnees)


---

<a name="objectifs"></a>
## 🔍 Objectifs

- ✏️ **Concevoir un questionnaire sur Excel** (modifiable à volonté)
- 🔄 **Surveiller automatiquement** les modifications du fichier
- 💾 **Générer et mettre à jour les fichiers JSON** structurés contenant :
  - le titre du questionnaire
  - le descriptif du questionnaire
  - les questions
  - les réponses proposées
  - les réponses correctes permettant l'affichage des résultats sous forme de pourcentage de réussite.

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
- `sass@1.90.0` → SCSS → CSS
- `g@2.0.1` → Outils CLI
- `chokidar@^4.0.3` → Déclencheur de compilation SCSS

---

<a name="structure-du-projet"></a>
## 📁 Structure du projet

```text

"nom du dossier"/
├── README.md                           # Documentation principale
├── README.html                         # Version web du README, consultable hors GitHub
├── START.bat                           # Script de lancement du quiz (windows)

└── systeme/                            # Dossier contenant tous les composants du projet

    # 🚀 Lancement
    ├── launch.ps1                      # Script PowerShell de lancement (Windows)
    ├── script_lancement.py             # Script Python de lancement personnalisé

    # 📦 Dépendances
    ├── requirements.txt                # Dépendances Python nécessaires au projet
    ├── package.json                    # Dépendances et configuration Node.js
    ├── package-lock.json               # Verrouillage des versions de modules

    # 🎨 Interface utilisateur
    ├── projet.html                     # Page HTML affichée dans le navigateur par le serveur Flask

    # ⚙️ Données & Configuration
    ├── config.json                     # Fichier JSON de configuration globale (en-tête)
    ├── questions.json                  # Fichier JSON contenant les questions du quiz
    ├── Tableau-Questions.xlsx          # Tableur Excel contenant toutes les questions et calculs d'en-tête

    # 🔌 Serveur
    ├── server.py                       # Serveur web Flask (gère les requêtes et l'affichage)

    # 🎨 Ressources front-end
    ├── css/                            # Fichiers style CSS compilés avec SASS
    ├── js/                             # Logique modulaire JavaScript pour l’interactivité du Quiz
    ├── images/                         # Ressources graphiques utilisées dans le quiz

    # 🧪 Environnements & modules
    ├── .venv/                          # Environnement virtuel Python (isole les dépendance)
    ├── node_modules/                   # Modules Node.js installés automatiquement

    # 🎭 Personnalisation & effets
    ├── Python/                         # Scripts de génération, conversion et surveillance
                                        (⚠️ pour `readme-en-html.py` version phyton 3.11.4 pour 
                                        pouvoir générer le fichier README.html)

    # 🛠 Utilitaires & scripts annexes
    ├── pack-emoji-surveillance/        # Pack d’emojis pour les scores et effets visuels


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

#### Environnement

Ce projet utilise [NVM pour Windows](https://github.com/coreybutler/nvm-windows) pour gérer les versions de Node.js.

- Version utilisée : `Node.js v22.18.0`
- Gestionnaire : `nvm`
- Assurez-vous que le chemin NVM est bien ajouté à votre variable d’environnement `Path`.

#### Installation des dépendances

```bash

npm install

```
> *Cette commande installe automatiquement les modules définis dans `package.json`.*

---

<a name="compilation-des-styles-scss"></a>
## 🎨 Compilation des styles (SCSS)

```scss

    sass style.scss style.css
    sass --watch style.scss style.css  # Pour compiler automatiquement

```

---

<a name="architecture-javascript-modulaire"></a>
## 🧠 Architecture JavaScript Modulaire

Le fichier principal ***`main.js`*** agit comme point d'entrée principal de l'application. 
Il orchestre :

- *le chargement des données*
- *l'affichage du quiz*
- *la navigation entre les questions*
- *la gestion des résultats.*

Le projet adopte une approche *modulaire* avec une séparation claire des responsabilités dans 4 fichiers js dits ***"modules"***:

- `donnees.js` : chargement et gestion des questions et métadonnées
- `affichage.js` : affichage dynamique des questions, options, progression
- `navigation.js` : gestion du déplacement entre les questions
- `resultats.js` : calcul et affichage des scores et recommandations

Cette structure rend le code plus lisible, maintenable et évolutif.


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
## ➕ Structure et Formats des fichiers de données :

**Deux** fichiers JSON sont **créés et mis à jour**, d'après un tableur Excel, **automatiquement** et **en même temps**, ***sans aucune intervention manuelle***, garantissant une parfaite synchronisation entre la source Excel et l’affichage du quiz.

---
### *➕➕* Relatifs à l'intégration des Titres
---

#### 🌀 Génération automatique : `config.json`

Le projet utilise un mécanisme intelligent pour générer automatiquement le fichier *`config.json`* à chaque mise à jour du fichier Excel *`Tableau-Questions.xlsx`* :

- Suivant l'onglet **`Infos`** dans le classeur excel qui contient un tableau permettant :

    - de récupérer **dynamiquement** le nom du dossier racine via une formule, en remontant d’un ou plusieurs niveaux au choix depuis le dossier `systeme`

    - de saisir **manuellement** un descriptif personnalisé du questionnaire

#### 💡 Utilité de `config.json`:

- Il sert à alimenter le fichier `projet.html`pour :

    - la balise `title` dans le `head` de `projet.html`

    - le contenu de `h1` et `p` dans le bloc `.header`

#### 🧮 Structure EXCEL : `Tableau-Questions.xlsx` onglet `Infos`

- *exemple de contenu*
```text

| n° dossier parents recherché en  remontant le chemin | Titre-principal | Description-projet |
|------------------------------------------------------|-----------------|--------------------|
| 2                                                    | Quiz SI Metiv...| Ce quiz a été...   |

```

#### 🪙 Structure JSON : `config.json`

- *avec exemple du contenu*
```json

{
  "titre-principal": "Quiz SI Metiv...",
  "description-projet": "Ce quiz a été..."
}

```

---
### *➕➕* Relatifs à l'intégration des Questions
---

#### 🌀 Génération automatique : `questions.json`

Comme précédement le projet utilise un mécanisme intelligent pour générer automatiquement le fichier `questions.json` à chaque mise à jour du fichier Excel *`Tableau-Questions.xlsx`* :

- Suivant l'onglet **`Questions`** dans le classeur excel qui contient un tableau permettant :

    - de **structurer** le fichier JSON suivant les différentes *colonnes* du tableau

    - de **saisir manuellement l'intégralité** des données du questionnaire d'après tout thème désiré

    - de **récupérer dynamiquement** l'intégralité des questions contenues dans le tableau

#### 💡 Utilité de `question.json`:

- Il sert à alimenter le fichier `projet.html`pour :

    - la **génération dynamique du contenu principal du quiz**, incluant les questions, les options de réponse et les catégories.

    - l’**affichage de chaque question et ses réponses** dans l’interface interactive du quiz, en fonction de la progression utilisateur.

    - la **logique de navigation et de vérification des réponses**, en associant chaque choix à l’identifiant correct provenant du JSON.

    - **la personnalisation visuelle et thématique** du questionnaire, selon les métadonnées présentes dans chaque entrée (category, id, etc.)

#### 🧮 Structure EXCEL : `Tableau-Questions.xlsx` onglet `Questions`

- colonnes de titres :

```text

    "id"    "category"  "question"	"a"	"b"	"c"	"d" "correctAnswer"

```

> **📌 Consignes** :
> 
>> - les données de la colonne "id" doivent être unique et correspondre au format : "q" + n° question (ex : q1)
>> 
>> - Les colonnes de réponses ("a", "b", "c", ...) sont modulables à volonté (ajout ou suppression). Il suffit de suivre l’ordre alphabétique avec un seul caractère pour chaque titre.
Ces colonnes deviennent un objet `options` dans le fichier JSON généré.
>> - les autres colonnes sont FIXES et OBLIGATOIRES. Leur titres ne doivent PAS être modifiés.

#### 🪙 Structure JSON : `question.json`

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


#### 🔁 Exemple Correspondance Excel/JSON :

- ##### ✅ Excel

```text

| id | category | question                 | a    | b     | c      | correctAnswer |
|----|----------|--------------------------------------|------|-------|--------|---|
| q1 | géo      | Quelle est la capitale de l’Italie ? | Rome | Milan | Naples | a |

```
- ##### ✅ JSON
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
