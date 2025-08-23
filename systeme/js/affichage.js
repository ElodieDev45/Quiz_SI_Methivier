import * as Navigation from './navigation.js';
import * as Donnees from './donnees.js';
import * as Resultats from './resultats.js';
import * as Graphiques from './graphiques.js';
import * as LocalStorage from './localStorage.js';

// Fonction pour afficher les informations d'identité de l'utilisateur
export function renderUserIdentity(identityData) {
    const identityContainer = document.getElementById('userIdentityContainer');
    if (!identityContainer || !identityData) return;

    identityContainer.innerHTML = ''; // Vider l'ancien contenu

    // Création du bloc identité
    const identityBlock = document.createElement('div');
    identityBlock.classList.add('identity-block');

    // 👤 Construction de la ligne d'identité complète
    const fullName = `${identityData.titre || ''} ${identityData.prenom || ''} ${identityData.nom || ''}`.trim();
    const nameElement = document.createElement('p');
    nameElement.textContent = `${fullName}`;
    identityBlock.appendChild(nameElement);

    identityContainer.appendChild(identityBlock);
}

// Fonction pour afficher une question
export function renderQuestion() {
    const questionContainer = document.getElementById('questionsContainer');
    questionContainer.innerHTML = ''; // Nettoyer le contenu précédent

    if (Navigation.currentQuestionIndex < Donnees.totalQuestions) {
        //recupère les données de la queston en cours
        const questionData = Donnees.quizData[Navigation.currentQuestionIndex];

        //création du DOM
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', 'active');

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `${Navigation.currentQuestionIndex + 1}. ${questionData.question}`;
        questionDiv.appendChild(questionTitle);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        // Itére sur les options (choix de reponses) de la question pour créer le DOM HTML
        for (const key in questionData.options) {
            const optionValue = questionData.options[key];
            const optionLabel = document.createElement('label');
            optionLabel.classList.add('option');

            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = "option";
            optionInput.value = key;
            optionInput.id = `option-${questionData.id}-${key}`;
            optionLabel.appendChild(optionInput);

            const optionText = document.createElement('span');
            optionText.textContent = optionValue;
            optionLabel.appendChild(optionText);

            // Gérer la sélection de l'option
            optionInput.addEventListener('change', () => {
                const allOptions = optionsDiv.querySelectorAll('.option');
                allOptions.forEach(opt => opt.classList.remove('selected'));
                optionLabel.classList.add('selected');
                Donnees.userAnswers[questionData.id] = optionInput.value; // Stocker la réponse de l'utilisateur
                updateNavigationButtons(); // Mettre à jour les boutons après sélection
            });

            optionsDiv.appendChild(optionLabel);
        }

        questionDiv.appendChild(optionsDiv);
        questionContainer.appendChild(questionDiv);

        // Pré-sélectionner la réponse de l'utilisateur si elle existe
        if (Donnees.userAnswers[questionData.id]) {
            const selectedOptionInput = document.getElementById(`option-${questionData.id}-${Donnees.userAnswers[questionData.id]}`);
            if (selectedOptionInput) {
                selectedOptionInput.checked = true;
                selectedOptionInput.closest('.option').classList.add('selected');
            }
        }

    } else if (Navigation.currentQuestionIndex >= Donnees.totalQuestions) {
        Resultats.displayResults(); // Afficher les résultats si toutes les questions ont été parcourues
    }

    updateNavigationButtons(); // Mettre à jour les boutons en dehors du bloc conditionnel
}

// Fonction pour mettre à jour les boutons de navigation (Précédent/Suivant/Terminer)
export function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const resultBtn = document.getElementById('resultBtn');

    prevBtn.disabled = Navigation.currentQuestionIndex === 0;

    const currentQuestion = Donnees.quizData[Navigation.currentQuestionIndex];
    const answered = Donnees.userAnswers[currentQuestion?.id];

    // ✅ On ne s’occupe PAS de l’index ici : les boutons sont gérés depuis navigation.js
    nextBtn.style.display = 'block';
    resultBtn.style.display = 'none';

    nextBtn.disabled = !answered;
    resultBtn.disabled = !answered;
}

