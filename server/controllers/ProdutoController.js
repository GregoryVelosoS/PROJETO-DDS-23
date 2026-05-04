const ProdutoModel = require('../models/ProdutoModel');

class ProdutoController {
    
    // ===============================================
    // LÓGICA DO OFERTANTE (DASHBOARD E CADASTRO)
    // ===============================================
    
    static renderizarCadastro(req, res) {
        res.render('produtos_cadastro');
    }

    // Controller interceptado pelo Multer salva o arquivo no servidor
    static async cadastrar(req, res) {
        try {
            // Pegamos o ID do dono através da Sessão/JWT da Rota! (req.usuario)
            const id_usuario = req.usuario.id;
            
            // Variáveis vindas do Form HTML
            const { nome, descricao, preco, condicao, is_publico } = req.body;
            
            // Converte string do HTML ('1' ou 'true') para Boolean do banco
            const publico_bool = is_publico === '1' || is_publico === 'true';
            
            // O caminho da imagem foi gerado e salvo pelo Middleware do Multer
            const foto_caminho = req.file ? `/uploads/produtos/${req.file.filename}` : null;

            await ProdutoModel.criarProduto(id_usuario, nome, descricao, preco, condicao, foto_caminho, publico_bool);
            
            res.redirect('/produtos/meus-produtos');
        } catch (erro) {
            console.error(erro);
            res.status(500).send('Erro ao cadastrar produto.');
        }
    }

    static async listarMeusProdutos(req, res) {
        try {
            const idOfertante = req.usuario.id; 
            
            // Passo 1: Busca a lista de produtos cadastrados
            const produtos = await ProdutoModel.listarPorOfertante(idOfertante);
            
            // Passo 2: Busca quem teve interesse nos produtos dele (O Join do SQL)
            const interessados = await ProdutoModel.buscarInteressadosNosMeusProdutos(idOfertante);
            
            // Renderiza passando as DUAS variáveis para o painel!
            res.render('ofertante', { produtos: produtos, interessados: interessados });
        } catch (erro) {
            res.status(500).send('Erro ao buscar dashboard.');
        }
    }

    // === TELA DE EDIÇÃO ===
    static async editar(req, res) {
        try {
            const id = req.params.id; // Pegando o ID da URL Ex: /produtos/editar/5
            const produto = await ProdutoModel.buscarPorId(id);
            res.render('produtos_edicao', { produto });
        } catch (erro) {
            res.status(500).send('Erro ao abrir tela de edição de produto.');
        }
    }

    // === PROCESSAMENTO DA EDIÇÃO ===
    static async atualizar(req, res) {
        try {
            const id = req.params.id;
            const { nome, descricao, preco, condicao, is_publico } = req.body;
            const publico_bool = is_publico === '1' || is_publico === 'true';
            
            // O multer lida com a imagem (pode vir null se o usuário não alterar a foto)
            const foto_caminho = req.file ? `/uploads/produtos/${req.file.filename}` : null;

            await ProdutoModel.atualizarProduto(id, nome, descricao, preco, condicao, foto_caminho, publico_bool);
            res.redirect('/produtos/meus-produtos');
        } catch (erro) {
            res.status(500).send('Erro ao atualizar produto no banco.');
        }
    }

    // === TOGGLE DE VISIBILIDADE (BOTÃO OLHO) ===
    static async alternarVisibilidade(req, res) {
        try {
            const id = req.params.id;
            await ProdutoModel.alternarVisibilidade(id);
            res.redirect('/produtos/meus-produtos');
        } catch (erro) {
            res.status(500).send('Erro ao alternar status do produto.');
        }
    }

    // ===============================================
    // LÓGICA DA VITRINE E REGISTRO DE INTERESSE
    // ===============================================
    
    static async listarVitrine(req, res) {
        try {
            // Model já filtra no banco: WHERE is_publico = TRUE
            const produtos = await ProdutoModel.listarVitrinePublica();
            
            // Verifica o que o usuário logado já curtiu
            let meusInteresses = [];
            if (req.usuario) {
                meusInteresses = await ProdutoModel.buscarInteressesDoUsuario(req.usuario.id);
            }

            res.render('vitrine', { produtos, meusInteresses });
        } catch (erro) {
            res.status(500).send('Erro ao carregar a Vitrine de Trocas.');
        }
    }

    // === TOGGLE DE INTERESSE (BOTÃO CORAÇÃO) ===
    // Engatilhado quando o usuário clica no botão da Vitrine
    static async alternarInteresse(req, res) {
        try {
            const idProduto = req.params.id; 
            const idInteressado = req.usuario.id; 

            // Checa se já clicou antes
            const jaTemInteresse = await ProdutoModel.checarInteresse(idProduto, idInteressado);

            if (jaTemInteresse) {
                // Se o botão estava preto (Estado 2), ele remove o interesse
                await ProdutoModel.removerInteresse(idProduto, idInteressado);
            } else {
                // Se o botão estava vermelho (Estado 1), ele registra
                await ProdutoModel.registrarInteresse(idProduto, idInteressado);
            }
            
            // Redireciona de volta para continuar navegando
            res.redirect('/produtos/vitrine');
        } catch (erro) {
            res.status(500).send('Erro ao processar interesse.');
        }
    }
}

module.exports = ProdutoController;
