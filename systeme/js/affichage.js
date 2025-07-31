import * as Navigation from './navigation.js';
import * as Donnees from './donnees.js';
import * as Resultats from './resultats.js';

// Fonction pour afficher une question
export function renderQuestion() {
    const questionContainer = document.getElementById('questionsContainer');
    questionContainer.innerHTML = ''; // Nettoyer le contenu précédent

    if (Navigation.currentQuestionIndex < Donnees.totalQuestions) {
        const questionData = Donnees.quizData[Navigation.currentQuestionIndex];
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', 'active');

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `${Navigation.currentQuestionIndex + 1}. ${questionData.question}`;
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
            optionInput.name = "option";
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
                Donnees.userAnswers[questionData.id] = optionInput.value; // Stocker la réponse de l'utilisateur
                updateNavigationButtons(); // Mettre à jour les boutons après sélection
            });

            optionsDiv.appendChild(optionLabel);
        }

        questionDiv.appendChild(optionsDiv);
        questionContainer.appendChild(questionDiv);

        // Pré-sélectionner la réponse de l'utilisateur si elle existe
        if (Donnees.userAnswers[questionData.id]) {
            const selectedOptionInput = document.getElementById(`option-${questionData.id}-${Donnees.userAnswers[questionData.id]}`);
            if (selectedOptionInput) {
                selectedOptionInput.checked = true;
                selectedOptionInput.closest('.option').classList.add('selected');
            }
        }

    } else if (Navigation.currentQuestionIndex >= Donnees.totalQuestions) {
        Resultats.displayResults(); // Afficher les résultats si toutes les questions ont été parcourues
    }

    updateNavigationButtons(); // Mettre à jour les boutons en dehors du bloc conditionnel
}

// Fonction pour mettre à jour les boutons de navigation (Précédent/Suivant/Terminer)
export function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    prevBtn.disabled = Navigation.currentQuestionIndex === 0;

    const currentQuestion = Donnees.quizData[Navigation.currentQuestionIndex];
    const answered = Donnees.userAnswers[currentQuestion?.id];

    // ✅ On ne s’occupe PAS de l’index ici : les boutons sont gérés depuis navigation.js
    nextBtn.style.display = 'block';
    finishBtn.style.display = 'none';

    nextBtn.disabled = !answered;
    finishBtn.disabled = !answered;
}

// Fonction pour mettre à jour la barre de progression
export function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progress = (Navigation.currentQuestionIndex + 1) / Donnees.totalQuestions * 100;
    progressFill.style.width = `${progress}%`;
}

// Fonction pour mettre à jour le compteur de questions
export function updateQuestionCounter() {
    document.getElementById('currentQuestionNumber').textContent = Navigation.currentQuestionIndex + 1;
}
