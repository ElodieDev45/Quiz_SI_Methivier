// localStorage.js - Sauvegarde l'identité, les réponses de l'utilisateur (avec calcul des choix de réponse) dans le localStorage

// import des données du questionnaire pour accès aux questions et métadonnées
import * as Donnees from './donnees.js';

// Sauvegarde les réponses de l'utilisateur pour une question donnée, avec validation et catégorisation
export function saveAnswer(questionId, selectedOption) {
  // 1. Récupère les information d'identité de l'utilisateur
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

  // 4. Met à jour la réponse existante ou ajoute une nouvelle entrée
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

  // 6. Prépare et sauvegarde l'objet final dans le localStorage
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

// Récupère les réponses utilisateur depuis localStorage ou retourne null si données absentes
export function getUserAnswers(){
    const userData = JSON.parse(localStorage.getItem("userAnswers"));
    if (!userData || !userData.reponses) {
        console.error("❌ Données utilisateur manquantes ou incomplètes.");
        return null;
  }
  return userData;
}

// Calcul nombre total réponses par option : a=2, b=5, etc...
export function resultAnswersCounts(reponses = null) {
  // si aucun tableau fourni, récupération automatique depuis localStorage
  if (!reponses){
      const localStorageData = JSON.parse(localStorage.getItem("userAnswers"));
      reponses = localStorageData?.reponses || [];
  }

  const answersCounts = {};

  reponses.forEach(item => {
      const answer = item.answer;
      if (answer) {
      answersCounts[answer] = (answersCounts[answer] || 0) + 1;
      }
  });

  return answersCounts;
}