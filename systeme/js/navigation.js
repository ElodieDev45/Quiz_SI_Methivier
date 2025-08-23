import * as Affichage from './affichage.js';
import * as Donnees from './donnees.js';
import * as Resultats from './resultats.js';
import * as LocalStorage from './localStorage.js';

export let currentQuestionIndex = 0;

// 📌 Fonction pour gérer le formulaire d'identité utilisateur
export function gererFormulaireIdentite() {
    const identiteForm = document.getElementById("identiteForm");
    if (!identiteForm) return;

    identiteForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const titre = document.getElementById("titre").value;
        const nom = document.getElementById("nom").value.trim();
        const prenom = document.getElementById("prenom").value.trim();

        Donnees.enregistrerIdentite(titre, nom, prenom); // Enregistrement dans l'objet Donnees

        // Intégrer l'identité dans le localStorage des réponses
        const storedAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
        const identiteObj = {
        type: "identite",
        titre,
        nom,
        prenom,
        timestamp: new Date().toISOString()
        };
        if (!storedAnswers.find(item => item.type === "identite")) {
        storedAnswers.unshift(identiteObj);
        }
        localStorage.setItem("userAnswers", JSON.stringify(storedAnswers));

        Affichage.renderUserIdentity(Donnees.utilisateur.identite); // Affichage identité

        // On passe au quiz après saisie
        document.getElementById("identiteSection").style.display = "none";
        document.querySelector(".quiz-content").style.display = "block";

        // Affichage de la première question
        Affichage.renderQuestion();
        Affichage.updateProgressBar();
        Affichage.updateQuestionCounter();
        Affichage.updateNavigationButtons();
    });
}

// Fonction utilitaire pour afficher/masquer les boutons de navigation
function toggleButtons(nextVisible, finishVisible) {
    document.getElementById('nextBtn').style.display = nextVisible ? 'block' : 'none';
    document.getElementById('resultBtn').style.display = finishVisible ? 'block' : 'none';
    document.getElementById('resultBtn').disabled = !finishVisible;
}

// Fonction locale d'enregistrement des réponses
function enregistrerReponse() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        alert("Veuillez sélectionner une réponse avant de continuer.");
        return false;
    }

    const currentQuestionId = Donnees.quizData[currentQuestionIndex].id;
    LocalStorage.saveAnswer(currentQuestionId, selectedOption.value);
    return true;
}

// Navigation suivante
export function nextQuestion() {
    if (!enregistrerReponse()) return;

    currentQuestionIndex++;

    if (currentQuestionIndex < Donnees.totalQuestions) {
        Affichage.renderQuestion();
        Affichage.updateProgressBar();
        Affichage.updateQuestionCounter();
        toggleButtons(true, false);
    } else {
        toggleButtons(false, true); // Afficher bouton “Terminer”
    }
}

// Navigation précédente
export function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        Affichage.renderQuestion();
        Affichage.updateProgressBar();
        Affichage.updateQuestionCounter();
        toggleButtons(true, false);
    }
}

// Fin du quiz
export function terminerQuiz() {
    if (!enregistrerReponse()) return;

    console.log("✅ Dernière réponse enregistrée :", Donnees.quizData[currentQuestionIndex].id);
    console.log("📦 Réponses finales :", Donnees.userAnswers);

    Resultats.displayResults();
}
