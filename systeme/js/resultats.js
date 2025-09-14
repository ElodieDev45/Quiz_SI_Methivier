// resultats.js – gère l'affichage des résultats, leur envoi au serveur et le redémarrage du quiz

// iport des modules
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
    // 1. Détruire le graphique Chart.js s'il existe
    const chart = Chart.getChart('resultChart');
    if (chart) {
        chart.destroy();
    }

    // 2. Vider le localStorage des données du quiz
    const keysToRemove = ['userAnswers', 'quizData'];
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // 3. Réinitialiser l'état de l'application
    Navigation.setCurrentQuestionIndex(0);
    Donnees.setUserAnswers({});
    score = 0;

    // Réinitialiser les scores par catégorie
    for (const category in Donnees.categoryScores) {
        if (Donnees.categoryScores.hasOwnProperty(category)) {
            Donnees.categoryScores[category].correct = 0;
            Donnees.categoryScores[category].total = 0;
        }
    }

    // 4. AFFICHER le formulaire d'identité et CACHER les autres sections
    const identiteSection = document.getElementById('identiteSection');
    if (identiteSection) {
        identiteSection.style.display = 'block';
    }
    
    const quizContent = document.querySelector('.quiz-content');
    if (quizContent) {
        quizContent.style.display = 'none';
    }
    
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.classList.remove('active');
    }

    // 5. Réinitialiser le formulaire d'identité
    const identiteForm = document.getElementById('identiteForm');
    if (identiteForm) {
        identiteForm.reset();
    }

    // 6. Nettoyer les affichages - AJOUT DES ÉLÉMENTS result-identity
    const elementsToClear = [
        'userIdentityContainer',
        'categoryBreakdown', 
        'recommendations',
        'conteneurGraphique',
        'resumeTexte'
    ];

    elementsToClear.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });

    // 7. SUPPRIMER TOUS LES ÉLÉMENTS result-identity
    const resultIdentityElements = document.querySelectorAll('.result-identity');
    resultIdentityElements.forEach(element => {
        element.remove();
    });

    const titreResultat = document.getElementById('titreResultat');
    if (titreResultat) {
        titreResultat.textContent = '';
        titreResultat.className = '';
    }

   // 8. RÉINITIALISATION DE LA NAVIGATION
    const nextBtn = document.getElementById('nextBtn');
    const resultBtn = document.getElementById('resultBtn');
    
    if (nextBtn) {
        nextBtn.style.display = 'block'; // Toujours afficher Suivant au redémarrage
        nextBtn.disabled = true; // Désactiver jusqu'à sélection
    }
    
    if (resultBtn) {
        resultBtn.style.display = 'none'; // Cacher Résultats au redémarrage
        resultBtn.disabled = true;
    }
    
    // 9. FORCER LA MISE À JOUR DE LA NAVIGATION
    Affichage.updateNavigationButtons();
    
    console.log("✅ Quiz réinitialisé - Retour au formulaire d'identité");
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
    const response = await fetch('./systeme/config.json');
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

    // 7. Préparer les données à envoyer
    const resultat = {
        titre,
        prenom,
        nom,
        totalQuestions,
        finalScore,
        correctAnswerPercent,
        reponses,
        horodatage: new Date().toLocaleString("sv-SE", { timeZone: "Europe/Paris" })
    };

    // 8. Envoi vers le serveur Flask (autorisé à chaque affichage)
    console.log("Données envoyées :", resultat);
    fetch("https://quiz-si-methivier-back-end.onrender.com/submit", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultat)
    })
    .then(reponses => reponses.json())
    .then(data => {
        if (data.status === 'updated') {
        alert("Vos réponses ont été mises à jour.");
        } else if (data.status === 'success') {
        alert("Vos réponses ont été enregistrées.");
        } else {
        alert("Erreur : " + data.message);
        }
    })
    .catch(error => {
        console.error('❌ Erreur réseau :', error);
    });
}
