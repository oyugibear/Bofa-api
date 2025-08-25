const express = require('express');
const TeamController = require("../controllers/team/index.js");

const router = express.Router()

router.post('/team/add', TeamController.createTeam)    
router.get('/teams', TeamController.getTeams)
router.get('/team/:id', TeamController.getTeam)
router.put('/team/:id', TeamController.updateTeam)
router.delete('/team/:id', TeamController.deleteTeam)

module.exports = router;