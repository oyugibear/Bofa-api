const express = require('express');
const LeagueController = require("../controllers/league/index.js")
const { authenticateToken, authorizeRole } = require('../middlewares/auth.js');

const router = express.Router()

// Protected routes - require authentication
router.post('/add', authenticateToken, LeagueController.createLeague)    

// Admin only routes
router.get('/', authenticateToken, authorizeRole('Admin'), LeagueController.getLeagues)
router.put('/generateMatches', authenticateToken, authorizeRole('Admin'), LeagueController.generateMatches)
router.post('/standings/initialize/:id', authenticateToken, authorizeRole('Admin'), LeagueController.initializeLeagueStandings)
router.put('/standings/recalculate/:id', authenticateToken, authorizeRole('Admin'), LeagueController.recalculateLeagueStandings)

// Routes with parameters (must come after specific routes)
router.get('/:id', authenticateToken, LeagueController.getLeague)
router.put('/:id', authenticateToken, LeagueController.updateLeague)
router.delete('/:id', authenticateToken, authorizeRole('Admin'), LeagueController.deleteLeague)

module.exports = router;