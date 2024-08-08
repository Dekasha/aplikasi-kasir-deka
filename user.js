$(document).ready(function () {
  // Function to display cards
  function displayCards(barangList) {
    let html = "";
    barangList.forEach(function (barang, index) {
      html += `
        <div class="col-md-3 mb-4 d-flex align-items-stretch">
          <div class="card" style="width: 100%; height: 100%;">
            <a href="detail.html" class="stretched-link" onclick="saveSelectedData(${index})" style="text-decoration: none; color: inherit;">
              <img class="card-img-top" src="${barang.foto}" alt="Card image cap" style="height: 200px; object-fit: cover;">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-primary">${barang.namaBarang}</h5>
                <p class="card-text">${formatRupiah(barang.harga)}</p>
              </div>
            </a>
          </div>
        </div>
      `;
    });
    $("#cardContainer").html(html);
  }

  // Function to handle live search
  function searchBarang() {
    let searchInput = $("#searchInput").val().toLowerCase();
    let barangList = JSON.parse(localStorage.getItem("barangList")) || [];
    let filteredList = barangList.filter(barang => barang.namaBarang.toLowerCase().includes(searchInput));
    displayCards(filteredList);
  }

  // Load and display all cards initially
  let initialBarangList = JSON.parse(localStorage.getItem("barangList")) || [];
  displayCards(initialBarangList);

  // Bind search input event to live search function
  $("#searchInput").on("input", function () {
    searchBarang();
  });
});

function saveSelectedData(index) {
  let barangList = JSON.parse(localStorage.getItem("barangList"));
  let selectedBarang = barangList[index];
  localStorage.setItem("sedangDilihat", JSON.stringify(selectedBarang));
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const emailInput = document.getElementById('exampleInputEmail1').value;
  const passwordInput = document.getElementById('exampleInputPassword1').value;
  if (emailInput === 'admin@gmail.com' && passwordInput === 'admin') {
    window.localStorage.setItem('login', 'admin berhasil login');
    window.location.href = 'admin.html';
  } else {
    document.getElementById('exampleInputEmail1').style.borderColor = 'red';
    document.getElementById('exampleInputPassword1').style.borderColor = 'red';
    if (emailInput !== 'admin@gmail.com') {
      document.getElementById('emailError').innerText = 'Email salah';
    } else {
      document.getElementById('emailError').innerText = '';
    }
    if (passwordInput !== 'admin') {
      document.getElementById('passwordError').innerText = 'Password salah';
    } else {
      document.getElementById('passwordError').innerText = '';
    }
  }
});