const express = require('express')
const router = express.Router() 

router.get('/', (req,res) => {
    res.render('maze')
})


module.exports = router