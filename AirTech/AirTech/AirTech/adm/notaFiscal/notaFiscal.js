document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu mobile
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    // Toggle do menu mobile
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Fechar menu ao clicar no overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    // "Banco de dados" de notas fiscais
    const AirTechDB = {
        notas: JSON.parse(localStorage.getItem('airtech_notas')) || [],
        
        initSampleData() {
            if (this.notas.length === 0) {
                this.notas = [
                    {
                        numero: 'NF-2023-0001',
                        fornecedor: 'Fornecedor Exemplo',
                        data: '2023-01-15',
                        valor: 1250.99,
                        status: 'pago'
                    },
                    {
                        numero: 'NF-2023-0002',
                        fornecedor: 'Distribuidora ABC',
                        data: '2023-02-20',
                        valor: 899.50,
                        status: 'pendente'
                    }
                ];
                this.saveData();
            }
        },
        
        saveData() {
            localStorage.setItem('airtech_notas', JSON.stringify(this.notas));
        }
    };

    // Inicializa dados
    AirTechDB.initSampleData();
    
    let selectedNotaIndex = null;

    // Carrega a lista de notas
    function loadNotas() {
        const notasList = document.getElementById('notasList');
        notasList.innerHTML = '';
        
        if (AirTechDB.notas.length === 0) {
            notasList.innerHTML = '<div class="no-notas">Nenhuma nota fiscal cadastrada</div>';
            document.getElementById('totalNotas').textContent = '0';
            return;
        }
        
        AirTechDB.notas.forEach((nota, index) => {
            const item = document.createElement('div');
            item.className = 'listing-item';
            
            item.innerHTML = `
                <div class="item-info">
                    <div class="name">${nota.numero} - ${nota.fornecedor}</div>
                    <div class="details">
                        Data: ${formatDate(nota.data)} | 
                        Valor: R$ ${nota.valor.toFixed(2)} | 
                        Status: <span class="status ${nota.status}">${formatStatus(nota.status)}</span>
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                document.querySelectorAll('.listing-item').forEach(el => {
                    el.classList.remove('selected');
                });
                item.classList.add('selected');
                selectedNotaIndex = index;
            });
            
            notasList.appendChild(item);
        });
        
        document.getElementById('totalNotas').textContent = AirTechDB.notas.length;
    }
    
    // Formata a data para exibição
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
    
    // Formata o status para exibição
    function formatStatus(status) {
        const statusMap = {
            'pendente': 'Pendente',
            'pago': 'Pago',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    }
    
    // Mostra o formulário de nota fiscal
    function showNotaForm(nota = null, index = null) {
        const isEdit = nota !== null;
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>${isEdit ? 'Editar Nota Fiscal' : 'Cadastrar Nota Fiscal'}</h3>
                <form id="notaForm">
                    <div class="form-group">
                        <label for="notaNumero">Número da Nota</label>
                        <input type="text" id="notaNumero" value="${nota?.numero || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="notaFornecedor">Fornecedor</label>
                        <input type="text" id="notaFornecedor" value="${nota?.fornecedor || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="notaData">Data de Emissão</label>
                        <input type="date" id="notaData" value="${nota?.data || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="notaValor">Valor Total (R$)</label>
                        <input type="number" step="0.01" id="notaValor" value="${nota?.valor || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="notaStatus">Status</label>
                        <select id="notaStatus" required>
                            <option value="pendente" ${nota?.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                            <option value="pago" ${nota?.status === 'pago' ? 'selected' : ''}>Pago</option>
                            <option value="cancelado" ${nota?.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                        </select>
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
        modal.querySelector('#notaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newNota = {
                numero: document.getElementById('notaNumero').value.trim(),
                fornecedor: document.getElementById('notaFornecedor').value.trim(),
                data: document.getElementById('notaData').value,
                valor: parseFloat(document.getElementById('notaValor').value),
                status: document.getElementById('notaStatus').value
            };
            
            if (isEdit) {
                AirTechDB.notas[index] = newNota;
            } else {
                AirTechDB.notas.push(newNota);
            }
            
            AirTechDB.saveData();
            loadNotas();
            document.body.removeChild(modal);
            alert(`Nota fiscal ${isEdit ? 'atualizada' : 'cadastrada'} com sucesso!`);
        });
    }
    
    // Configura os botões de ação
    function setupActionButtons() {
        // Cadastrar
        document.getElementById('btnCadastrarNota').addEventListener('click', () => {
            selectedNotaIndex = null;
            showNotaForm();
        });
        
        // Editar
        document.getElementById('btnEditarNota').addEventListener('click', () => {
            if (selectedNotaIndex === null) {
                alert('Por favor, selecione uma nota para editar.');
                return;
            }
            showNotaForm(AirTechDB.notas[selectedNotaIndex], selectedNotaIndex);
        });
        
        // Remover
        document.getElementById('btnRemoverNota').addEventListener('click', () => {
            if (selectedNotaIndex === null) {
                alert('Por favor, selecione uma nota para remover.');
                return;
            }
            
            if (confirm(`Tem certeza que deseja remover a nota ${AirTechDB.notas[selectedNotaIndex].numero}?`)) {
                AirTechDB.notas.splice(selectedNotaIndex, 1);
                AirTechDB.saveData();
                selectedNotaIndex = null;
                loadNotas();
                alert('Nota fiscal removida com sucesso!');
            }
        });
        
        // Exportar
        document.getElementById('btnExportar').addEventListener('click', () => {
            if (AirTechDB.notas.length === 0) {
                alert('Não há notas para exportar.');
                return;
            }
            
            const dataStr = JSON.stringify(AirTechDB.notas, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `notas-fiscais-${new Date().toISOString().slice(0,10)}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            alert('Dados exportados com sucesso!');
        });
    }
    
    // Inicializa a página
    loadNotas();
    setupActionButtons();
});