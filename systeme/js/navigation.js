import * as Affichage from './affichage.js';
import * as Donnees from './donnees.js';
import * as Resultats from './resultats.js'

export let currentQuestionIndex = 0;

// Fonction utilitaire pour afficher/masquer les boutons de navigation
function toggleButtons(nextVisible, finishVisible) {
    document.getElementById('nextBtn').style.display = nextVisible ? 'block' : 'none';
    document.getElementById('finishBtn').style.display = finishVisible ? 'block' : 'none';
    document.getElementById('finishBtn').disabled = !finishVisible;
}

// Fonction locale d'enregistrement des réponses
function enregistrerReponse() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        alert("Veuillez sélectionner une réponse avant de continuer.");
        return false;
    }

    const currentQuestionId = Donnees.quizData[currentQuestionIndex].id;
    Resultats.saveAnswer(currentQuestionId, selectedOption.value);
    return true;
}

// Fonction pour passer à la question suivante
export function nextQuestion() {
    if (!enregistrerReponse()) return;

    currentQuestionIndex++;

    if (currentQuestionIndex < Donnees.totalQuestions) {
        Affichage.renderQuestion();
        Affichage.updateProgressBar();
        Affichage.updateQuestionCounter();

        // Si on affiche la dernière question, on garde “Suivant” jusqu’au clic
        toggleButtons(true, false);
    } else {
        // Le clic sur “Suivant” depuis la dernière question → on passe à “Terminer”
        toggleButtons(false, true);
    }
}

// Fonction pour revenir à la question précédente
export function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        Affichage.renderQuestion();
        Affichage.updateProgressBar();
        Affichage.updateQuestionCounter();

        // Si on revient en arrière depuis la dernière question, on remet les bons boutons
        toggleButtons(true, false);
    }
}

// Fonction pour terminer le quiz
export function terminerQuiz() {
    if (!enregistrerReponse()) return;

    console.log("✅ Dernière réponse enregistrée :", Donnees.quizData[currentQuestionIndex].id);
    console.log("📦 Réponses finales :", Donnees.userAnswers);

    Resultats.displayResults();
}
