import * as Donnees from './donnees.js';


// Sauvegarde les réponses de l'utilisateur dans le localStorage
export function saveAnswer(questionId, selectedOption) {
  // 1. Récupère les information d'identité de l'utilisateur depuis le localStorage
  const quizData = JSON.parse(localStorage.getItem("quizData")) || {};
  const userInfo = quizData.identite || {
    titre: "",
    prenom: "",
    nom: ""
  };

  // 2. Récupère les réponses existantes depuis le localStorage
  const previousAnswers = JSON.parse(localStorage.getItem("userAnswers"))?.reponses || [];

  // 3. Trouve la question correspondante
  const question = Donnees.quizData.find(q => q.id === questionId);
  const correctAnswer = question?.correctAnswer || null;

  // 4. Met à jour ou ajoute la réponse
  const existingIndex = previousAnswers.findIndex(item => item.id === questionId);

  // 5. Récupère la catégorie associée à la question
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

  // 6. Crée l’objet complet à enregistrer dans le localStorage
  const finalAnswers = {
    titre: userInfo.titre,
    prenom: userInfo.prenom,
    nom: userInfo.nom,
    totalQuestions: Donnees.totalQuestions,
    reponses: previousAnswers
  };

  // 7. Enregistre dans le localStorage
  localStorage.setItem("userAnswers", JSON.stringify(finalAnswers));

  // 8. Affiche des log pour suivre le processus d'enregistrement
  console.log(`✅ Réponse enregistrée : ${questionId} → ${selectedOption}`);
  console.log("🎯 Réponse correcte attendue :", correctAnswer);
  console.log("📊 Total de questions :", Donnees.totalQuestions);
  console.log("🗂️ Données complètes enregistrées dans localStorage (userAnswers):", finalAnswers);
}

// Récupère l'objet complet des réponses utilisateur depuis localStorage
export function getUserAnswers(){
    const userData = JSON.parse(localStorage.getItem("userAnswers"));
    if (!userData || !userData.reponses) {
        console.error("❌ Données utilisateur manquantes ou incomplètes.");
        return null;
  }
  return userData;
}

// Crée un objet avec la liste du total de chaque choix de réponse (a=2, b=5, etc...)
export function resultAnswersCounts(reponses = null) {
    // si aucun tableau fourni, récupération des réponses depuis localStorage
    if (!reponses){
        const localStorageData = JSON.parse(localStorage.getItem("userAnswers"));
        reponses = localStorageData?.reponses || [];
    }

    const AnswersCounts = {};

    reponses.forEach(item => {
        const answer = item.answer;
        if (answer) {
        AnswersCounts[answer] = (AnswersCounts[answer] || 0) + 1;
        }
    });

    return AnswersCounts;
}
