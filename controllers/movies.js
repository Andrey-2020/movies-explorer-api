const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const ERR_ANSWERS = require('../utils/err-answers');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERR_ANSWERS.BadRequestError));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(ERR_ANSWERS.MovieNotFoundError);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(ERR_ANSWERS.MovieForbiddenError);
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((removedMovie) => {
          if (!removedMovie) {
            throw new NotFoundError(ERR_ANSWERS.MovieNotFoundError);
          }
          return res.status(200).send(removedMovie);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError(ERR_ANSWERS.BadRequestError));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERR_ANSWERS.BadRequestError));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};
