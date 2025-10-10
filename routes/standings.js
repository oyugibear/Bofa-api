const express = require('express');
const StandingsController = require('../controllers/standings/index.js');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.js');

const router = express.Router();

// Protected routes - require authentication
router.get('/:leagueId', authenticateToken, StandingsController.getStandings);

// Admin only routes
router.post('/initialize/:leagueId', authenticateToken, authorizeRole('Admin'), StandingsController.initializeStandings);
router.put('/recalculate/:leagueId', authenticateToken, authorizeRole('Admin'), StandingsController.recalculateStandings);
router.put('/match/:matchId', authenticateToken, authorizeRole('Admin'), StandingsController.updateStandingsForMatch);

module.exports = router;
