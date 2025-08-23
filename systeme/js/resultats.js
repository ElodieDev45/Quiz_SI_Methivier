import * as Affichage from './affichage.js';
import * as Donnees from './donnees.js';
import * as Navigation from './navigation.js'; // Pour le restart
import * as LocalStorage from './localStorage.js';

export let score = 0; // Score global du quiz


// Détail par catégorie
export function displayCategoryBreakdown() {
    const categoryBreakdownDiv = document.getElementById('categoryBreakdown');
    categoryBreakdownDiv.innerHTML = '<h3>Répartition par catégorie</h3>';

    for (const category in Donnees.categoryScores) {
        const data = Donnees.categoryScores[category];
        const percentage = data.total > 0 ? (data.correct / data.total * 100).toFixed(0) : 0;

        const card = document.createElement('div');
        card.classList.add('category-card');
        card.innerHTML = `
            <h5>${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
            <div class="category-score">${data.correct}/${data.total}</div>
            <p>${percentage}% de bonnes réponses</p>
        `;
        categoryBreakdownDiv.appendChild(card);
    }
}


// Suggestions personnalisées
export function displayRecommendations(scoreClass) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<h4>Recommandations personnalisées</h4>';
    const ul = document.createElement('ul');

    if (scoreClass === 'poor') {
        ul.innerHTML = `
            <li>Revoyez les bases de Windows, les raccourcis clavier et la gestion des fichiers.</li>
            <li>Familiarisez-vous avec les concepts de stockage local vs. serveur.</li>
        `;
    } else if (scoreClass === 'good') {
        ul.innerHTML = `<li>Continuez à explorer des sujets plus avancés et à pratiquer les fonctionnalités moins courantes.</li>`;
    } else if (scoreClass === 'excellent') {
        ul.innerHTML = `<li>Excellent travail dans toutes les catégories ! Continuez à apprendre et à vous tenir informé.</li>`;
    }

    recommendationsDiv.appendChild(ul);
}


// Redémarrage complet du quiz
export function restartQuiz() {
    Navigation.currentQuestionIndex = 0;
    Donnees.userAnswers = {};
    score = 0;

    document.getElementById('results').classList.remove('active');

    // Supprimer précédent graphique si existant
    const oldCanvas = document.getElementById('resultChart');
    if (oldCanvas) oldCanvas.remove();

    document.querySelector('.quiz-content').style.display = 'block';

    Affichage.renderQuestion();
    Affichage.updateProgressBar();
    Affichage.updateQuestionCounter();
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('resultBtn').style.display = 'none';
    Affichage.updateNavigationButtons();

    document.getElementById('finalScore').classList.remove('excellent', 'good', 'poor');
    document.getElementById('scoreMessage').textContent = '';
    document.getElementById('categoryBreakdown').innerHTML = '';
    document.getElementById('recommendations').innerHTML = '';
    document.getElementById('userIdentityContainer').innerHTML = '';

    for (const category in Donnees.categoryScores) {
        Donnees.categoryScores[category].correct = 0;
        Donnees.categoryScores[category].total = 0;
    }

    // ✅ Optionnel : réafficher le formulaire d'identité
    document.getElementById('identiteSection').style.display = 'block';
}


// Affichage résultats
export async function displayResults() {
  // 1. Récupérer les données du localStorage
  const userData = LocalStorage.getUserAnswers();
  if (!userData) return;

  const { titre, prenom, nom, totalQuestions, reponses } = userData;

  // 2. Calcul du score
  const finalScore = reponses.filter(r => r.answer === r.correctAnswer).length;
  const correctAnswerPercent = Math.round((finalScore / totalQuestions) * 100);

  // 3. Déterminer le message et la classe
  let message = "";
  let scoreClass = "";
  if (correctAnswerPercent === 100) {
    message = "Félicitations ! Vous avez un niveau d'expert en informatique.";
    scoreClass = "excellent";
  } else if (correctAnswerPercent >= 75) {
    message = "Très bien ! Vous avez de solides connaissances en informatique.";
    scoreClass = "good";
  } else {
    message = "Bonne tentative ! Vous avez besoin de réviser certains concepts.";
    scoreClass = "poor";
  }

  // 4. Appel des fonctions d'affichage 
  Affichage.afficherSectionResultats(scoreClass);
  Affichage.afficherTitreResultat(scoreClass);
  Affichage.afficherIdentite(titre, prenom, nom);

  // 5. Afficher les détails
  Affichage.afficherCategoryBreakdown();
  Affichage.afficherRecommendations(scoreClass);

  // 6. Afficher le graphique selon config.json
  let typeGraphique = "camembert"; // valeur par défaut

  try {
    const response = await fetch('./config.json');
    const config = await response.json();
    const type = config["graphique-resultats"]?.toLowerCase();

    if (["camembert", "jauge", "diagramme"].includes(type)) {
      typeGraphique = type; // ✅ on remplace la valeur par défaut
    } else {
      console.warn("⚠️ Type de graphique non reconnu ou absent dans config.json. Utilisation du type par défaut : 'camembert'.");
    }

    const correct = finalScore;
    const incorrect = totalQuestions - correct;
    const repartition = LocalStorage.resultAnswersCounts(reponses);

    Affichage.afficherGraphique(typeGraphique, correct, incorrect, totalQuestions, correctAnswerPercent, repartition);
    Affichage.afficherResume(finalScore, totalQuestions, scoreClass, message, correctAnswerPercent, typeGraphique);
  } catch (error) {
    console.error("❌ Erreur lors du chargement du graphique :", error);
    Affichage.afficherErreurGraphique("Erreur lors du chargement du graphique.");
  }
}
