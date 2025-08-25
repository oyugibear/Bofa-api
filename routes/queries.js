const express = require('express');
const QueryController = require("../controllers/query/index.js");

const router = express.Router()

router.post('/query/add', QueryController.createQuery)    
router.get('/queries', QueryController.getQueries)


module.exports = router;