import * as Affichage from './affichage.js';
import * as Donnees from './donnees.js';
import * as Navigation from './navigation.js'; // Pour le restart

export let score = 0; // Score global du quiz

// Fonction principale d'affichage des résultats
export function displayResults() {
    document.querySelector('.quiz-content').style.display = 'none';
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.add('active');

    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = `${score}/${Donnees.totalQuestions}`;

    const scoreMessageElement = document.getElementById('scoreMessage');
    let message = '';
    let scoreClass = '';

    const percentage = (score / Donnees.totalQuestions) * 100;

    if (percentage === 100) {
        message = "Félicitations ! Vous avez un niveau d'expert en informatique.";
        scoreClass = 'excellent';
    } else if (percentage >= 75) {
        message = "Très bien ! Vous avez de solides connaissances en informatique.";
        scoreClass = 'good';
    } else {
        message = "Bonne tentative ! Vous avez besoin de réviser certains concepts.";
        scoreClass = 'poor';
    }

    scoreMessageElement.textContent = message;
    finalScoreElement.className = 'score ' + scoreClass;

    // 👤 Ajout du bloc identité utilisateur
    const identityBlock = document.createElement('div');
    identityBlock.classList.add('result-identity');
    const { titre, nom, prenom } = Donnees.utilisateur.identite;
    identityBlock.innerHTML = `<p>🧑‍🎓 Participant : ${titre} ${prenom} ${nom}</p>`;
    resultsDiv.insertBefore(identityBlock, finalScoreElement);

    displayCategoryBreakdown();
    displayRecommendations(scoreClass);
}

// Graphique camembert de réponses
export function afficherCamembertReponses() {
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    let correct = 0;
    let incorrect = 0;

    Donnees.quizData.forEach(q => {
        const userAnswer = userAnswers.find(obj => obj.id === q.id)?.answer;
        if (userAnswer === q.correctAnswer) {
            correct++;
        } else {
            incorrect++;
        }
    });

    const canvas = document.createElement('canvas');
    canvas.id = 'resultChart';
    canvas.width = 400;
    canvas.height = 400;
    document.getElementById('results').appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Bonnes réponses', 'Mauvaises réponses'],
            datasets: [{
                data: [correct, incorrect],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Répartition des réponses'
                }
            }
        }
    });
}

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
  // Récupère les données d'identité
  const quizData = JSON.parse(localStorage.getItem("quizData")) || {};
  const userInfo = quizData.identite || {
    titre: "",
    prenom: "",
    nom: ""
  };

  // Récupère les réponses existantes
  const previousAnswers = JSON.parse(localStorage.getItem("userAnswers"))?.reponses || [];

  // Trouve la question correspondante
  const question = Donnees.quizData.find(q => q.id === questionId);
  const correctAnswer = question?.correctAnswer || null;

  // Met à jour ou ajoute la réponse
  const existingIndex = previousAnswers.findIndex(item => item.id === questionId);

  const newAnswerObj = {
    id: questionId,
    answer: selectedOption,
    correctAnswer: correctAnswer
  };

  if (existingIndex !== -1) {
    previousAnswers[existingIndex] = newAnswerObj;
  } else {
    previousAnswers.push(newAnswerObj);
  }

  // Crée l’objet global à enregistrer
  const finalAnswers = {
    titre: userInfo.titre,
    prenom: userInfo.prenom,
    nom: userInfo.nom,
    totalQuestions: Donnees.totalQuestions,
    reponses: previousAnswers
  };

  // Enregistre dans le localStorage
  localStorage.setItem("userAnswers", JSON.stringify(finalAnswers));

  // Pour suivre le processus
  console.log(`✅ Réponse enregistrée : ${questionId} → ${selectedOption}`);
  console.log("🎯 Réponse correcte attendue :", correctAnswer);
  console.log("📊 Total de questions :", Donnees.totalQuestions);
  console.log("🗂️ Données complètes enregistrées dans localStorage (userAnswers):", finalAnswers);
}

