// Génération du graphique Camembert d'après réponses correctes/incorrectes
export function afficherCamembertReponses(correct, incorrect, total, container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'resultChart';
    canvas.width = 400;
    canvas.height = 400;
    container.appendChild(canvas);

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
                    text: 'Répartition des réponses 📊'
                }
            }
        }
    });
}


// Génération du graphique Diagramme d'après réponses correctes/incorrectes
export function afficherDiagrammeReponses(repartition, container) {
    console.log("afficherDiagrammeReponses() n'est pas encore implémentée.");
}

// Génération du graphique Jauge d'après 
export function afficherJaugeReponses(correct, incorrect, total, container) {
    console.log("afficherJaugeReponses() n'est pas encore implémentée.");
}