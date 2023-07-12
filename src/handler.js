const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  // Dapatkan data dari client
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Tentukan nilai yang dibuat di server
  const id = nanoid(16);
  const finished = pageCount !== readPage ? false : true;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Buat object baru untuk ditambahkan ke array books
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Buat logic response, jika readPage lebih dari pageCount
  const isErrorPage = readPage > pageCount ? true : false;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (isErrorPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  // Tambahkan object ke array books
  books.push(newBook);
  // Jika buku berhasil ditambahkan maka panjang arraynya akan lebih dari 0
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

// Lihat semua buku
const showAllBookHandler = () => ({
  status: 'success',
  data: {
    books: books
      .map(({ id, name, publisher }) => {
        return {
          id,
          name,
          publisher,
        };
      })
      .slice(0, 2),
  },
});

const showBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cek apakah buku yang ingin didetailkan memiliki id yang sama dengan yang ada di data books
  const book = books.filter((b) => b.id === bookId)[0];
  // Jika id ditemukan
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  // Jika id tidak ada
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  // Dapetin id buku yang mau diubah datanya
  const { bookId } = request.params;
  // Dapetin data dari client (kayak pas masukin buku baru)
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  // Cari index dari buku yang ingin diganti datanya
  const index = books.findIndex((book) => book.id === bookId);
  const isErrorPage = readPage > pageCount ? true : false;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (isErrorPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
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

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // Bila id tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  // Dapatkan id dari book yang ingin dihapus
  const { bookId } = request.params;
  // Cari index dari buku tersebut
  const index = books.findIndex((book) => book.id === bookId);
  // Jika buku ditemukan, response berhasil
  if (index !== -1) {
    books.splice(index, 1); // Menghapus buku berdasarkan indexnya, dan satu buah
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  // JIka tidak ditemukan bukunya
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  showAllBookHandler,
  showBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
