document.addEventListener('DOMContentLoaded', function() {
  const btnAdm = document.querySelector(".btn-adm");
  const btnOp = document.querySelector(".btn-op");
  const form = document.getElementById("formulario");
  let funcaoSelecionada = "";

  // Simula um "banco de dados" em Local Storage
  const AirTechDB = {
    users: [],

    loadDataFromLocalStorage() {
      const data = JSON.parse(localStorage.getItem("airtech_users")) || [];
      this.users = data;
    },

    saveDataToLocalStorage() {
      localStorage.setItem("airtech_users", JSON.stringify(this.users));
    },

    createDefaultAdmin() {
      if (this.users.length === 0) {
        this.users.push({
          name: "Administrador",
          email: "admin@airtech.com",
          password: "1234",
          role: "administrativo"
        });
        this.saveDataToLocalStorage();
      }
    }
  };

  AirTechDB.loadDataFromLocalStorage();
  AirTechDB.createDefaultAdmin(); // Cria um admin padrão, caso não existam usuários

  // Seleção de função
  btnAdm.addEventListener("click", function() {
    btnAdm.classList.add("selected");
    btnOp.classList.remove("selected");
    funcaoSelecionada = "administrativo";
  });

  btnOp.addEventListener("click", function() {
    btnOp.classList.add("selected");
    btnAdm.classList.remove("selected");
    funcaoSelecionada = "operacional";
  });

  // Processar login
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!funcaoSelecionada) {
      alert("Por favor, selecione uma função.");
      return;
    }

    // Verifica credenciais
    const user = AirTechDB.users.find(u =>
      u.email === email &&
      u.password === senha &&
      u.role === funcaoSelecionada
    );

    if (user) {
      // Atualiza nome, se necessário
      if (user.name !== nome) {
        user.name = nome;
        AirTechDB.saveDataToLocalStorage();
      }

      sessionStorage.setItem("currentUser", JSON.stringify(user));

        if(user.role === "administrativo"){
          window.location.href = "adm/dashboard/dashboard.html";
          } else if (user.role === "operacional") {
            window.location.href = "opr/dashboard-operacional/dashboard-operacional.html";
          }

      
    } else {
      alert("Credenciais inválidas ou função incorreta.");
    }
  });
});