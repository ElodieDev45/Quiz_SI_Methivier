import http.server
import socketserver
import os
import webbrowser

PORT = 8000

# Se positionner dans le bon dossier pour servir les fichiers HTML
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🔌 Serveur local actif sur le port {PORT}")
    webbrowser.open(f"http://localhost:{PORT}/projet.html")
    httpd.serve_forever()