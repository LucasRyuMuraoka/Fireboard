// Função para login de usuário
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Fazer login com Firebase Authentication
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                // Redirecionar para o dashboard após o login
                window.location.href = 'dashboard.html';
            })
            .catch(error => {
                // Tratamento de erros
                let errorMessage = 'Ocorreu um erro ao fazer login.';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'Usuário não encontrado.';
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Senha incorreta.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email inválido.';
                } else if (error.code === 'auth/user-disabled') {
                    errorMessage = 'Este usuário foi desativado.';
                }
                showError('errorMessage', errorMessage);
                console.error(error);
            });
    });
}

// Função para recuperação de senha
const forgotPasswordLink = document.getElementById('forgotPassword');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', e => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        if (!email) {
            showError('errorMessage', 'Informe seu email para recuperar a senha.');
            return;
        }
        
        // Enviar email de recuperação de senha
        auth.sendPasswordResetEmail(email)
            .then(() => {
                const errorElement = document.getElementById('errorMessage');
                errorElement.textContent = 'Email de recuperação enviado. Verifique sua caixa de entrada.';
                errorElement.style.color = 'green';
            })
            .catch(error => {
                let errorMessage = 'Erro ao enviar email de recuperação.';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'Não há usuário registrado com este email.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email inválido.';
                }
                showError('errorMessage', errorMessage);
            });
    });
}