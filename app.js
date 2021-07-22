const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const cors = require('cors');

//Inicializaciones y middlewares
var port = process.env.PORT || '3000';
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());


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
const uploadRouter = require('./router/uploadDoc');

//Rutas
app.use('/', indexRouter);
app.use('/doc', uploadRouter);

//var host = '127.0.0.1';
//var host = '192.168.1.26';
//Servidor Start
app.listen(port, ()=>console.log(`Servidor en el puerto ${port}`));