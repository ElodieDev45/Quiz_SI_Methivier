// donnees.js - Charge, structure et exporte les données du questionnaire (questions, utilisateur, réponses)

// Import des fonctions d'affichage pour mettre à jour l'interface utilisateur
import * as Affichage from './affichage.js';

// Structures de données exportées pour le questionnaire
export let totalQuestions = 0;
export let categoryScores = {};
export let userAnswers = {};
export let rawData = {};
export let quizData = [];


// Objet contenant les informations d'identité et score null de l'utilisateur
export const utilisateur = {
  identite: {
    titre: "",
    nom: "",
    prenom: ""
  },
  score: null,
  timestamp: null
};

// Enregistre et sauvegarde dans localStorage des infos d'identité utilisateur.
export function enregistrerIdentite(titre, nom, prenom) {
  utilisateur.identite = { titre, nom, prenom };
  utilisateur.timestamp = new Date().toISOString();
  localStorage.setItem("quizData", JSON.stringify(utilisateur));
}

// Charge les questions depuis fichier JSON, initialise les scores par catégorie et met à jour l'affichage
export async function loadQuestions() {
    try {
        const response = await fetch('./questions.json'); // fichier à laisser dans dossier "systeme"
        console.log("📥 Réponse brute fetch :", response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Clone pour afficher les données et les stock dans "rawData"
        const rawData = await response.clone().json();
        console.log("📄 Données JSON brutes :", rawData);

        // Si ce n’est pas déjà un tableau, on tente une conversion avec Object.values()
        if (!Array.isArray(rawData)) {
            console.warn("⚠️ Les données JSON ne sont pas un tableau. Conversion forcée en tableau avec Object.values.");
            quizData = Object.values(rawData);
        } else {
            quizData = rawData; //creation données dans "quizData"
        }

        // stock la quantité totale de questions dans "totalQuestions"
        totalQuestions = quizData.length;
        console.log("✅ Nombre de questions chargées :", totalQuestions);
        console.log("🔍 Exemple de première question :", quizData[0]);

        // Initialisation des scores par catégorie
        quizData.forEach(q => {
            if (!categoryScores[q.category]) {
                categoryScores[q.category] = { correct: 0, total: 0 };
            }
        });

        // mise à jour du DOM de la page avec le nombre total de questions
        document.getElementById('totalQuestionsCount').textContent = totalQuestions;

        // 🔔 Appels d'affichage post-chargement
        Affichage.renderQuestion();
        Affichage.updateProgressBar();
        Affichage.updateQuestionCounter();
        Affichage.updateNavigationButtons();

    } catch (error) {
        console.error("❌ Erreur lors du chargement des questions :", error);
        document.getElementById('questionsContainer').innerHTML = '<p>Erreur lors du chargement du quiz. Veuillez réessayer plus tard.</p>';
    }
}

// Affiche un résumé formaté des réponses utilisateur dans la console
export function logQuizSummaryToConsole() {
    const summary = [];
    quizData.forEach((question, index) => {
        const questionNumber = index + 1;
        const questionText = question.question;
        const userAnswerKey = userAnswers[question.id];
        const userAnswerText = question.options[userAnswerKey] || "Non répondu";
        const correctAnswerText = question.options[question.correctAnswer];
        const isCorrect = (userAnswerKey === question.correctAnswer) ? "✅ Correct" : "❌ Incorrect";

        summary.push({
            "N° Question": questionNumber,
            "Intitulé Question": questionText,
            "Votre Réponse": userAnswerText,
            "Réponse Correcte": correctAnswerText,
            "Statut": isCorrect
        });
    });

    console.groupCollapsed("📊 Résumé des Réponses du Quiz");
    console.table(summary);
    console.groupEnd();
}

// Personalise le titre et la description du questionnaire via le fichier config.json 
document.addEventListener("DOMContentLoaded", function () {
    fetch("config.json")
        .then(response => response.json())
        .then(data => {
            document.title = data["titre-principal"];

            const titreElement = document.getElementById("titre-principal");
            if (titreElement) {
                titreElement.textContent = data["titre-principal"];
            }

            const descElement = document.getElementById("description-projet");
            if (descElement) {
                descElement.textContent = data["description-projet"];
            }
        })
        .catch(error => {
            console.error("❌ Erreur de chargement du fichier config.json :", error);
        });
});

// Setters
export function setUserAnswers(answers) {
    userAnswers = answers;
}

export function setCategoryScores(scores) {
    categoryScores = scores;
}

// Fonction pour réinitialiser les scores par catégorie
export function resetCategoryScores() {
    for (const category in categoryScores) {
        if (categoryScores.hasOwnProperty(category)) {
            categoryScores[category].correct = 0;
            categoryScores[category].total = 0;
        }
    }
}

// Fonction pour initialiser les scores par catégorie (si nécessaire)
export function initializeCategoryScores(quizData) {
    quizData.forEach(q => {
        if (!categoryScores[q.category]) {
            categoryScores[q.category] = { correct: 0, total: 0 };
        }
    });
}


