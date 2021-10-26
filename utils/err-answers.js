const ERR_ANSWERS = {
  MovieNotFoundError: 'Фильма с таким id не существует',
  BadRequestError: 'Переданы не корректные данные',
  MovieForbiddenError: 'Нельзя удалять чужие фильмы',
  UserNotFoundError: 'Запрашиваемый пользователь не найден',
  BadRequestUser: 'Некорректный id пользователя',
  UserEmailExist: 'Пользователь с таким email уже существует в базе',
  WrongEmailOrPassword: 'Неправильная почта или пароль',
  UnauthorizedError: 'Необходима авторизация',
  ServerError: 'На сервере произошла ошибка',
  ImageNotUrlError: 'Поле image не является ссылкой',
  TrailerNotUrlError: 'Поле trailer не является ссылкой',
  ThumbnailNotUrlError: 'Поле thumbnail не является ссылкой',
  NotCorrectEmailError: 'Некорректная почта',
  NotFoundPageError: 'Такой страницы не существует',
  NotCorrectUrlError: 'Неправильный формат ссылки',
};

module.exports = ERR_ANSWERS;
