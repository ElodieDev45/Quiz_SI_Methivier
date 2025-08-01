// main.js
import * as Donnees from './donnees.js';
import * as Affichage from './affichage.js';
import * as Navigation from './navigation.js';
import * as Resultats from './resultats.js';

document.addEventListener("DOMContentLoaded", () => {
  // Masquer la section quiz au chargement initial
  document.querySelector(".quiz-content").style.display = "none";

  // Initialisation du formulaire d'identité
  Navigation.gererFormulaireIdentite();

  // Chargement des questions
  Donnees.loadQuestions().then(() => {
    // Affiche la première question dès le chargement
    Affichage.renderQuestion(); 

    // Met à jour les compteurs et la barre de progression
    Affichage.updateProgressBar();
    Affichage.updateQuestionCounter();
    Affichage.updateNavigationButtons();
  });

  // Navigation des questions
  const next = document.getElementById("nextBtn");
  if (next) next.addEventListener("click", Navigation.nextQuestion);

  const prev = document.getElementById("prevBtn");
  if (prev) prev.addEventListener("click", Navigation.previousQuestion);

  // Fin et redémarrage du quiz
  const finish = document.getElementById("finishBtn");
  if (finish) finish.addEventListener("click", Resultats.displayResults);

  const restart = document.getElementById("restartBtn");
  if (restart) restart.addEventListener("click", Resultats.restartQuiz);
});
