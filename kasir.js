document.addEventListener('DOMContentLoaded', function() {
  populateSelectOption();
  showDataBelanjaan();
});

function populateSelectOption() {
  let barangList = JSON.parse(localStorage.getItem('barangList')) || [];
  let listBarangKasir = document.getElementById('listBarangKasir');

  listBarangKasir.innerHTML = barangList.map((barang, index) => `
    <option value="${index}">${barang.namaBarang}</option>
  `).join('');
}

function showDataBelanjaan() {
  let belanjaanList = JSON.parse(localStorage.getItem('belanjaanList')) || [];
  let html = "";
  let totalHarga = 0;

  belanjaanList.forEach(function (belanja, index) {
    let subtotal = belanja.harga * belanja.jumlah;
    totalHarga += subtotal;

    html += `
      <tr>
        <td>${belanja.namaBarang}</td>
        <td>${formatRupiah(belanja.harga)}</td>
        <td>${belanja.jumlah}</td>
        <td>
          <button type="button" class="btn btn-danger" onclick="deleteBelanjaan(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById('dataBelanjaan').innerHTML = html;
  document.getElementById('totalHarga').innerText = formatRupiah(totalHarga);
}

function addBelanjaan() {
  let barangList = JSON.parse(localStorage.getItem('barangList')) || [];
  let belanjaanList = JSON.parse(localStorage.getItem('belanjaanList')) || [];

  let selectedBarangIndex = document.getElementById('listBarangKasir').value;
  let jumlahBarang = document.getElementById('jmlBarangKasir').value;

  if (selectedBarangIndex !== "" && jumlahBarang > 0) {
    let selectedBarang = barangList[selectedBarangIndex];
    let newBelanjaan = {
      namaBarang: selectedBarang.namaBarang,
      harga: parseFloat(selectedBarang.harga), // Make sure the price is treated as a number
      jumlah: parseInt(jumlahBarang) // Make sure the quantity is treated as an integer
    };

    belanjaanList.push(newBelanjaan);
    localStorage.setItem('belanjaanList', JSON.stringify(belanjaanList));
    showDataBelanjaan();
  } else {
    alert('Pilih barang dan masukkan jumlah yang valid.');
  }
}

function deleteBelanjaan(index) {
  let belanjaanList = JSON.parse(localStorage.getItem('belanjaanList'));
  belanjaanList.splice(index, 1);
  localStorage.setItem('belanjaanList', JSON.stringify(belanjaanList));
  showDataBelanjaan();
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}