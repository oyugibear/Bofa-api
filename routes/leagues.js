const express = require('express');
const LeagueController = require("../controllers/league/index.js")
const { authenticateToken, authorizeRole } = require('../middlewares/auth.js');

const router = express.Router()

// Protected routes - require authentication
router.post('/add', authenticateToken, LeagueController.createLeague)    
router.get('/:id', authenticateToken, LeagueController.getLeague)
router.put('/:id', authenticateToken, LeagueController.updateLeague)

// Admin only routes
router.get('/', authenticateToken, authorizeRole('Admin'), LeagueController.getLeagues)
router.delete('/:id', authenticateToken, authorizeRole('Admin'), LeagueController.deleteLeague)

module.exports = router;