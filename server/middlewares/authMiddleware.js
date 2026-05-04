const jwt = require('jsonwebtoken');

/**
 * =========================================================
 * DIDÁTICA: MIDDLEWARES DE PROTEÇÃO DE ROTAS (O PORTEIRO)
 * =========================================================
 */

// 1. Verifica se a pessoa TEM A CHAVE (Está logada)
function verificarAutenticacao(req, res, next) {
    // Busca o Token JWT gravado nos Cookies do navegador
    const token = req.cookies?.token;

    // Se não tiver token, a regra é dura: Manda pro Login sempre!
    if (!token) {
        return res.redirect('/login');
    }

    try {
        // Valida se o Token não é falso ou expirado
        const dados = jwt.verify(token, process.env.JWT_SECRET || 'chave_padrao');
        
        req.usuario = dados; // Salva o usuário no Backend (Controllers)
        
        // MÁGICA PARA O FRONT-END: 'res.locals' cria uma variável global pro EJS!
        // É isso que vai fazer os 'IFs' da nossa Navbar dinâmica funcionarem!
        res.locals.usuario = dados; 
        
        next(); // Pode entrar!
    } catch (erro) {
        res.clearCookie('token'); // Apaga o cookie ruim
        return res.redirect('/login');
    }
}

// 2. Filtros de Perfil Baseados na Função (RBAC)

function somenteAdmin(req, res, next) {
    if (req.usuario.perfil !== 'administrador') {
        return res.status(403).send('Acesso Negado: Apenas Administradores.');
    }
    next();
}

function somenteOfertante(req, res, next) {
    if (req.usuario.perfil !== 'ofertante' && req.usuario.perfil !== 'administrador') {
        return res.status(403).send('Acesso Negado: Área exclusiva de Ofertantes e Admins.');
    }
    next();
}

function somenteInteressado(req, res, next) {
    if (req.usuario.perfil !== 'interessado') {
        return res.status(403).send('Acesso Negado: Área exclusiva de Interessados.');
    }
    next();
}

// Ofertantes e Interessados juntos (pois ambos podem acessar a Vitrine Pública)
function usuariosComuns(req, res, next) {
    if (req.usuario.perfil !== 'ofertante' && req.usuario.perfil !== 'interessado') {
        return res.status(403).send('Acesso Negado.');
    }
    next();
}

module.exports = {
    verificarAutenticacao,
    somenteAdmin,
    somenteOfertante,
    somenteInteressado,
    usuariosComuns
};
