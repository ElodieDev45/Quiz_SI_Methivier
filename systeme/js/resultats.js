import * as Affichage from './affichage.js';
import * as Donnees from './donnees.js';

export let userAnswers = {};
export let score = 0;

// Fonction pour afficher les résultats
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
    finalScoreElement.className = 'score ' + scoreClass; // Appliquer la classe pour la couleur

    displayCategoryBreakdown();
    displayRecommendations(scoreClass);
}

// Fonction pour afficher la répartition par catégorie
export function displayCategoryBreakdown() {
    const categoryBreakdownDiv = document.getElementById('categoryBreakdown');
    categoryBreakdownDiv.innerHTML = '<h3>Répartition par catégorie</h3>'; // Ajouter un titre

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

// Fonction pour afficher des recommandations basées sur le score global
export function displayRecommendations(scoreClass) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<h4>Recommandations personnalisées</h4>';
    const ul = document.createElement('ul');

    if (scoreClass === 'poor') {
        const li1 = document.createElement('li');
        li1.textContent = "Revoyez les bases de Windows, les raccourcis clavier et la gestion des fichiers.";
        ul.appendChild(li1);
        const li2 = document.createElement('li');
        li2.textContent = "Familiarisez-vous avec les concepts de stockage local vs. serveur.";
        ul.appendChild(li2);
    } else if (scoreClass === 'good') {
        const li = document.createElement('li');
        li.textContent = "Continuez à explorer des sujets plus avancés et à pratiquer les fonctionnalités moins courantes.";
        ul.appendChild(li);
    } else if (scoreClass === 'excellent') {
        const li = document.createElement('li');
        li.textContent = "Excellent travail dans toutes les catégories ! Continuez à apprendre et à vous tenir informé.";
        ul.appendChild(li);
    }
    recommendationsDiv.appendChild(ul);
}

// Fonction pour recommencer le quiz
export function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = {};
    score = 0;
    
    // Masquer les résultats et afficher le quiz
    document.getElementById('results').classList.remove('active');
    document.querySelector('.quiz-content').style.display = 'block';

    // Afficher la première question
    Affichage.renderQuestion();
    Affichage.updateProgressBar();
    Affichage.updateQuestionCounter();
    
    // Réinitialiser les boutons de navigation
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('finishBtn').style.display = 'none';
    Affichage.updateNavigationButtons();

    // Nettoyer les messages de score et les recommandations
    document.getElementById('finalScore').classList.remove('excellent', 'good', 'poor');
    document.getElementById('scoreMessage').textContent = '';
    document.getElementById('categoryBreakdown').innerHTML = '';
    document.getElementById('recommendations').innerHTML = '';

    // Réinitialiser les scores par catégorie
    for (const category in Donnees.categoryScores) {
        Donnees.categoryScores[category].correct = 0;
        Donnees.categoryScores[category].total = 0;
    }
}