// Fonction pour mettre à jour la barre de progression
export function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progress = (Navigation.currentQuestionIndex + 1) / Donnees.totalQuestions * 100;
    progressFill.style.width = `${progress}%`;
}

// Fonction pour mettre à jour le compteur de questions
export function updateQuestionCounter() {
    document.getElementById('currentQuestionNumber').textContent = Navigation.currentQuestionIndex + 1;
}

// Affichage section résultats + style selon score
export function afficherSectionResultats(scoreClass) {
  document.querySelector(".quiz-content").style.display = "none";
  const resultsSection = document.getElementById("results");
  resultsSection.classList.add("active");
}

// Mise à jour du titre des résultats
export function afficherTitreResultat(scoreClass) {
  const titreElement = document.getElementById("titreResultat");
  titreElement.textContent = "Vos résultats";
  titreElement.className = scoreClass;
}

// Affichage du nom complet utilisateur sous résultats
export function afficherIdentite(titre, prenom, nom) {
  const titreElement = document.getElementById("titreResultat");
  const resultsSection = document.getElementById("results");
  

  const identityBlock = document.createElement("div");
  identityBlock.classList.add("result-identity");
  identityBlock.innerHTML = `<p>🧑 Participant : ${titre} ${prenom} ${nom}</p>`;
  resultsSection.insertBefore(identityBlock, titreElement);
}

// Résumé score et affichage message personnalisé
export function afficherResume(score, totalQuestions, scoreClass, message, correctAnswerPercent, typeGraphique) {
  const resumeElement = document.getElementById("resumeTexte");
  
  // Déclaration de la variable qui contiendra le HTML du score + typeGraphique
  let scoreHTML = "";

  // Choix du contenu selon le type de graphique
  if (typeGraphique === "camembert") {
    scoreHTML = `<p class="score ${scoreClass}">Score : ${score}/${totalQuestions}</p>`;
  } else if (typeGraphique === "jauge") {
    scoreHTML = `<p class="score ${scoreClass}">Réussite : ${correctAnswerPercent}%</p>`;
  } else if (typeGraphique === "diagramme") {
    scoreHTML = `<p class="score ${scoreClass}">Répartition : ${score} bonnes réponses</p>`;
  } else {
    scoreHTML = `<p> Score : inexistant </p>`;
  }

  // DOM
  resumeElement.innerHTML = `
    ${scoreHTML}
    <p class="message">${message}</p>
  `;
}

// Performances par catégorie de questions
export function afficherCategoryBreakdown() {
  // À compléter selon ta logique métier
  console.log("📊 Affichage des catégories détaillées...");
}

// Conseils en fonction du niveau de score
export function afficherRecommendations(scoreClass) {
  // À compléter selon ta logique métier
  console.log("📌 Recommandations pour :", scoreClass);
}

// Génèration du graphique selon le type choisi
const typesGraphiques = {
  camembert: (correct, incorrect, total, correctAnswerPercent, container) =>
    Graphiques.afficherCamembertReponses(correct, incorrect, total, container),
  diagramme: (correct, incorrect, total, correctAnswerPercent, container) => {
    const repartition = LocalStorage.resultAnswersCounts();
    Graphiques.afficherDiagrammeReponses(repartition, container);
  },
  jauge: (correct, incorrect, total, correctAnswerPercent, container) =>
    Graphiques.afficherJaugeReponses(correctAnswerPercent, container)
};

// Affichage graphique
export function afficherGraphique(type, correct, incorrect, total, correctAnswerPercent, repartition, containerId = "conteneurGraphique") {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const render = typesGraphiques[type];
  if (render) {
    render(correct, incorrect, total, correctAnswerPercent, container);
  } else {
    console.warn("Type de graphique non reconnu :", type);
    container.textContent = "Type de graphique non reconnu.";
  }
}

// Message d’erreur si graphique impossible à charger
export function afficherErreurGraphique(message) {
  const container = document.getElementById("conteneurGraphique");
  container.textContent = message;
}
