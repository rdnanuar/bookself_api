/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const { v4: uuid } = require('uuid');
const { writeTofile } = require('./utils');
const books = require('./books.json');

const createBooksHandler = async (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = await request.payload;

  const id = uuid();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBooks = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  const isSuccess = books.filter((book) => book.id === id);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
    return response;
  } if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
    return response;
  } if (isSuccess) {
    books.push(newBooks);
    writeTofile('src/books.json', books);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: `${id}`,
      },
    }).code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku Gagal ditambahkan',
  }).code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const isReading = books.filter(({ reading }) => reading === true);
  const isNotReading = books.filter(({ reading }) => reading === false);
  const isFinished = books.filter(({ finished }) => finished === true);
  const isNotFinished = books.filter(({ finished }) => finished === false);

  if (request.query.name) {
    const findBookByName = books.filter(({ name }) => name.toLowerCase() === String(request.query.name).toLowerCase());
    const response = h.response({
      status: 'success',
      data: {
        books: findBookByName.map(({ id, name, publisher }) => (({ id, name, publisher }))),
      },
    }).code(200);
    return response;
  }

  if (!request.query.name && !request.query.reading && !request.query.finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map(({ id, name, publisher }) => (({ id, name, publisher }))),
      },
    }).code(200);
    return response;
  }

  if (Number(request.query.finished) === 1) {
    const response = h.response({
      status: 'success',
      data: {
        books: isFinished.map(({ id, name, publisher }) => (({ id, name, publisher }))),
      },
    }).code(200);
    return response;
  }
  if (Number(request.query.finished) === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: isNotFinished.map(({ id, name, publisher }) => (({ id, name, publisher }))),
      },
    }).code(200);
    return response;
  }
  if (Number(request.query.reading) === 1) {
    const response = h.response({
      status: 'success',
      data: {
        books: isReading.map(({ id, name, publisher }) => (({ id, name, publisher }))),
      },
    }).code(200);
    return response;
  }
  if (Number(request.query.reading) === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: isNotReading.map(({ id, name, publisher }) => (({ id, name, publisher }))),
      },
    }).code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal mendapatkan Data Buku',
  }).code(500);
  return response;
};

const getOneBooksHandler = async (request, h) => {
  const findBook = books.find(({ id }) => id === request.params.bookId);

  if (!findBook) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      book: findBook,
    },
  }).code(200);
  return response;
};

const updateBooksHandler = async (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = await request.payload;

  const updatedAt = new Date().toISOString();

  const findIndexBook = books.findIndex(({ id }) => id === request.params.bookId);

  const UpdateBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
    return response;
  } if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
    return response;
  } if (findIndexBook === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
    return response;
  }
  books[findIndexBook] = { ...books[findIndexBook], ...UpdateBook };
  writeTofile('./src/books.json', books);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
  return response;
};

const deleteBookHandler = (request, h) => {
  const findIndexBook = books.findIndex(({ id }) => id === request.params.bookId);

  if (findIndexBook !== -1) {
    books.splice(findIndexBook, 1);
    writeTofile('./src/books.json', books);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
  return response;
};

module.exports = {
  createBooksHandler, getAllBooksHandler, getOneBooksHandler, updateBooksHandler, deleteBookHandler,
};
