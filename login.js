
// Cek apakah user sudah login atau belum
let login = localStorage.getItem('login');
if (!login) {
  window.location.href = 'index.html';
}