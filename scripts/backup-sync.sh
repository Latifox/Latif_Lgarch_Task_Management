#!/bin/sh
# Script de synchronisation des backups MongoDB vers un serveur distant

# Définir les variables depuis les variables d'environnement ou utiliser les valeurs par défaut
REMOTE_HOST=${BACKUP_REMOTE_HOST:-backup.example.com}
REMOTE_USER=${BACKUP_REMOTE_USER:-backup}
REMOTE_PATH=${BACKUP_REMOTE_PATH:-/backups/mongodb}
LOCAL_PATH=${BACKUP_LOCAL_PATH:-/backup}

# S'assurer que le répertoire local existe
if [ ! -d "$LOCAL_PATH" ]; then
    echo "ERREUR: Le répertoire local '$LOCAL_PATH' n'existe pas!"
    exit 1
fi

# Vérifier s'il y a des fichiers à synchroniser
COUNT=$(ls -1 "$LOCAL_PATH" | wc -l)
if [ "$COUNT" -eq 0 ]; then
    echo "AVERTISSEMENT: Aucun fichier de backup trouvé dans '$LOCAL_PATH'!"
    exit 0
fi

echo "Démarrage de la synchronisation des backups vers $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo "Nombre de fichiers à synchroniser: $COUNT"

# Utiliser rsync pour transférer les fichiers
rsync -avz --progress -e "ssh -o StrictHostKeyChecking=no" \
    "$LOCAL_PATH/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

# Vérifier le statut de la commande rsync
if [ $? -eq 0 ]; then
    echo "Synchronisation terminée avec succès"
    exit 0
else
    echo "ERREUR: La synchronisation a échoué!"
    exit 1
fi 