/**
 * sass-watcher.js
 * Script pour surveiller les modifications dans les fichiers SASS
 * et compiler automatiquement les fichiers CSS.
 * Utilise Chokidar pour le watch et Node.js pour l'exécution.
 */

const chokidar = require('chokidar');
const { exec } = require('child_process');

chokidar.watch('./css/sass/**/*.scss').on('change', (path) => {
  console.log(`🌀 Fichier modifié : ${path}`);
  exec('sass css/sass/style.scss css/style.css', (err, stdout, stderr) => {
    if (err) {
      console.error(`Erreur SASS : ${stderr}`);
    } else {
      console.log('✅ CSS recompilé avec succès !');
    }
  });
});
