document.addEventListener("DOMContentLoaded", function () {
  const AirTechDB = {
    products: JSON.parse(localStorage.getItem("airtech_products")) || [],
    deliveries: JSON.parse(localStorage.getItem("airtech_deliveries")) || [],

    getLowStockProducts() {
      return this.products.filter((p) => p.quantity < p.minQuantity);
    },

    getPendingDeliveries() {
      return this.deliveries.filter(
        (d) => d.status === "agendada" || d.status === "em_transito"
      );
    },
  };

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "../../index.html";
    return;
  }

  // Atualizar nome e cargo
  document.querySelector(".nome-usuario").textContent = currentUser.name;
  document.querySelector(".user-info small").textContent =
    currentUser.role === "administrativo" ? "Administrador" : "Operacional";

  // Avatar com iniciais
  const avatar = currentUser.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  document.querySelector(".user-avatar").textContent = avatar;

  document.querySelector(
    ".header-title p"
  ).textContent = `Bem-vindo, ${currentUser.name}. Aqui está o que está acontecendo hoje.`;

  // Estatísticas
  document.querySelector(".stat-card:nth-child(1) h3").textContent =
    AirTechDB.products.length;
  document.querySelector(".stat-card:nth-child(2) h3").textContent =
    AirTechDB.getLowStockProducts().length;

  // Produtos Recentes
  const recentProductsContainer = document.querySelector(
    ".listing-card:nth-child(1) .listing-items"
  );
  recentProductsContainer.innerHTML = "";
  const recentProducts = AirTechDB.products.slice(-4);
  for (const product of recentProducts) {
    let statusClass = "stock",
      statusText = "Em estoque";
    if (product.quantity === 0) {
      statusClass = "out";
      statusText = "Sem estoque";
    } else if (product.quantity < product.minQuantity) {
      statusClass = "low";
      statusText = "Baixo estoque";
    }

    recentProductsContainer.innerHTML += `
      <div class="listing-item">
        <div class="item-info">
          <div class="name">${product.name}</div>
          <div class="details">Quantidade: ${product.quantity} unidades</div>
        </div>
        <div class="status ${statusClass}">${statusText}</div>
      </div>
    `;
  }

  // Abrir/fechar o menu de logout
  const profileToggle = document.getElementById("profileToggle");
  const logoutMenu = document.getElementById("logoutMenu");

  profileToggle.addEventListener("click", () => {
    logoutMenu.style.display =
      logoutMenu.style.display === "block" ? "none" : "block";
  });

  // Logout
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("currentUser");
    window.location.href = "../../index.html"; // ou a página de login que você usa
  });

  // Mobile Menu
  const mobileToggle = document.getElementById("mobileToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  mobileToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
});
