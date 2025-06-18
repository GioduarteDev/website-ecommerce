async function fazerLogin(email, senha) {
    try {
        const response = await fetch('http://127.0.0.1:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Login realizado com sucesso:', data.message);
            console.log('👤 Usuário:', data.nome, data.email, data.userId);

            // Salva no localStorage (caso queira usar depois)
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userNome', data.nome);

            // Redireciona para produtos ou dashboard
            window.location.href = '/frontend/produtos.html';
        } else {
            console.error('❌ Erro no login:', data.error || 'Email ou senha incorretos');
            alert(data.error || 'Email ou senha incorretos');
        }
    } catch (error) {
        console.error('🚨 Erro ao conectar com o servidor:', error);
        alert('Erro ao conectar com o servidor');
    }
}
