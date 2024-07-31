function showDataBarang() {
  let barangList;
  if (localStorage.getItem("barangList") === null) {
    barangList = [];
  } else {
    barangList = JSON.parse(localStorage.getItem("barangList"));
  }

  let html = "";

  barangList.forEach(function (barang, index) {
    html += `
<tr>
  <td>${barang.namaBarang}</td>
  <td>${formatRupiah(barang.harga)}</td>
  <td>
    <button type="button" class="btn btn-warning" onclick="editBarang(${index})">Edit</button>
    <button type="button" class="btn btn-danger" onclick="deleteBarang(${index})">Delete</button>
  </td>
</tr>
`;
  });
  document.getElementById("dataBarang").innerHTML = html;
}

document.onload = showDataBarang();

function addBarang() {
  let namaBarang = document.getElementById("namaBarangTambah").value;
  let harga = document.getElementById("hargaBarangTambah").value;
  let newBarang = {
    namaBarang: namaBarang,
    harga: harga
  };

  if (localStorage.getItem("barangList") === null) {
    let barangList = [];
    barangList.push(newBarang);
    localStorage.setItem("barangList", JSON.stringify(barangList));
  } else {
    let barangList = JSON.parse(localStorage.getItem("barangList"));
    barangList.push(newBarang);
    localStorage.setItem("barangList", JSON.stringify(barangList));
  }
  showDataBarang();
}

function deleteBarang(index) {
  let barangList = JSON.parse(localStorage.getItem("barangList"));
  barangList.splice(index, 1);
  localStorage.setItem("barangList", JSON.stringify(barangList));
  showDataBarang();
}

function editBarang(index) {
  let barangList = JSON.parse(localStorage.getItem("barangList"));
  document.getElementById("namaBarangEdit").value = barangList[index].namaBarang;
  document.getElementById("hargaBarangEdit").value = barangList[index].harga;
  document.getElementById("saveEdit").setAttribute("onclick", `updateBarang(${index})`);
  let modal = new bootstrap.Modal(document.getElementById('modalEdit'));
  modal.show();
}

function updateBarang(index) {
  let barangList = JSON.parse(localStorage.getItem("barangList"));
  barangList[index].namaBarang = document.getElementById("namaBarangEdit").value;
  barangList[index].harga = document.getElementById("hargaBarangEdit").value;
  localStorage.setItem("barangList", JSON.stringify(barangList));
  showDataBarang();
  let modal = bootstrap.Modal.getInstance(document.getElementById('modalEdit'));
  modal.hide();
  window.location.reload();
}

document.getElementById("saveTambah").addEventListener("click", function () {
  addBarang();
  let modal = bootstrap.Modal.getInstance(document.getElementById('modalTambah'));
  modal.hide();
  window.location.reload();
});

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}