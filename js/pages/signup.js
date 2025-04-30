// Função para registrar novo usuário
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validação de senha
        if (password !== confirmPassword) {
            showError('errorMessage', 'As senhas não coincidem.');
            return;
        }
        
        // Criando o usuário no Firebase Authentication
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Atualizar o perfil do usuário com o nome
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                // Salvar dados adicionais do usuário no Firestore (mas SEM a senha)
                const user = auth.currentUser;
                return firebase.firestore().collection('user').doc(user.uid).set({
                    name: name,
                    email: email,
                    // Removido o armazenamento da senha no Firestore (prática de segurança)
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                // Redirecionar para o dashboard após o cadastro
                window.location.href = 'dashboard.html';
            })
            .catch(error => {
                // Tratamento de erros
                let errorMessage = 'Ocorreu um erro ao criar a conta.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'Este email já está em uso.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email inválido.';
                }
                showError('errorMessage', errorMessage);
                console.error(error);
            });
    });
}