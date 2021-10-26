const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const Conflict = require('../errors/conflict-err');
const ERR_ANSWERS = require('../utils/err-answers');
const { JWT_SECRET_DEV } = require('../utils/config');

module.exports.getMeUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERR_ANSWERS.UserNotFoundError);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERR_ANSWERS.BadRequestUser));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERR_ANSWERS.UserNotFoundError);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(ERR_ANSWERS.BadRequestError));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((customer) => {
      if (customer) {
        throw new Conflict(ERR_ANSWERS.UserEmailExist);
      }
      return bcrypt.hash(password, 10)
        .then((hash) => {
          if (!validator.isEmail(email)) {
            throw new BadRequestError(ERR_ANSWERS.NotCorrectEmailError);
          }
          return User.create({
            name,
            email,
            password: hash, // записываем хеш в базу
          });
        })
        .then((user) => {
          res.status(200).send({
            name: user.name,
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === 'MongoServerError' && err.code === 11000) {
            next(new Conflict(err.message));
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestError(ERR_ANSWERS.BadRequestError));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
      res.send({ token });
    })
    .catch(() => {
      // ошибка аутентификации UnauthorizedError
      next(new UnauthorizedError(ERR_ANSWERS.UnauthorizedError));
    });
};
