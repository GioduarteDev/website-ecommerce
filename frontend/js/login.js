// Função de login atualizada com tratamento completo de erros
async function handleLogin(email, senha) {
    try {
        // Validação básica antes de enviar
        if (!email || !senha) {
            showMessage(loginAlert, 'Por favor, preencha todos os campos', false);
            return;
        }

        // Limpa o localStorage antes do novo login
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');

        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        // Verifica se a resposta é JSON válido
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Erro ao parsear JSON:', jsonError);
            throw new Error('Resposta inválida do servidor');
        }

        if (!response.ok) {
            // Trata erros conhecidos do servidor
            const errorMessage = data.error || 'Erro desconhecido no login';
            console.error('❌ Erro no login:', errorMessage);
            showMessage(loginAlert, errorMessage, false);
            return;
        }

        // Sucesso no login
        console.log('✅ Login realizado com sucesso:', data.message);
        console.log('👤 Usuário:', data.nome, data.email, data.userId);

        // Armazena os dados de autenticação
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.nome);

        // Mostra mensagem de sucesso
        showMessage(loginAlert, 'Login realizado com sucesso! Redirecionando...', true);

        // Redireciona após 1 segundo
        setTimeout(() => {
            window.location.href = '../fundoprincipal/index.html';
        }, 1000);

    } catch (error) {
        console.error('❌ Erro durante o login:', error);
        
        // Mensagens amigáveis para diferentes tipos de erro
        let errorMessage = 'Erro durante o login';
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Não foi possível conectar ao servidor';
        } else if (error.message.includes('Resposta inválida')) {
            errorMessage = 'Servidor retornou resposta inválida';
        }
        
        showMessage(loginAlert, errorMessage, false);
    }
}

// Função de cadastro atualizada
async function handleRegister(nome, email, senha, confirmSenha) {
    try {
        // Validações básicas
        if (!nome || !email || !senha || !confirmSenha) {
            showMessage(registerAlert, 'Por favor, preencha todos os campos', false);
            return false;
        }

        if (senha !== confirmSenha) {
            showMessage(registerAlert, 'As senhas não coincidem', false);
            return false;
        }

        if (senha.length < 6) {
            showMessage(registerAlert, 'A senha deve ter pelo menos 6 caracteres', false);
            return false;
        }

        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        });

        // Verifica se a resposta é JSON válido
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Erro ao parsear JSON:', jsonError);
            throw new Error('Resposta inválida do servidor');
        }

        if (!response.ok) {
            const errorMessage = data.error || 'Erro desconhecido no cadastro';
            console.error('❌ Erro no cadastro:', errorMessage);
            showMessage(registerAlert, errorMessage, false);
            return false;
        }

        // Sucesso no cadastro
        console.log('✅ Cadastro realizado:', data.message);
        showMessage(registerAlert, 'Cadastro realizado com sucesso!', true);

        // Limpa o formulário e volta para o login
        setTimeout(() => {
            registerForm.reset();
            card.classList.remove('flipped');
            clearAlerts();
        }, 1500);

        return true;

    } catch (error) {
        console.error('❌ Erro durante o cadastro:', error);
        
        let errorMessage = 'Erro durante o cadastro';
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Não foi possível conectar ao servidor';
        }
        
        showMessage(registerAlert, errorMessage, false);
        return false;
    }
}

// Event Listeners atualizados
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginPassword').value;
    await handleLogin(email, senha);
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const senha = document.getElementById('regPassword').value;
    const confirmSenha = document.getElementById('regConfirmPassword').value;
    await handleRegister(nome, email, senha, confirmSenha);
});