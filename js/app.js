let userService;

function inicializarApp() {
  userService = new UserService();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("Usuário autenticado:", user.email);
      userService.carregarUsers();
    } else {
      console.log("Usuário não autenticado, redirecionando...");
      if (
        !window.location.pathname.includes("login.html") &&
        !window.location.pathname.includes("signup.html")
      ) {
        window.location.href = "login.html";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", inicializarApp);
