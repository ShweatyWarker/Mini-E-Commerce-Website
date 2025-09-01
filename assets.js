// Base API
const API_URL = "https://dummyjson.com";

// LOGIN
$("#loginForm").on("submit", function (e) {
  e.preventDefault();

  let username = $("#username").val().trim();
  let password = $("#password").val().trim();

  if (!username || !password) {
    $("#errorMsg").text("Both fields are required!");
    return;
  }

  $.ajax({
    url: `${API_URL}/auth/login`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ username, password }),
    success: function (res) {
      localStorage.setItem("token", res.token);
      window.location.href = "products.html";
    },
    error: function () {
      $("#errorMsg").text("Invalid username or password!");
    }
  });
});

// PRODUCTS
if (window.location.pathname.includes("products.html")) {
  let token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html"; // not logged in
  }

  $.get(`${API_URL}/products`, function (data) {
    let products = data.products;
    let output = "";

    products.forEach(product => {
      output += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${product.thumbnail}" class="card-img-top" style="height:200px; object-fit:cover;">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description.substring(0, 60)}...</p>
              <p class="fw-bold">$${product.price}</p>
              <button class="btn btn-primary">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
    });

    $("#productList").html(output);
  });

  // Logout
  $("#logoutBtn").on("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
}