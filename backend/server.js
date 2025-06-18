const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =============================================================================
// CONFIGURAÇÃO DO SERVIDOR
// =============================================================================
const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto';

// --- CORREÇÃO 1: Configuração do CORS ---
// A configuração original era muito restritiva para desenvolvimento.
// A linha abaixo permite que qualquer origem (como seu arquivo HTML aberto localmente)
// se conecte a este servidor.
app.use(cors());

// --- CORREÇÃO 2: Servir arquivos estáticos ---
// Esta linha é nova e essencial. Ela diz ao Node.js para permitir o acesso
// direto aos arquivos da sua pasta 'frontend'. Sem isso, o navegador não
// consegue carregar o CSS, as imagens ou os scripts JS das suas páginas.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Permite que o servidor entenda requisições com corpo em JSON
app.use(express.json());

// =============================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// =============================================================================
// O caminho e a conexão com o banco de dados estão corretos.
const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('FALHA AO CONECTAR AO BANCO:', err.message);
        process.exit(1);
    }
    console.log('✅ Banco de dados conectado com sucesso.');
});

// CRIAÇÃO DAS TABELAS (se não existirem)
// Esta parte do seu código já estava correta.
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome TEXT NOT NULL, 
        email TEXT UNIQUE NOT NULL, 
        senha TEXT NOT NULL,
        dataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL 
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome TEXT NOT NULL, 
        descricao TEXT, 
        preco REAL NOT NULL, 
        urlImagem TEXT, 
        estoque INTEGER DEFAULT 0 NOT NULL
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS carrinho_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER NOT NULL,
        id_produto INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id) ON DELETE CASCADE,
        FOREIGN KEY (id_produto) REFERENCES produtos (id) ON DELETE CASCADE
    )`);
});

// FUNÇÕES DE BANCO DE DADOS (COM PROMISES)
// Esta seção está correta e não precisa de alterações.
function dbRun(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function dbGet(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function dbAll(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// =============================================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// Esta seção está correta e não precisa de alterações.
// =============================================================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Token não fornecido." });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido ou expirado." });
        req.user = user;
        next();
    });
};

// =============================================================================
// ROTAS DE AUTENTICAÇÃO (LOGIN / CADASTRO)
// As rotas de autenticação estão corretas. Apenas adaptei a mensagem de erro
// para ser mais consistente no login.
// =============================================================================
app.post('/auth/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const usuarioExistente = await dbGet('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (usuarioExistente) {
            return res.status(409).json({ error: 'Este email já está cadastrado.' });
        }
        const hashedPassword = await bcrypt.hash(senha, 10);
        const result = await dbRun(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hashedPassword]
        );
        res.status(201).json({ 
            message: 'Usuário registrado com sucesso!',
            userId: result.lastID
        });
    } catch (error) {
        console.error('ERRO NO REGISTRO:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }
        const user = await dbGet('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ 
            message: 'Login realizado com sucesso!',
            token,
            userId: user.id,
            nome: user.nome,
            email: user.email
        });
    } catch (error) {
        console.error('ERRO NO LOGIN:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// =============================================================================
// ROTAS DE PRODUTOS
// =============================================================================
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await dbAll("SELECT * FROM produtos WHERE estoque > 0");
        
        // --- CORREÇÃO 3: Simplificação da rota de produtos ---
        // A lógica de formatação da URL da imagem foi removida daqui.
        // O servidor agora envia apenas o nome do arquivo da imagem.
        // O frontend será responsável por montar o caminho completo.
        res.json(produtos);
        
    } catch (error) {
        console.error('ERRO AO BUSCAR PRODUTOS:', error);
        res.status(500).json({ error: 'Erro ao carregar produtos.' });
    }
});

// =============================================================================
// ROTAS DO CARRINHO (PROTEGIDAS)
// Esta seção está correta e não precisa de alterações.
// =============================================================================
app.get('/api/carrinho', authenticateToken, async (req, res) => {
    try {
        const itens = await dbAll(`
            SELECT p.id, p.nome, p.preco, p.urlImagem, ci.quantidade 
            FROM carrinho_itens ci 
            JOIN produtos p ON ci.id_produto = p.id 
            WHERE ci.id_usuario = ?
        `, [req.user.userId]);
        res.json(itens);
    } catch (error) {
        console.error('ERRO AO BUSCAR CARRINHO:', error);
        res.status(500).json({ error: 'Erro ao carregar carrinho.' });
    }
});

app.post('/api/carrinho', authenticateToken, async (req, res) => {
    try {
        const { id_produto, quantidade } = req.body;
        if (!id_produto || !quantidade || quantidade <= 0) {
            return res.status(400).json({ error: 'Dados do produto inválidos.' });
        }
        const produto = await dbGet('SELECT * FROM produtos WHERE id = ?', [id_produto]);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        const itemExistente = await dbGet(
            'SELECT * FROM carrinho_itens WHERE id_usuario = ? AND id_produto = ?',
            [req.user.userId, id_produto]
        );
        if (itemExistente) {
            const novaQuantidade = itemExistente.quantidade + quantidade;
            if (novaQuantidade > produto.estoque) {
                return res.status(400).json({ error: 'Estoque insuficiente.' });
            }
            await dbRun(
                'UPDATE carrinho_itens SET quantidade = ? WHERE id = ?',
                [novaQuantidade, itemExistente.id]
            );
        } else {
            if (quantidade > produto.estoque) {
                return res.status(400).json({ error: 'Estoque insuficiente.' });
            }
            await dbRun(
                'INSERT INTO carrinho_itens (id_usuario, id_produto, quantidade) VALUES (?, ?, ?)',
                [req.user.userId, id_produto, quantidade]
            );
        }
        res.json({ message: 'Carrinho atualizado com sucesso!' });
    } catch (error) {
        console.error('ERRO AO ATUALIZAR CARRINHO:', error);
        res.status(500).json({ error: 'Erro ao atualizar carrinho.' });
    }
});

app.delete('/api/carrinho/:id_produto', authenticateToken, async (req, res) => {
    try {
        const { id_produto } = req.params;
        await dbRun(
            'DELETE FROM carrinho_itens WHERE id_usuario = ? AND id_produto = ?',
            [req.user.userId, id_produto]
        );
        res.json({ message: 'Item removido do carrinho.' });
    } catch (error) {
        console.error('ERRO AO REMOVER DO CARRINHO:', error);
        res.status(500).json({ error: 'Erro ao remover item do carrinho.' });
    }
});

// =============================================================================
// INICIAR O SERVIDOR
// =============================================================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    // Mensagem de ajuda para acessar o sistema
    console.log(`🔗 Acesse a página de login em: http://localhost:${PORT}/login/index.html`);
});