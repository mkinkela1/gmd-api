const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerDoc = require('./swaggerDoc');
const cors = require('cors');
const passport = require('passport');

app.use(cors());

require('dotenv').config();

/**
 * swagger docs
 */

swaggerDoc(app);

/**
 * connect database
 */

const mongoDbString = process.env.DATABASE_URL;

mongoose.connect(
    mongoDbString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
);


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method==='OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }

    next();
});

/**
 * import routes
 */

const auth = require('./api/routes/AuthRoutes');
const offer = require('./api/routes/OfferRoutes');
const workOrder = require('./api/routes/WorkOrderRoutes');

app.use('/api/auth', auth);
app.use('/api/offer', offer);
app.use('/api/work-order', workOrder);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;