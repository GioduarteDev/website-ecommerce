async function cadastrarUsuario(nome, email, senha) {
    try {
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST', // Método HTTP POST para criar algo
            headers: {
                'Content-Type': 'application/json' // Informa que estamos enviando JSON
            },
            body: JSON.stringify({ nome, email, senha }) // Converte o objeto JS para JSON
        });

        const data = await response.json(); // Pega a resposta do backend

        if (response.ok) { // Cadastro bem-sucedido (status 201 Created)
            console.log('Cadastro realizado com sucesso:', data.message);
            // Redirecionar para a página de login ou exibir mensagem de sucesso
        } else { // Erro no cadastro
            console.error('Erro ao cadastrar:', data.error);
            // Exibir mensagem de erro para o usuário
        }
    } catch (error) {
        console.error('Erro na requisição de cadastro:', error);
    }
}

