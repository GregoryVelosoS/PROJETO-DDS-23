/**
 * Configuração de Conexão com o Banco de Dados MySQL
 * 
 * Aqui utilizamos o padrão 'Pool de Conexões' (Connection Pool).
 * 
 * Por que usar um Pool?
 * Em vez de abrir e fechar uma conexão toda vez que fizermos uma consulta SQL (o que é muito custoso e lento),
 * o Pool mantém um "grupo" de conexões abertas e prontas para serem reutilizadas.
 * Isso evita sobrecarga de conexões caindo e melhora absurdamente a performance da aplicação 
 * quando temos múltiplos usuários acessando simultaneamente.
 */

// Importamos a biblioteca 'mysql2' na sua versão de 'promise'.
// O uso de Promises permite utilizarmos async/await, deixando o código assíncrono muito mais limpo e legível.
const mysql = require('mysql2/promise');

// Criamos o pool de conexões e passamos as credenciais que estão em variáveis de ambiente (.env)
// É uma péssima prática deixar senhas escritas soltas (hardcoded) no arquivo, por isso usamos o process.env!
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Endereço do banco de dados (ex: 'localhost')
    user: process.env.DB_USER,         // Nome de usuário do banco (ex: 'root')
    password: process.env.DB_PASSWORD, // Senha de acesso do banco
    database: process.env.DB_NAME,     // Nome da database ('sistema_trocas')
    waitForConnections: true,          // Se todas as conexões estiverem ocupadas, a próxima requisição entra em fila de espera (não gera erro imediato)
    connectionLimit: 10,               // Número máximo de conexões que podem ficar abertas ao mesmo tempo
    queueLimit: 0                      // Limite de conexões que podem esperar na fila (0 = fila infinita/sem limite)
});

// Ao exportar o pool, permitimos que qualquer outro arquivo da nossa aplicação importe e faça uso do banco de dados
// de forma controlada e otimizada.
module.exports = pool;
