const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createUser, login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const ERR_ANSWERS = require('../utils/err-answers');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use(auth);
router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError(ERR_ANSWERS.NotFoundPageError));
});

module.exports = router;
