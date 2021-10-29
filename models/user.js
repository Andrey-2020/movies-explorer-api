const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const ERR_ANSWERS = require('../utils/err-answers');
// импортируем bcrypt
const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true,
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов

  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: ERR_ANSWERS.NotCorrectEmailError,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('WrongEmailOrPassword'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('WrongEmailOrPassword'));
          }

          return user; // теперь user доступен
        });
    })
    .catch(next);
};
module.exports = mongoose.model('user', userSchema);
