const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');
const { verificarAutenticacao, somenteOfertante, usuariosComuns } = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); // Ferramenta para salvar imagens

// ==========================================
// PORTA DE ENTRADA: Todos precisam estar logados
// ==========================================
router.use(verificarAutenticacao);

// ==========================================
// ROTAS DO OFERTANTE / ADMIN (Apenas ele gerencia e cria itens)
// ==========================================
router.get('/meus-produtos', somenteOfertante, ProdutoController.listarMeusProdutos);
router.get('/cadastro', somenteOfertante, ProdutoController.renderizarCadastro);

// O 'upload.single' lê o campo 'foto' do forms e salva na pasta antes de passar para o controller!
router.post('/cadastrar', somenteOfertante, upload.single('foto'), ProdutoController.cadastrar);

// Novas rotas para edição e status
router.get('/editar/:id', somenteOfertante, ProdutoController.editar);
router.post('/atualizar/:id', somenteOfertante, upload.single('foto'), ProdutoController.atualizar);
router.post('/alternar-visibilidade/:id', somenteOfertante, ProdutoController.alternarVisibilidade);

// ==========================================
// ROTAS GERAIS (Ofertantes e Interessados veem a Vitrine e dão Match)
// ==========================================
router.get('/vitrine', usuariosComuns, ProdutoController.listarVitrine);

// Rota POST engatilhada pelo botão da Vitrine (Toggle de Interesse)
router.post('/alternar-interesse/:id', usuariosComuns, ProdutoController.alternarInteresse);

module.exports = router;
