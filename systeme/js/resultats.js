import * as Affichage from './affichage.js';
import * as Donnees from './donnees.js';
import * as Navigation from './navigation.js'; // Pour le restart

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
    document.getElementById('finishBtn').style.display = 'none';
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


// Sauvegarde réponse utilisateur
export function saveAnswer(questionId, selectedOption) {
  // 1. Récupère les données d'identité
  const quizData = JSON.parse(localStorage.getItem("quizData")) || {};
  const userInfo = quizData.identite || {
    titre: "",
    prenom: "",
    nom: ""
  };

  // 2. Récupère les réponses existantes
  const previousAnswers = JSON.parse(localStorage.getItem("userAnswers"))?.reponses || [];

  // 3. Trouve la question correspondante
  const question = Donnees.quizData.find(q => q.id === questionId);
  const correctAnswer = question?.correctAnswer || null;

  // 4. Met à jour ou ajoute la réponse
  const existingIndex = previousAnswers.findIndex(item => item.id === questionId);

  // 5. Récupère la catégorie de la catégorie de la question
  const category = question?.category || "Autres";

  const newAnswerObj = {
    id: questionId,
    answer: selectedOption,
    correctAnswer: correctAnswer,
    category: category
  };

  if (existingIndex !== -1) {
    previousAnswers[existingIndex] = newAnswerObj;
  } else {
    previousAnswers.push(newAnswerObj);
  }

  // 6. Crée l’objet global à enregistrer
  const finalAnswers = {
    titre: userInfo.titre,
    prenom: userInfo.prenom,
    nom: userInfo.nom,
    totalQuestions: Donnees.totalQuestions,
    reponses: previousAnswers
  };

  // 7. Enregistre dans le localStorage
  localStorage.setItem("userAnswers", JSON.stringify(finalAnswers));

  // 8. Pour suivre le processus
  console.log(`✅ Réponse enregistrée : ${questionId} → ${selectedOption}`);
  console.log("🎯 Réponse correcte attendue :", correctAnswer);
  console.log("📊 Total de questions :", Donnees.totalQuestions);
  console.log("🗂️ Données complètes enregistrées dans localStorage (userAnswers):", finalAnswers);
}

// Affichage résultats
export async function displayResults() {
  // 1. Récupérer les données du localStorage
  const userData = JSON.parse(localStorage.getItem("userAnswers"));
  if (!userData || !userData.reponses) {
    console.error("❌ Données utilisateur manquantes ou incomplètes.");
    return;
  }

  const { titre, prenom, nom, totalQuestions, reponses } = userData;

  // 2. Calcul du score
  const finalScore = reponses.filter(r => r.answer === r.correctAnswer).length;
  const percentage = (finalScore / totalQuestions) * 100;

  // 3. Déterminer le message et la classe
  let message = "";
  let scoreClass = "";
  if (percentage === 100) {
    message = "Félicitations ! Vous avez un niveau d'expert en informatique.";
    scoreClass = "excellent";
  } else if (percentage >= 75) {
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
  Affichage.afficherResume(finalScore, totalQuestions, scoreClass, message);

  // 5. Afficher les détails
  Affichage.afficherCategoryBreakdown();
  Affichage.afficherRecommendations(scoreClass);

  // 6. Afficher le graphique selon config.json
  try {
    const response = await fetch('./config.json');
    const config = await response.json();
    let typeGraphique = config["graphique-resultats"]?.toLowerCase();

    if (!typeGraphique || !["camembert", "jauge", "diagramme"].includes(typeGraphique)) {
      console.warn("⚠️ Type de graphique non reconnu ou absent dans config.json. Utilisation du type par défaut : 'camembert'.");
      typeGraphique = "camembert";
    }

    const correct = finalScore;
    const incorrect = totalQuestions - correct;

    Affichage.afficherGraphique(typeGraphique, correct, incorrect, totalQuestions);
  } catch (error) {
    console.error("❌ Erreur lors du chargement du graphique :", error);
    Affichage.afficherErreurGraphique("Erreur lors du chargement du graphique.");
  }
}
