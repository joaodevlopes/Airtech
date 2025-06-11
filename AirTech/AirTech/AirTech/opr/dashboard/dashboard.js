document.addEventListener('DOMContentLoaded', function () {
  // Verifica usuário logado
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = "../../index.html";
    return;
  }

  // Carrega produtos do localStorage do admin
  function loadProductsList() {
    const products = JSON.parse(localStorage.getItem("airtech_products")) || [];
    const container = document.getElementById('products-list');
    
    // Limpa container
    container.innerHTML = '';

    // Se não há produtos
    if (products.length === 0) {
      container.innerHTML = '<div class="no-products">Nenhum produto cadastrado</div>';
      return;
    }

    // Adiciona cada produto
    products.forEach((product) => {
      const item = document.createElement('div');
      item.className = 'listing-item';
      
      // Determina status
      let statusClass = 'stock', statusText = 'Em estoque';
      if (product.quantity === 0) {
        statusClass = 'out';
        statusText = 'Sem estoque';
      } else if (product.quantity < product.minQuantity) {
        statusClass = 'low';
        statusText = 'Baixo estoque';
      }

      item.innerHTML = `
        <div class="item-info">
          <div class="name">${product.name}</div>
          <div class="details">Quantidade: ${product.quantity} unidades</div>
          <div class="details">Categoria: ${product.category}</div>
          <div class="details">Preço: R$ ${product.price.toFixed(2)}</div>
        </div>
        <div class="status ${statusClass}">${statusText}</div>
      `;

      container.appendChild(item);
    });
  }

  // Menu mobile
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Atualiza a lista de produtos periodicamente (a cada 5 segundos)
  loadProductsList();
  setInterval(loadProductsList, 5000);
});