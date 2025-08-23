// Génération du graphique Camembert d'après réponses correctes/incorrectes
export function afficherCamembertReponses(correct, incorrect, total, container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'resultChart';
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
                    display: false,
                    text: 'Répartition des réponses',
                    font: {
                        size: 22,
                        family: 'Arial',
                        weight: 'bold'
                    },
                    color: '#c5d321'
                },
                legend: {
                    labels: {
                        font: {
                            size: 16,
                            family: 'Verdana',
                            weight: 'normal'
                        },
                        color: '#ffff',
                        boxWidth: 15,
                        padding: 30,
                    },
                    position: 'bottom', // ou 'top', 'left', 'right', "bottom"
                }
            }
        }
    });
}

// Génération du graphique Jauge basé sur le pourcentage de bonnes réponses
export function afficherJaugeReponses(correctAnswerPercent, container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'resultChart';

    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Réussite', 'Manquant'],
            datasets: [{
                data: [correctAnswerPercent, 100 - correctAnswerPercent],
                backgroundColor: ['#4CAF50', '#E0E0E0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90, // Commence à 180°
            circumference: 180, // Affiche une demi-jauge
            cutout: '70%', // Épaisseur de la jauge

            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                },
                title: {
                    display: false,
                    text: `Score : ${correctAnswerPercent}%`,
                    font: {
                        size: 20,
                        family: 'Arial',
                        weight: 'bold'
                    },
                    color: '#ffffff',
                    padding: {
                        top: 5,
                        bottom: 5
                    }
                }
            }
        }
    });
}


// Génération du graphique Diagramme d'après réponses correctes/incorrectes
export function afficherDiagrammeReponses(repartition, container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'resultChart';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const labels = Object.keys(repartition);
    const dataValues = Object.values(repartition);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nombre de réponses par option',
                data: dataValues,
                backgroundColor: '#2196F3',
                borderColor: '#1976D2',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Répartition des réponses par option',
                    font: {
                        size: 20,
                        family: 'Arial',
                        weight: 'bold'
                    },
                    color: '#ffffff'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 14,
                            family: 'Verdana'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1, //affiche uniquement les chiffres entiers
                        color: '#ffffff',
                        font: {
                            size: 14,
                            family: 'Verdana'
                        }
                    },
                    grid: {
                        color: '#444'
                    }
                }
            }
        }
    });
}

