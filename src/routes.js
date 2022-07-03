/* eslint-disable linebreak-style */
const {
  createBooksHandler, getAllBooksHandler, getOneBooksHandler, updateBooksHandler, deleteBookHandler,
} = require('./handlers');

const routes = [
  {
    method: 'POST',
    path: '/books',
    options: {
      cors: true,
      handler: createBooksHandler,
    },
  },
  {
    method: 'GET',
    path: '/books',
    options: {
      cors: true,
      handler: getAllBooksHandler,
    },
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    options: {
      cors: true,
      handler: getOneBooksHandler,
    },
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    options: {
      cors: true,
      handler: updateBooksHandler,
    },
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    options: {
      cors: true,
      handler: deleteBookHandler,
    },
  },
];

module.exports = { routes };
