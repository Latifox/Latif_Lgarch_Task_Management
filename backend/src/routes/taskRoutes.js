const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré de la tâche
 *         title:
 *           type: string
 *           description: Le titre de la tâche
 *         description:
 *           type: string
 *           description: Description détaillée de la tâche
 *         status:
 *           type: string
 *           description: Statut actuel de la tâche
 *           enum: [todo, in_progress, completed]
 *         priority:
 *           type: string
 *           description: Priorité de la tâche
 *           enum: [low, medium, high]
 *         category:
 *           type: string
 *           description: Catégorie de la tâche
 *         owner:
 *           type: string
 *           description: Référence à l'utilisateur propriétaire
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Date d'échéance de la tâche
 *       example:
 *         _id: 60d4b4a12e5d6234f456789a
 *         title: Finir le rapport
 *         description: Compléter le rapport sur le projet XYZ
 *         status: in_progress
 *         priority: high
 *         category: Travail
 *         owner: 60d4b3a12e5d6234f456789a
 *         dueDate: 2023-07-15T00:00:00.000Z
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Récupérer toutes les tâches de l'utilisateur
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, completed]
 *         description: Filtrer par statut
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filtrer par priorité
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *     responses:
 *       200:
 *         description: Liste des tâches récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', auth, taskController.getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Récupérer une tâche par ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Tâche récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', auth, taskController.getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               category:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, taskController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Mettre à jour une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               category:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Tâche mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Tâche non trouvée
 *       401:
 *         description: Non autorisé
 */
router.patch('/:id', auth, taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
 *       404:
 *         description: Tâche non trouvée
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router; 