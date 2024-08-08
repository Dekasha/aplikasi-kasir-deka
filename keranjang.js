$(document).ready(function () {
    displayCart();

    // Function to display cart data
    function displayCart() {
        let cart = JSON.parse(localStorage.getItem("keranjang")) || [];
        let html = "";

        cart.forEach(function (item, index) {
            html += `
          <tr>
              <td>${index + 1}</td>
              <td>${item.namaBarang}</td>
              <td>${formatRupiah(item.harga)}</td>
              <td>
                  <input type="number" class="quantity" data-index="${index}" value="${item.jumlah}" min="1" max="${item.stok}">
              </td>
              <td class="total">${formatRupiah(item.harga * item.jumlah)}</td>
          </tr>
          `;
        });

        $("#dataKeranjang").html(html);
    }

    // Update total price when quantity changes
    $("#dataKeranjang").on("input", ".quantity", function () {
        let index = $(this).data("index");
        let newQuantity = $(this).val();
        let cart = JSON.parse(localStorage.getItem("keranjang")) || [];
        let item = cart[index];

        // Check if new quantity exceeds stock
        if (newQuantity > item.stok) {
            alert("Jumlah melebihi stok!");
            $(this).val(item.jumlah); // Reset to original quantity
            return;
        }

        // Update quantity and total in localStorage
        item.jumlah = parseInt(newQuantity, 10);
        localStorage.setItem("keranjang", JSON.stringify(cart));

        // Update total in the table
        $(this).closest("tr").find(".total").text(formatRupiah(item.harga * item.jumlah));
    });

    // Checkout button click handler
    $(".btn-primary").click(function () {
        let cart = JSON.parse(localStorage.getItem("keranjang")) || [];
        let barangList = JSON.parse(localStorage.getItem("barangList")) || [];

        cart.forEach(function (cartItem) {
            // Find the item in barangList
            let barang = barangList.find(b => b.namaBarang === cartItem.namaBarang);
            if (barang) {
                // Update the stock in barangList
                barang.stok -= cartItem.jumlah;

                // Ensure stock doesn't go below zero
                if (barang.stok < 0) {
                    alert(`Stok untuk ${barang.namaBarang} tidak cukup!`);
                    barang.stok = 0;
                }
            }
        });

        // Save the updated barangList back to localStorage
        localStorage.setItem("barangList", JSON.stringify(barangList));

        // Clear the cart
        localStorage.removeItem("keranjang");

        // Refresh the cart display
        displayCart();

        alert("Checkout berhasil! Keranjang telah dikosongkan.");
    });

    // Function to format currency
    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }
});
