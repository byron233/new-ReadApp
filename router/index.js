const express = require('express');
const router = express.Router();




router.get(('/'), (req,res)=>{
    res.render('index');
});

router.get(('/game'), (req,res)=>{
    res.render('game');
});

//Pagina 404
router.get('*', (req,res)=>{
    res.status(404).render('404page');
})


module.exports = router;