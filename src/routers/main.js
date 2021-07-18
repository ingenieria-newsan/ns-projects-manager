const express = require('express');
const router = express.Router();

module.exports = function()
{
    /* controller generated pages */
    router.get( '/', (req,res) => res.render('pages/home'));

    /* misc 'n erros */
    router.get( '/robots.txt', (req,res) => res.send('User-agent: * \n Allow: /') );
    router.get( '/copyright', (req,res) => res.send('<code>2021 © Jorge Pauvels (jcvels@uvcoding.com.ar) | UVCoding</code>') );
    router.use( '/', (req,res) => res.send('404') );
    
    return router;
};
