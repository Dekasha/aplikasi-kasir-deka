

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
  <td><img src="${barang.foto}" alt="foto ${barang.namaBarang}" style="width: 50px;"></td>
  <td>${barang.namaBarang}</td>
  <td>${barang.deskripsi}</td>
  <td>${barang.stok}</td>
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

function addBarang() {
  let namaBarang = document.getElementById("namaBarangTambah").value;
  let harga = document.getElementById("hargaBarangTambah").value;
  let stok = document.getElementById("stokBarangTambah").value;
  let deskripsi = document.getElementById("deskripsiBarangTambah").value;
  let foto = document.getElementById("fotoBarangTambah").files[0];
  let reader = new FileReader();

  reader.onloadend = function () {
    let newBarang = {
      namaBarang: namaBarang,
      harga: harga,
      stok: stok,
      deskripsi: deskripsi,
      foto: reader.result
    };

    let barangList;
    if (localStorage.getItem("barangList") === null) {
      barangList = [];
    } else {
      barangList = JSON.parse(localStorage.getItem("barangList"));
    }

    barangList.push(newBarang);
    localStorage.setItem("barangList", JSON.stringify(barangList));
    showDataBarang();
  };

  if (foto) {
    reader.readAsDataURL(foto);
  }
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
  document.getElementById("stokBarangEdit").value = barangList[index].stok;
  document.getElementById("deskripsiBarangEdit").value = barangList[index].deskripsi;
  document.getElementById("currentFotoBarang").src = barangList[index].foto;
  document.getElementById("saveEdit").setAttribute("onclick", `updateBarang(${index})`);
  let modal = new bootstrap.Modal(document.getElementById('modalEdit'));
  modal.show();
}

function updateBarang(index) {
  let barangList = JSON.parse(localStorage.getItem("barangList"));
  barangList[index].namaBarang = document.getElementById("namaBarangEdit").value;
  barangList[index].harga = document.getElementById("hargaBarangEdit").value;
  barangList[index].stok = document.getElementById("stokBarangEdit").value;
  barangList[index].deskripsi = document.getElementById("deskripsiBarangEdit").value;

  let newFoto = document.getElementById("fotoBarangEdit").files[0];
  if (newFoto) {
    let reader = new FileReader();
    reader.onloadend = function () {
      barangList[index].foto = reader.result;
      localStorage.setItem("barangList", JSON.stringify(barangList));
      showDataBarang();
      let modal = bootstrap.Modal.getInstance(document.getElementById('modalEdit'));
      modal.hide();
    };
    reader.readAsDataURL(newFoto);
  } else {
    localStorage.setItem("barangList", JSON.stringify(barangList));
    showDataBarang();
    let modal = bootstrap.Modal.getInstance(document.getElementById('modalEdit'));
    modal.hide();
  }
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

document.onload = showDataBarang();
