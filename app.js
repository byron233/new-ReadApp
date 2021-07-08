const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');

//Inicializaciones y middlewares
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Motor de plantillas
app.set('views', './views');
app.engine('.hbs', exphbs({
    defaultLayout: 'layout',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',

}));
app.set('view engine', '.hbs');

//Variables de rutas
const indexRouter = require('./router/index');

//Rutas
app.use('/', indexRouter);

var host = '127.0.0.1';
//Servidor Start
app.listen(3000, host ,()=>console.log("Servidor en el puerto 3000"));