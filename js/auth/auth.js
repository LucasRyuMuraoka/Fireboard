// Verificar se o usuário está logado em todas as páginas
auth.onAuthStateChanged(user => {
    // Obtém o caminho da página atual
    const currentPath = window.location.pathname;
    
    // Verifica se é a página de dashboard
    if (currentPath.includes('dashboard.html')) {
        if (!user) {
            // Redirecionar para a página de login se não estiver autenticado
            window.location.href = 'index.html';
        } else {
            // Se estiver na dashboard, carrega as informações do usuário
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = user.displayName || user.email;
            }
            
            // Se existir um botão de logout, adiciona o evento de clique
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    auth.signOut()
                        .then(() => {
                            window.location.href = 'index.html';
                        })
                        .catch(error => {
                            console.error('Erro ao fazer logout:', error);
                        });
                });
            }
        }
    } else if ((currentPath.includes('index.html') || currentPath.includes('signup.html')) && user) {
        // Se já estiver logado e tentar acessar login ou signup, redireciona para dashboard
        window.location.href = 'dashboard.html';
    }
});

// Função para mostrar mensagens de erro (utilizada por login.js e signup.js)
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = 'red';
    } else {
        console.error('Elemento para exibir erro não encontrado:', elementId);
    }
}