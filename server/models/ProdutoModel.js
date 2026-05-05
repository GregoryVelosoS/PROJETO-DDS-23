const db = require('../config/db');

class ProdutoModel {
    
    // Insere o produto considerando foto e visibilidade pública
    static async criarProduto(id_usuario, nome, descricao, preco, condicao, foto, is_publico) {
        const query = 'INSERT INTO produtos (id_usuario, nome, descricao, preco, condicao, foto, is_publico) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [resultado] = await db.execute(query, [id_usuario, nome, descricao, preco, condicao, foto, is_publico]);
        return resultado.insertId;
    }

    // Busca os produtos pertencentes ao usuário logado
    static async listarPorOfertante(id_usuario) {
        const query = 'SELECT * FROM produtos WHERE id_usuario = ?';
        const [linhas] = await db.execute(query, [id_usuario]);
        return linhas;
    }

    // Busca APENAS os públicos na base de dados (Exigência da Vitrine)
    static async listarVitrinePublica() {
        // Utilizamos JOIN para juntar a tabela de produtos com a de usuários e trazer o dono
        const query = `
            SELECT p.*, u.nome AS ofertante_nome, u.telefone AS ofertante_telefone 
            FROM produtos p 
            INNER JOIN usuarios u ON p.id_usuario = u.id 
            WHERE p.is_publico = TRUE
        `;
        const [linhas] = await db.execute(query);
        return linhas;
    }

    // ========================================================
    // LÓGICA DE GESTÃO DO OFERTANTE / ADMIN
    // ========================================================

    // Busca um único produto pelo ID para preencher a tela de Edição
    static async buscarPorId(id) {
        const query = 'SELECT * FROM produtos WHERE id = ?';
        const [linhas] = await db.execute(query, [id]);
        return linhas[0];
    }

    // Inverte a chave 'is_publico' (Toggle)
    static async alternarVisibilidade(id) {
        const query = 'UPDATE produtos SET is_publico = NOT is_publico WHERE id = ?';
        await db.execute(query, [id]);
    }

    // Processa a Atualização Completa do Produto (Com ou Sem a troca da foto)
    static async atualizarProduto(id, nome, descricao, preco, condicao, foto, is_publico) {
        if (foto) {
            // Se mandou foto, atualiza a coluna foto
            const query = 'UPDATE produtos SET nome=?, descricao=?, preco=?, condicao=?, foto=?, is_publico=? WHERE id=?';
            await db.execute(query, [nome, descricao, preco, condicao, foto, is_publico, id]);
        } else {
            // Se NÃO mandou foto nova, apenas atualiza os textos e ignora a foto (mantém a velha)
            const query = 'UPDATE produtos SET nome=?, descricao=?, preco=?, condicao=?, is_publico=? WHERE id=?';
            await db.execute(query, [nome, descricao, preco, condicao, is_publico, id]);
        }
    }

    // ========================================================
    // LÓGICA DE INTERESSES (MATCH)
    // ========================================================

    // 1. Grava no banco que "Pessoa X quer Produto Y"
    static async registrarInteresse(id_produto, id_interessado) {
        const query = 'INSERT INTO interesses (id_produto, id_interessado) VALUES (?, ?)';
        const [resultado] = await db.execute(query, [id_produto, id_interessado]);
        return resultado.insertId;
    }

    // NOVA FUNÇÃO: Checar se o interesse já existe (Para decidir entre Adicionar ou Remover)
    static async checarInteresse(id_produto, id_interessado) {
        const query = 'SELECT * FROM interesses WHERE id_produto = ? AND id_interessado = ?';
        const [linhas] = await db.execute(query, [id_produto, id_interessado]);
        return linhas.length > 0;
    }

    // NOVA FUNÇÃO: Remover interesse
    static async removerInteresse(id_produto, id_interessado) {
        const query = 'DELETE FROM interesses WHERE id_produto = ? AND id_interessado = ?';
        await db.execute(query, [id_produto, id_interessado]);
    }

    // NOVA FUNÇÃO: Buscar todos os IDs de produtos que o usuário logado se interessou
    static async buscarInteressesDoUsuario(id_interessado) {
        const query = 'SELECT id_produto FROM interesses WHERE id_interessado = ?';
        const [linhas] = await db.execute(query, [id_interessado]);
        // Mapeia e retorna um array simples só com os IDs (Ex: [1, 5, 8])
        return linhas.map(linha => linha.id_produto);
    }

    // 2. JOIN MÁGICO PARA O OFERTANTE:
    // Ele une as 3 tabelas (Interesses -> Produtos -> Usuários) para capturar
    // o Nome e o Telefone do Interessado que clicou nos produtos DELE.
    static async buscarInteressadosNosMeusProdutos(id_ofertante) {
        const query = `
            SELECT 
                i.data_interesse,
                p.id AS id_produto,
                p.nome AS nome_produto,
                u.nome AS nome_interessado,
                u.telefone AS telefone_interessado
            FROM interesses i
            INNER JOIN produtos p ON i.id_produto = p.id
            INNER JOIN usuarios u ON i.id_interessado = u.id
            WHERE p.id_usuario = ?
            ORDER BY i.data_interesse DESC
        `;
        // Passamos o 'id_ofertante' no lugar da interrogação (?) para filtrar os itens dele
        const [linhas] = await db.execute(query, [id_ofertante]);
        return linhas;
    }
}

module.exports = ProdutoModel;
