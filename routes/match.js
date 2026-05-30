const express = require('express');
const MatchController = require("../controllers/match/index");
const { authenticateToken } = require('../middlewares/auth.js');

const router = express.Router()

router.post('/add', MatchController.createMatch)    
router.get('/', MatchController.getMatches)
router.get('/team/:id', MatchController.getMatchesByTeamId)
router.get('/:id', MatchController.getMatch)
router.put('/:id/participation', authenticateToken, MatchController.confirmParticipation)
router.put('/edit/:id', MatchController.updateMatch)
router.delete('/:id', MatchController.deleteMatch)

module.exports = router;
