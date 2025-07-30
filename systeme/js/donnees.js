import * as Affichage from './affichage.js';
import * as Resultats from './resultats.js';

export let quizData = [];
export let totalQuestions = 0;
export let categoryScores = {};
export let userAnswers = {};

// Fonction pour charger les questions depuis questions.json
export async function loadQuestions() {
    try {
        const response = await fetch('./questions.json'); // Assure-toi que le fichier est bien à la racine du projet
        console.log("📥 Réponse brute fetch :", response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.clone().json(); // Cloner pour pouvoir l'afficher
        console.log("📄 Données JSON brutes :", rawData);

        // Si ce n’est pas un tableau, on tente une conversion avec Object.values()
        if (!Array.isArray(rawData)) {
            console.warn("⚠️ Les données JSON ne sont pas un tableau. Conversion forcée en tableau avec Object.values.");
            quizData = Object.values(rawData);
        } else {
            quizData = rawData;
        }

        totalQuestions = quizData.length;
        console.log("✅ Nombre de questions chargées :", totalQuestions);
        console.log("🔍 Exemple de première question :", quizData[0]);

        // Initialisation des scores par catégorie
        quizData.forEach(q => {
            if (!categoryScores[q.category]) {
                categoryScores[q.category] = { correct: 0, total: 0 };
            }
        });

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

// Fonction pour logguer un résumé des réponses utilisateur dans la console
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

// Chargement automatique du fichier config.json
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
