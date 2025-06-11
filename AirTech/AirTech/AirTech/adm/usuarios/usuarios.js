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


    // Elementos do DOM
    const btnCadastrar = document.getElementById('btnCadastrar');
    const btnEditar = document.getElementById('btnEditar');
    const btnRemover = document.getElementById('btnRemover');
    const userModal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const userForm = document.getElementById('userForm');
    const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    const totalUsers = document.getElementById('totalUsers');
    
    // Carrega os usuários do LocalStorage
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('airtech_users')) || [];
        usersTable.innerHTML = '';
        
        users.forEach((user, index) => {
            const row = usersTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role === 'administrativo' ? 'Administrativo' : 'Operacional'}</td>
            `;
            
            // Adiciona evento de clique para seleção
            row.addEventListener('click', function() {
                // Remove a seleção de outras linhas
                const rows = usersTable.getElementsByTagName('tr');
                for (let r of rows) {
                    r.classList.remove('selected');
                }
                
                // Seleciona a linha clicada
                this.classList.add('selected');
                this.setAttribute('data-user-id', index);
            });
        });
        
        totalUsers.textContent = users.length;
    }
    
    // Abre o modal para cadastrar novo usuário
    btnCadastrar.addEventListener('click', function() {
        modalTitle.textContent = 'Cadastrar Novo Usuário';
        userForm.reset();
        document.getElementById('userId').value = '';
        userModal.style.display = 'block';
    });
    
    // Abre o modal para editar usuário selecionado
    btnEditar.addEventListener('click', function() {
        const selectedRow = usersTable.querySelector('tr.selected');
        if (!selectedRow) {
            alert('Por favor, selecione um usuário para editar.');
            return;
        }
        
        const userId = selectedRow.getAttribute('data-user-id');
        const users = JSON.parse(localStorage.getItem('airtech_users')) || [];
        const user = users[userId];
        
        if (user) {
            modalTitle.textContent = 'Editar Usuário';
            document.getElementById('userId').value = userId;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').value = user.password;
            document.getElementById('userRole').value = user.role;
            userModal.style.display = 'block';
        }
    });
    
    // Remove usuário selecionado
    btnRemover.addEventListener('click', function() {
        const selectedRow = usersTable.querySelector('tr.selected');
        if (!selectedRow) {
            alert('Por favor, selecione um usuário para remover.');
            return;
        }
        
        if (confirm('Tem certeza que deseja remover este usuário?')) {
            const userId = selectedRow.getAttribute('data-user-id');
            const users = JSON.parse(localStorage.getItem('airtech_users')) || [];
            
            // Não permite remover o último admin
            const admins = users.filter(u => u.role === 'administrativo');
            if (users[userId].role === 'administrativo' && admins.length <= 1) {
                alert('Não é possível remover o último usuário administrativo.');
                return;
            }
            
            users.splice(userId, 1);
            localStorage.setItem('airtech_users', JSON.stringify(users));
            loadUsers();
            alert('Usuário removido com sucesso!');
        }
    });
    
    // Submissão do formulário (criar/editar)
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const password = document.getElementById('userPassword').value.trim();
        const role = document.getElementById('userRole').value;
        
        const users = JSON.parse(localStorage.getItem('airtech_users')) || [];
        
        // Verifica se o email já existe (exceto quando estiver editando o mesmo usuário)
        if ((userId === '' || users[userId].email !== email) && 
            users.some(u => u.email === email)) {
            alert('Este email já está cadastrado.');
            return;
        }
        
        if (userId === '') {
            // Novo usuário
            users.push({
                name: name,
                email: email,
                password: password,
                role: role
            });
        } else {
            // Editar usuário existente
            users[userId] = {
                name: name,
                email: email,
                password: password,
                role: role
            };
        }
        
        localStorage.setItem('airtech_users', JSON.stringify(users));
        userModal.style.display = 'none';
        loadUsers();
        alert('Usuário salvo com sucesso!');
    });
    
    // Fechar modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        userModal.style.display = 'none';
    });
    
    // Carrega os usuários ao iniciar
    loadUsers();
});