const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// Ferramentas que vamos precisar nesta Rota
const upload = require('../config/multer'); // Middleware de Upload de Arquivos
const { verificarAutenticacao, somenteAdmin } = require('../middlewares/authMiddleware'); // Middlewares de Segurança

// ==========================================
// ROTAS PÚBLICAS (Qualquer um acessa)
// ==========================================

// O 'upload.single' intercepta o 'name="foto"' no formulário do HTML e salva antes do Controller rodar!
router.post('/cadastrar', upload.single('foto'), UsuarioController.cadastrar);
router.post('/login', UsuarioController.login);

// Ação de deslogar
router.get('/logout', UsuarioController.logout);

// ==========================================
// ROTAS PROTEGIDAS (O Porteiro Fica Aqui)
// ==========================================
// Daqui para baixo, TODOS OS ACESSOS passarão pelos dois middlewares de proteção:
router.use(verificarAutenticacao);
router.use(somenteAdmin);

// Apenas o Administrador consegue listar, editar ou deletar a lista geral
router.get('/', UsuarioController.listar);
router.get('/cadastro', UsuarioController.renderizarCadastro);
router.get('/editar/:id', UsuarioController.editar);
router.post('/atualizar/:id', upload.single('foto'), UsuarioController.atualizarUsuario);
router.post('/deletar/:id', UsuarioController.deletarUsuario);

module.exports = router;
