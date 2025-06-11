document.addEventListener("DOMContentLoaded", function () {
  // Verifica usuário logado
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "../../index.html";
    return;
  }

  // Atualizar informações do usuário
  document.getElementById("userName").textContent = currentUser.name;
  document.getElementById("userRole").textContent = "Operacional";
  document.getElementById("welcome-message").textContent = `Bem-vindo, ${currentUser.name}. Aqui está o resumo do estoque.`;
  
  // Avatar com iniciais
  const avatar = currentUser.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  document.getElementById("userAvatar").textContent = avatar;

  // Função para carregar e exibir os produtos
  function loadProducts() {
    const products = JSON.parse(localStorage.getItem("airtech_products")) || [];
    
    // Atualiza estatísticas
    document.getElementById("totalProducts").textContent = products.length;
    
    const lowStockProducts = products.filter(p => p.quantity < p.minQuantity);
    document.getElementById("lowStockProducts").textContent = lowStockProducts.length;
    
    // Produtos com estoque crítico
    const criticalList = document.getElementById("criticalProductsList");
    criticalList.innerHTML = "";
    
    if (lowStockProducts.length === 0) {
      criticalList.innerHTML = '<div class="no-products">Nenhum produto com estoque crítico</div>';
    } else {
      lowStockProducts.slice(0, 4).forEach(product => {
        const statusClass = product.quantity === 0 ? "out" : "low";
        const statusText = product.quantity === 0 ? "Sem estoque" : "Baixo estoque";
        
        criticalList.innerHTML += `
          <div class="listing-item">
            <div class="item-info">
              <div class="name">${product.name}</div>
              <div class="details">Quantidade: ${product.quantity} unidades (Mín: ${product.minQuantity})</div>
            </div>
            <div class="status ${statusClass}">${statusText}</div>
          </div>
        `;
      });
    }
    
    // Produtos recentes (últimos cadastrados)
    const recentList = document.getElementById("recentProductsList");
    recentList.innerHTML = "";
    
    const recentProducts = products.slice(-4).reverse();
    if (recentProducts.length === 0) {
      recentList.innerHTML = '<div class="no-products">Nenhum produto cadastrado</div>';
    } else {
      recentProducts.forEach(product => {
        let statusClass = "stock", statusText = "Em estoque";
        if (product.quantity === 0) {
          statusClass = "out";
          statusText = "Sem estoque";
        } else if (product.quantity < product.minQuantity) {
          statusClass = "low";
          statusText = "Baixo estoque";
        }
        
        recentList.innerHTML += `
          <div class="listing-item">
            <div class="item-info">
              <div class="name">${product.name}</div>
              <div class="details">Quantidade: ${product.quantity} unidades</div>
            </div>
            <div class="status ${statusClass}">${statusText}</div>
          </div>
        `;
      });
    }
  }

  // Atualiza os produtos a cada 5 segundos
  loadProducts();
  setInterval(loadProducts, 5000);

  // Abrir/fechar o menu de logout
  const profileToggle = document.getElementById("profileToggle");
  const logoutMenu = document.getElementById("logoutMenu");

  profileToggle.addEventListener("click", () => {
    logoutMenu.style.display = logoutMenu.style.display === "block" ? "none" : "block";
  });

  // Logout
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("currentUser");
    window.location.href = "../../index.html";
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