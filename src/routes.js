const { addBooksHandler, showAllBookHandler, showBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler, showAllBookByReadingHandler } = require('./handler');

const routes = [
  // Menyimpan buku
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler,
  },
  // Menampilkan keseluruhan buku yang ada
  {
    method: 'GET',
    path: '/books',
    handler: showAllBookHandler,
  },
  // Menampilkan detail satu buku
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: showBookByIdHandler,
  },
  // Mengupdate buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  // Menghapus buku
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
