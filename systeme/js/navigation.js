import * as Affichage from './affichage.js';
import * as Donnees from './donnees.js';

export let currentQuestionIndex = 0;

// Fonction pour passer à la question suivante
export function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < Donnees.totalQuestions - 1) {
        Affichage.renderQuestion();
        Affichage.updateProgressBar();
        Affichage.updateQuestionCounter();
    }

    if (currentQuestionIndex === Donnees.totalQuestions - 1) {
        // C'est la dernière question, afficher le bouton "Terminer"
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('finishBtn').style.display = 'block';
    }
}

// Fonction pour revenir à la question précédente
export function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        Affichage.renderQuestion();
        Affichage.updateProgressBar();
        Affichage.updateQuestionCounter();
    }
}

