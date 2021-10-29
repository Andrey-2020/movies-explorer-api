const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { JWT_SECRET_DEV } = require('../utils/config');
const ERR_ANSWERS = require('../utils/err-answers');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(ERR_ANSWERS.UnauthorizedError);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV !== 'production' ? JWT_SECRET_DEV : JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(ERR_ANSWERS.UnauthorizedError));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
