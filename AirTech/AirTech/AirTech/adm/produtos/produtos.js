document.addEventListener('DOMContentLoaded', function () {
  const AirTechDB = {
    products: JSON.parse(localStorage.getItem("airtech_products")) || [],
    
    initSampleData() {
      if (this.products.length === 0) {
        this.products = [
          {
            name: "Ar Condicionado 12000 BTU",
            category: "Ar Condicionado",
            quantity: 4,
            minQuantity: 2,
            price: 1999.90,
            supplier: "Fornecedor A"
          },
          {
            name: "Ar Condicionado 10000 BTU",
            category: "Ar Condicionado",
            quantity: 0,
            minQuantity: 2,
            price: 1799.90,
            supplier: "Fornecedor B"
          },
          {
            name: "Ar Condicionado 250 BTU",
            category: "Ar Condicionado",
            quantity: 8,
            minQuantity: 3,
            price: 899.90,
            supplier: "Fornecedor C"
          }
        ];
        this.saveDataToLocalStorage();
      }
    },

    saveDataToLocalStorage() {
      localStorage.setItem("airtech_products", JSON.stringify(this.products));
    }
  };

  // Inicializa dados
  AirTechDB.initSampleData();

  // Verifica usuário logado
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = "../../index.html";
    return;
  }

  let selectedProductIndex = null;

  // Carrega produtos
  function loadProductsList() {
    const products = AirTechDB.products;
    const container = document.querySelector('.listing-items');
    
    // Limpa container
    container.innerHTML = '';

    // Se não há produtos
    if (products.length === 0) {
      container.innerHTML = '<div class="no-products">Nenhum produto cadastrado</div>';
      return;
    }

    // Adiciona cada produto
    products.forEach((product, index) => {
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
        </div>
        <div class="status ${statusClass}">${statusText}</div>
      `;

      // Adiciona evento de clique
      item.addEventListener('click', () => {
        // Remove seleção anterior
        document.querySelectorAll('.listing-item').forEach(el => {
          el.classList.remove('selected');
        });
        
        // Adiciona seleção ao item atual
        item.classList.add('selected');
        selectedProductIndex = index;
      });

      container.appendChild(item);
    });
  }

  // Configura botões de ação
  function setupActionButtons() {
    // Botão Adicionar
    document.getElementById('btn-add-product').addEventListener('click', () => {
      selectedProductIndex = null;
      showProductForm();
    });

    // Botão Editar
    document.getElementById('btn-edit-product').addEventListener('click', () => {
      if (selectedProductIndex === null) {
        alert("Por favor, clique em um produto na lista para selecioná-lo antes de editar.");
        return;
      }
      showProductForm(AirTechDB.products[selectedProductIndex], selectedProductIndex);
    });

    // Botão Remover
    document.getElementById('btn-remove-product').addEventListener('click', () => {
      if (selectedProductIndex === null) {
        alert("Por favor, clique em um produto na lista para selecioná-lo antes de remover.");
        return;
      }
      
      if (confirm(`Tem certeza que deseja remover o produto "${AirTechDB.products[selectedProductIndex].name}"?`)) {
        AirTechDB.products.splice(selectedProductIndex, 1);
        AirTechDB.saveDataToLocalStorage();
        selectedProductIndex = null;
        loadProductsList();
        alert("Produto removido com sucesso!");
      }
    });
  }

  // Mostra formulário de produto
  function showProductForm(product = null, index = null) {
    const isEdit = product !== null;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3>${isEdit ? 'Editar Produto' : 'Cadastrar Produto'}</h3>
        <form id="product-form">
          <div class="form-group">
            <label for="product-name">Nome</label>
            <input type="text" id="product-name" value="${product?.name || ''}" required>
          </div>
          <div class="form-group">
            <label for="product-category">Categoria</label>
            <input type="text" id="product-category" value="${product?.category || ''}" required>
          </div>
          <div class="form-group">
            <label for="product-quantity">Quantidade</label>
            <input type="number" id="product-quantity" value="${product?.quantity || ''}" min="0" required>
          </div>
          <div class="form-group">
            <label for="product-min-quantity">Quantidade Mínima</label>
            <input type="number" id="product-min-quantity" value="${product?.minQuantity || ''}" min="0" required>
          </div>
          <div class="form-group">
            <label for="product-price">Preço (R$)</label>
            <input type="number" step="0.01" id="product-price" value="${product?.price || ''}" min="0" required>
          </div>
          <div class="form-group">
            <label for="product-supplier">Fornecedor</label>
            <input type="text" id="product-supplier" value="${product?.supplier || ''}" required>
          </div>
          <button type="submit" class="btn-submit">${isEdit ? 'Atualizar' : 'Cadastrar'}</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Fechar modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Submit do formulário
    modal.querySelector('#product-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newProduct = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        quantity: parseInt(document.getElementById('product-quantity').value),
        minQuantity: parseInt(document.getElementById('product-min-quantity').value),
        price: parseFloat(document.getElementById('product-price').value),
        supplier: document.getElementById('product-supplier').value
      };

      if (isEdit) {
        AirTechDB.products[index] = newProduct;
      } else {
        AirTechDB.products.push(newProduct);
      }

      AirTechDB.saveDataToLocalStorage();
      loadProductsList();
      document.body.removeChild(modal);
      alert(`Produto ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`);
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

  // Inicializa a página
  loadProductsList();
  setupActionButtons();
});