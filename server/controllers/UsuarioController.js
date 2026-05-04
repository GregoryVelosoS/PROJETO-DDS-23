const UsuarioModel = require('../models/UsuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UsuarioController {
    // 1. LISTAR: Busca no banco e renderiza a tela de listagem
    static async listar(req, res) {
        try {
            const usuarios = await UsuarioModel.listarUsuarios();
            // Renderiza o arquivo EJS e manda a variável 'usuarios' para o HTML
            res.render('usuarios_lista', { usuarios });
        } catch (erro) {
            res.status(500).send('Erro ao listar usuários');
        }
    }

    // 2. CADASTRAR (GET): Apenas exibe a tela com o formulário em branco
    static renderizarCadastro(req, res) {
        res.render('usuarios_cadastro');
    }

    // 2.1 CADASTRAR (POST): Recebe os dados do formulário e salva no banco
    static async cadastrar(req, res) {
        try {
            const { nome, email, senha, telefone, perfil } = req.body;
            
            // Segurança: O Front-end de login não pode deixar criar Admin.
            if (perfil === 'administrador') {
                return res.status(403).send('Não permitido.');
            }

            // O Multer salva o arquivo e coloca as informações dele dentro de 'req.file'
            // Guardamos apenas o "caminho" (URL) para a imagem no banco de dados.
            const fotoDaPessoa = req.file ? `/uploads/usuarios/${req.file.filename}` : null;
            
            const senhaHash = await bcrypt.hash(senha, 10);
            
            await UsuarioModel.criarUsuario(nome, email, senhaHash, telefone, fotoDaPessoa, perfil);
            
            // Após salvar, redireciona o usuário para fazer login
            res.redirect('/login');
        } catch (erro) {
            console.error(erro);
            res.status(500).send('Erro ao cadastrar usuário');
        }
    }

    // 3. EDITAR: Busca os dados atuais do usuário e carrega o formulário preenchido
    static async editar(req, res) {
        try {
            // === USO DO REQ.PARAMS ===
            // O Express captura qualquer coisa na URL definida com ':' na rota.
            // Exemplo: Na rota /usuarios/editar/:id, se acessarmos /usuarios/editar/5, o req.params.id valerá 5.
            const idVindoDaUrl = req.params.id; 
            
            const usuario = await UsuarioModel.buscarPorId(idVindoDaUrl);
            res.render('usuarios_edicao', { usuario });
        } catch (erro) {
            res.status(500).send('Erro ao abrir tela de edição');
        }
    }

    // 4. ATUALIZAR: Recebe os dados alterados no formulário de edição e manda pro banco
    static async atualizarUsuario(req, res) {
        try {
            const idVindoDaUrl = req.params.id; // Pegamos o ID da URL
            const { nome, email, perfil } = req.body; // Pegamos os dados do Formulário (Body)
            
            await UsuarioModel.atualizarUsuario(idVindoDaUrl, nome, email, perfil);
            res.redirect('/usuarios');
        } catch (erro) {
            res.status(500).send('Erro ao atualizar usuário');
        }
    }

    // 5. DELETAR: Exclui o usuário com base no ID da URL
    static async deletarUsuario(req, res) {
        try {
            const idVindoDaUrl = req.params.id;
            await UsuarioModel.deletarUsuario(idVindoDaUrl);
            res.redirect('/usuarios');
        } catch (erro) {
            res.status(500).send('Erro ao excluir usuário');
        }
    }

    // === AUTENTICAÇÃO COM REDIRECIONAMENTO SSR E COOKIES ===
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            const usuario = await UsuarioModel.buscarPorEmail(email);
            if (!usuario) return res.status(401).send('Credenciais inválidas.');

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) return res.status(401).send('Credenciais inválidas.');

            // Gera o Crachá (Token) contendo o perfil, para os Middlewares usarem
            const token = jwt.sign(
                { id: usuario.id, perfil: usuario.perfil, nome: usuario.nome }, 
                process.env.JWT_SECRET || 'chave_padrao', 
                { expiresIn: '2h' }
            );

            // Grava o token em um "Cookie" no navegador do usuário
            res.cookie('token', token, { httpOnly: true });

            // Redirecionamento Baseado em Papéis (RBAC)
            if (usuario.perfil === 'administrador') return res.redirect('/usuarios');
            if (usuario.perfil === 'ofertante') return res.redirect('/produtos/meus-produtos');
            if (usuario.perfil === 'interessado') return res.redirect('/produtos/vitrine');

        } catch (erro) {
            res.status(500).send('Erro interno no servidor');
        }
    }

    // Ação Simples de Logout (Sair)
    static logout(req, res) {
        res.clearCookie('token'); // Apaga o cookie
        res.redirect('/login'); // Expulsa pra tela de acesso
    }
}
module.exports = UsuarioController;
