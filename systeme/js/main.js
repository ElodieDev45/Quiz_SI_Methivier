// main.js
import * as Donnees from './donnees.js';
import * as Affichage from './affichage.js';
import * as Navigation from './navigation.js';
import * as Resultats from './resultats.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Masquer la section quiz au chargement initial
  const quizContent = document.querySelector(".quiz-content");
  if (quizContent) quizContent.style.display = "none";

  // Initialisation du formulaire d'identité
  Navigation.gererFormulaireIdentite();

  // Chargement des questions avec capture si erreurs
  try{
    // Import des questions (après attente chargement)
    await Donnees.loadQuestions();

    // Affiche la première question dès le chargement
    Affichage.renderQuestion(); 

    // Met à jour les compteurs et la barre de progression
    Affichage.updateProgressBar();
    Affichage.updateQuestionCounter();
    Affichage.updateNavigationButtons();

  } catch (error) {
    console.error("Erreur lors du chargement des questions :", error);

    // affichage d'un block d'erreur visuel
    const quizContent = document.querySelector(".quiz-content");
    if (quizContent) {
      quizContent.style.display = "block";
      quizContent.innerHTML = `
        <div class="error-message">
          <h2>❌ Oups !</h2>
          <p>Une erreur est survenue lors du chargement du quiz.</p>
          <p>Vérifie ta connexion ou réessaie plus tard.</p>
        </div>
      `;
    }
  }
  
  // Navigation des questions
  const next = document.getElementById("nextBtn");
  if (next) next.addEventListener("click", Navigation.nextQuestion);

  const prev = document.getElementById("prevBtn");
  if (prev) prev.addEventListener("click", Navigation.previousQuestion);

  // Fin et redémarrage du quiz
  const finish = document.getElementById("resultBtn");
  if (finish) finish.addEventListener("click", Resultats.displayResults);

  const restart = document.getElementById("restartBtn");
  if (restart) restart.addEventListener("click", Resultats.restartQuiz);
});
