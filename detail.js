document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.getElementById("productContainer");
  let productData = JSON.parse(localStorage.getItem("sedangDilihat"));

  if (productData) {
    // Fetch the latest data from barangList
    let barangList = JSON.parse(localStorage.getItem("barangList")) || [];
    const updatedProduct = barangList.find(item => item.namaBarang === productData.namaBarang);

    // If there's a discrepancy, update sedangDilihat
    if (updatedProduct && JSON.stringify(productData) !== JSON.stringify(updatedProduct)) {
      productData = updatedProduct;
      localStorage.setItem("sedangDilihat", JSON.stringify(productData));
    }

    const productCard = document.createElement("div");
    productCard.className = "col-12";

    productCard.innerHTML = `
        <div class="product-card">
          <img src="${productData.foto}" alt="${productData.namaBarang}" class="product-image">
          <h2 class="product-title">${productData.namaBarang}</h2>
          <p class="product-price">${formatRupiah(productData.harga)}</p>
          <p class="product-stock">Stok ${productData.stok}</p>
          <div class="product-action">
            <button class="btn btn-success add-to-cart">Masukkan Keranjang</button>
            <button class="btn btn-danger buy-now">Beli Sekarang</button>
          </div>
        </div>
      `;

    const descriptionCard = document.createElement("div");
    descriptionCard.className = "col-12";

    descriptionCard.innerHTML = `
        <div class="product-card">
          <h2 class="product-title-description">Deskripsi ${productData.namaBarang}</h2>
          <p class="product-details">${productData.deskripsi}</p>
        </div>
      `;

    productContainer.appendChild(productCard);
    productContainer.appendChild(descriptionCard);

    // Add to Cart functionality
    const addToCartButton = productCard.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", function () {
      synchronizeCart();
      addToCart(productData);
    });

    // Buy Now functionality
    const buyNowButton = productCard.querySelector(".buy-now");
    buyNowButton.addEventListener("click", function () {
      synchronizeCart();
      buyNow(productData);
    });
  } else {
    productContainer.innerHTML = "<p>Produk tidak ditemukan.</p>";
  }
});

function synchronizeCart() {
  let cart = JSON.parse(localStorage.getItem("keranjang")) || [];
  let barangList = JSON.parse(localStorage.getItem("barangList")) || [];

  // Update cart based on the current barangList
  cart = cart.map(cartItem => {
    let updatedItem = barangList.find(item => item.namaBarang === cartItem.namaBarang);
    if (updatedItem) {
      // Update quantity to match stock if needed
      cartItem.stok = updatedItem.stok;
      if (cartItem.jumlah > updatedItem.stok) {
        cartItem.jumlah = updatedItem.stok;
      }
    }
    return cartItem;
  });

  // Remove items from cart if they no longer exist in barangList
  cart = cart.filter(cartItem => barangList.some(item => item.namaBarang === cartItem.namaBarang));

  localStorage.setItem("keranjang", JSON.stringify(cart));
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Check if the product is already in the cart
  // Check if the product is in the cart and update quantity
  let productInCart = cart.find(item => item.namaBarang === product.namaBarang);

  if (product.stok === 0) {
    alert("Stok tidak cukup!");
    return;
  }

  if (productInCart) {
    alert("Produk sudah ada di keranjang!");
    return;
    // Update quantity if within stock limits
    if (productInCart.jumlah < product.stok) {
      productInCart.jumlah += 1;
    } else {
      alert("Jumlah melebihi stok!");
      return;
    }
  } else {
    cart.push({ ...product, jumlah: 1 });
  }

  localStorage.setItem("keranjang", JSON.stringify(cart));
  alert("Produk telah ditambahkan ke keranjang!");
}

function buyNow(product) {
  let barangList = JSON.parse(localStorage.getItem("barangList")) || [];

  for (let i = 0; i < barangList.length; i++) {
    if (barangList[i].namaBarang === product.namaBarang) {
      if (barangList[i].stok > 0) {
        barangList[i].stok -= 1;
        localStorage.setItem("barangList", JSON.stringify(barangList));

        // Update cart
        synchronizeCart();

        alert("Pembelian berhasil!");
        return window.location.reload();
      } else {
        alert("Stok tidak cukup!");
        return;
      }
    }
  }

  alert("Produk tidak ditemukan di daftar barang!");
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}
