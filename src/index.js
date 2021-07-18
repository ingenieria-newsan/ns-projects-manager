const express = require('express');
const path = require('path');
const morgan = require("morgan");
const mongoose = require("mongoose");

const config = require("./config/app-config.json");
const mainRouter = require("./routers/main");
const projectsController = require("./controllers/projects.controller");

/* configuración global */
const app_mode = process.env.NODE_ENV || 'development';
var port = 80;
if( process.env.PORT ) port = process.env.PORT /* cambio el puerto de escucha si fue especificado como variable de entorno */

/* creo una app de express */
const app = express();

/* static files */
app.use('/', express.static('public')); 

/* view engine */
app.set('view engine','pug');

/* views folder */
app.set('views', path.join(__dirname, './views'))

/* middlewares */
app.use(express.urlencoded({ extended: false }))
app.use(morgan('short'));

/* rutas */
app.use( '/proyectos', projectsController() );
app.use( '/', mainRouter() );

/* informo por consola el puerto de escucha */
console.clear();
console.log(`< INFO > app listen to port ${port}.`);
console.log(`< INFO > app running on ${app_mode} mode.`);

/* inicio el listering */
app.listen(port);

/* database connection */
mongoose
    .connect(`mongodb://${config.database[app_mode].user}:${config.database[app_mode].password}@${config.database[app_mode].endpoint}:${config.database[app_mode].port}/${config.database[app_mode].schema}?${config.database[app_mode].parameters}`, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then( db => console.log(`< INFO > sucessfuly connected to database.`) )
    .catch( err => console.error(`< ERROR > can't connect to database due to following error: ${err}.`) )
;
