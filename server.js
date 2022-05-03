let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let methodOverride = require('method-override');
let indexRouter = require('./routes/index');
let homeRouter = require('./routes/home');
let authRouter = require('./routes/auth');
let listRouter = require('./routes/list');
const session = require('express-session');
const Filestore = require('session-file-store')(session);
const sequelize = require('./models/index').sequelize;
const flash = require('connect-flash');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

sequelize.sync({ force: false }) 
    .then(() => { console.log('데이터베이스 연결 성공'); })
    .catch((err) => { console.error(err); });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true },
    store: new Filestore()
}));
app.use(flash());

let passport = require('./controllers/passport')(app);


app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/auth', authRouter);
app.use('/list', listRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


app.listen(3000);
module.exports = app;
