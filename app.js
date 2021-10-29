require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const allRouters = require('./routes/index');
const limiter = require('./middlewares/limiter');
const { DB_CONNECTION_DEVELOP } = require('./utils/config');
const ERR_ANSWERS = require('./utils/err-answers');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { DB_CONNECTION_PRODUCTION, NODE_ENV, PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV !== 'production' ? DB_CONNECTION_DEVELOP : DB_CONNECTION_PRODUCTION);
app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/api/', allRouters);

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? ERR_ANSWERS.ServerError
        : message,
    });
  next();
});

app.listen(PORT);
