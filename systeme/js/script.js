// Déclaration des variables globales
let quizData = []; // Pour stocker les questions chargées depuis questions.json
let currentQuestionIndex = 0;
let userAnswers = {}; // Pour stocker les réponses de l'utilisateur
let score = 0;
let totalQuestions = 0; // Sera mis à jour après le chargement des questions
let categoryScores = {}; // Pour suivre les scores par catégorie

// Fonction pour charger les questions depuis questions.json
async function loadQuestions() {
    try {
        const response = await fetch('./questions.json'); // Assurez-vous que le chemin est correct
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quizData = await response.json();
        totalQuestions = quizData.length;

        // Initialisation des scores par catégorie
        quizData.forEach(q => {
            if (!categoryScores[q.category]) {
                categoryScores[q.category] = { correct: 0, total: 0 };
            }
        });

        document.getElementById('totalQuestionsCount').textContent = totalQuestions;
        renderQuestion();
        updateProgressBar();
        updateQuestionCounter();
        updateNavigationButtons();
    } catch (error) {
        console.error("Erreur lors du chargement des questions :", error);
        document.getElementById('questionsContainer').innerHTML = '<p>Erreur lors du chargement du quiz. Veuillez réessayer plus tard.</p>';
    }
}

// Fonction pour afficher une question
function renderQuestion() {
    const questionContainer = document.getElementById('questionsContainer');
    questionContainer.innerHTML = ''; // Nettoyer le contenu précédent

    if (currentQuestionIndex < totalQuestions) {
        const questionData = quizData[currentQuestionIndex];
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', 'active');

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
        questionDiv.appendChild(questionTitle);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        // Itérer sur les options de la question pour créer les éléments HTML
        for (const key in questionData.options) {
            const optionValue = questionData.options[key];
            const optionLabel = document.createElement('label');
            optionLabel.classList.add('option');

            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question${questionData.id}`;
            optionInput.value = key;
            optionInput.id = `option-${questionData.id}-${key}`;
            optionLabel.appendChild(optionInput);

            const optionText = document.createElement('span');
            optionText.textContent = optionValue;
            optionLabel.appendChild(optionText);

            // Gérer la sélection de l'option
            optionInput.addEventListener('change', () => {
                const allOptions = optionsDiv.querySelectorAll('.option');
                allOptions.forEach(opt => opt.classList.remove('selected'));
                optionLabel.classList.add('selected');
                userAnswers[questionData.id] = optionInput.value; // Stocker la réponse de l'utilisateur
                updateNavigationButtons(); // Mettre à jour les boutons après sélection
            });

            optionsDiv.appendChild(optionLabel);
        }
        questionDiv.appendChild(optionsDiv);
        questionContainer.appendChild(questionDiv);

        // Pré-sélectionner la réponse de l'utilisateur si elle existe
        if (userAnswers[questionData.id]) {
            const selectedOptionInput = document.getElementById(`option-${questionData.id}-${userAnswers[questionData.id]}`);
            if (selectedOptionInput) {
                selectedOptionInput.checked = true;
                selectedOptionInput.closest('.option').classList.add('selected');
            }
        }

    } else if (currentQuestionIndex >= totalQuestions) {
        displayResults(); // Afficher les résultats si toutes les questions ont été parcourues
    }
    updateNavigationButtons();
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        renderQuestion();
        updateProgressBar();
        updateQuestionCounter();
    } else if (currentQuestionIndex === totalQuestions - 1) {
        // C'est la dernière question, afficher le bouton "Terminer"
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('finishBtn').style.display = 'block';
    }
}

// Fonction pour revenir à la question précédente
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        updateProgressBar();
        updateQuestionCounter();
    }
}

// Fonction pour mettre à jour les boutons de navigation (Précédent/Suivant/Terminer)
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    prevBtn.disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex === totalQuestions - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'block';
        finishBtn.disabled = !userAnswers[quizData[currentQuestionIndex].id]; // Désactiver Terminer si pas de réponse à la dernière question
    } else {
        nextBtn.style.display = 'block';
        finishBtn.style.display = 'none';
        nextBtn.disabled = !userAnswers[quizData[currentQuestionIndex].id]; // Désactiver Suivant si pas de réponse
    }
}

// Fonction pour mettre à jour la barre de progression
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progress = (currentQuestionIndex + 1) / totalQuestions * 100;
    progressFill.style.width = `${progress}%`;
}

// Fonction pour mettre à jour le compteur de questions
function updateQuestionCounter() {
    document.getElementById('currentQuestionNumber').textContent = currentQuestionIndex + 1;
}

// Fonction pour terminer le quiz et afficher les résultats
function finishQuiz() {
    calculateScore();
    displayResults();
    logQuizSummaryToConsole();
}

// Fonction pour calculer le score
function calculateScore() {
    score = 0;
    // Réinitialiser les scores par catégorie avant de recalculer
    for (const category in categoryScores) {
        categoryScores[category].correct = 0;
        categoryScores[category].total = 0;
    }

    quizData.forEach(question => {
        categoryScores[question.category].total++; // Incrémenter le total pour chaque catégorie
        if (userAnswers[question.id] === question.correctAnswer) {
            score++;
            categoryScores[question.category].correct++; // Incrémenter le score correct pour la catégorie
        }
    });
}

// Fonction pour afficher les résultats
function displayResults() {
    document.querySelector('.quiz-content').style.display = 'none';
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.add('active');

    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = `${score}/${totalQuestions}`;

    const scoreMessageElement = document.getElementById('scoreMessage');
    let message = '';
    let scoreClass = '';

    const percentage = (score / totalQuestions) * 100;

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
function displayCategoryBreakdown() {
    const categoryBreakdownDiv = document.getElementById('categoryBreakdown');
    categoryBreakdownDiv.innerHTML = '<h3>Répartition par catégorie</h3>'; // Ajouter un titre

    for (const category in categoryScores) {
        const data = categoryScores[category];
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
function displayRecommendations(scoreClass) {
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
function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = {};
    score = 0;
    
    // Masquer les résultats et afficher le quiz
    document.getElementById('results').classList.remove('active');
    document.querySelector('.quiz-content').style.display = 'block';

    // Afficher la première question
    renderQuestion();
    updateProgressBar();
    updateQuestionCounter();
    
    // Réinitialiser les boutons de navigation
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('finishBtn').style.display = 'none';
    updateNavigationButtons();

    // Nettoyer les messages de score et les recommandations
    document.getElementById('finalScore').classList.remove('excellent', 'good', 'poor');
    document.getElementById('scoreMessage').textContent = '';
    document.getElementById('categoryBreakdown').innerHTML = '';
    document.getElementById('recommendations').innerHTML = '';

    // Réinitialiser les scores par catégorie
    for (const category in categoryScores) {
        categoryScores[category].correct = 0;
        categoryScores[category].total = 0;
    }
}


// Nouvelle fonction pour logguer le résumé du quiz dans la console
function logQuizSummaryToConsole() {
    const summary = [];
    quizData.forEach((question, index) => {
        const questionNumber = index + 1;
        const questionText = question.question;
        const userAnswerKey = userAnswers[question.id];
        const userAnswerText = question.options[userAnswerKey] || "Non répondu"; // Gérer le cas où l'utilisateur n'a pas répondu
        const correctAnswerText = question.options[question.correctAnswer];
        const isCorrect = (userAnswerKey === question.correctAnswer) ? "✅ Correct" : "❌ Incorrect";

        summary.push({
            "N° Question": questionNumber,
            "Intitulé Question": questionText,
            "Votre Réponse": userAnswerText,
            "Réponse Correcte": correctAnswerText,
            "Statut": isCorrect
        });
    });

    console.groupCollapsed("📊 Résumé des Réponses du Quiz"); // Permet de déplier/replier dans la console
    console.table(summary);
    console.groupEnd();

    // console.log("-----------------------------------------");
    // console.log(" Détails de vos réponses :");
    // console.log("-----------------------------------------");
    // summary.forEach(item => {
    //     console.log(`Question ${item["N° Question"]} : ${item["Intitulé Question"]}`);
    //     console.log(`  Votre réponse : "${item["Votre Réponse"]}"`);
    //     console.log(`  Réponse correcte : "${item["Réponse Correcte"]}"`);
    //     console.log(`  Statut : ${item["Statut"]}`);
    //     console.log("---");
    // });
    // console.log("-----------------------------------------");
}

// Initialise le quiz au chargement de la page
document.addEventListener('DOMContentLoaded', loadQuestions);