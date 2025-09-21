const express = require('express');
const TeamController = require("../controllers/team/index.js");

const router = express.Router()

router.post('/add', TeamController.createTeam)    
router.get('/', TeamController.getTeams)
router.get('/:id', TeamController.getTeam)
router.put('/edit/:id', TeamController.updateTeam)
router.delete('/:id', TeamController.deleteTeam)

module.exports = router;