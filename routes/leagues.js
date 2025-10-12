const express = require('express');
const LeagueController = require("../controllers/league/index.js")
const { authenticateToken, authorizeRole } = require('../middlewares/auth.js');

const router = express.Router()

// Protected routes - require authentication
router.post('/add', authenticateToken, LeagueController.createLeague)    

// Public access for viewing leagues
router.get('/', LeagueController.getLeagues)

// Admin only routes
router.put('/generateMatches', authenticateToken, authorizeRole('Admin'), LeagueController.generateMatches)
router.post('/standings/initialize/:id', authenticateToken, authorizeRole('Admin'), LeagueController.initializeLeagueStandings)
router.put('/standings/recalculate/:id', authenticateToken, authorizeRole('Admin'), LeagueController.recalculateLeagueStandings)

// Routes with parameters (must come after specific routes)
router.get('/:id', LeagueController.getLeague)
router.put('/:id', authenticateToken, LeagueController.updateLeague)
router.delete('/:id', authenticateToken, authorizeRole('Admin'), LeagueController.deleteLeague)

module.exports = router;