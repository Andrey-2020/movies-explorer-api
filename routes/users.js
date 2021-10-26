const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMeUser, updateUser,
} = require('../controllers/users');

router.get('/me', getMeUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
