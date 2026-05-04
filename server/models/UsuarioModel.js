const db = require('../config/db');

class UsuarioModel {
    // === FUNÇÕES DA AULA PASSADA ===
    static async criarUsuario(nome, email, senhaHash, telefone, foto, perfil) {
        const query = 'INSERT INTO usuarios (nome, email, senha, telefone, foto, perfil) VALUES (?, ?, ?, ?, ?, ?)';
        const [resultado] = await db.execute(query, [nome, email, senhaHash, telefone, foto, perfil]);
        return resultado.insertId;
    }

    static async buscarPorEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [linhas] = await db.execute(query, [email]);
        return linhas[0]; 
    }

    // === NOVAS FUNÇÕES DO CRUD ===
    
    // Lista todos os usuários
    static async listarUsuarios() {
        const [linhas] = await db.execute('SELECT id, nome, email, perfil FROM usuarios');
        return linhas;
    }

    // Busca um usuário específico pelo ID
    static async buscarPorId(id) {
        const [linhas] = await db.execute('SELECT id, nome, email, perfil FROM usuarios WHERE id = ?', [id]);
        return linhas[0];
    }

    // Atualiza os dados de um usuário
    static async atualizarUsuario(id, nome, email, perfil) {
        const query = 'UPDATE usuarios SET nome = ?, email = ?, perfil = ? WHERE id = ?';
        const [resultado] = await db.execute(query, [nome, email, perfil, id]);
        return resultado.affectedRows;
    }

    // Exclui um usuário do banco
    static async deletarUsuario(id) {
        const query = 'DELETE FROM usuarios WHERE id = ?';
        const [resultado] = await db.execute(query, [id]);
        return resultado.affectedRows;
    }
}
module.exports = UsuarioModel;
