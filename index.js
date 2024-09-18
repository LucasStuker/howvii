const fs = require('fs'); // Importando o módulo fs para manipular arquivos
const db = require('./db'); // Importando a conexão com o banco de dados

const sql = `
SELECT 
    p.id_venda,
    p.data_do_pagamento,
    p.valor_do_pagamento,
    i.id_imovel AS codigo_imovel,
    i.descricao_imovel,
    t.nome_tipo AS tipo_imovel
FROM 
    Pagamento p
JOIN 
    Imovel i ON p.codigo_imovel = i.id_imovel
JOIN 
    TipoImovel t ON i.id_tipo_imovel = t.id_tipo_imovel;
`;

// Executando a consulta SQL
db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    
    // Salvando os dados em um arquivo JSON
    const jsonData = JSON.stringify(rows, null, 2); // Converter o resultado em JSON formatado

    fs.writeFile('resultados.json', jsonData, (err) => {
        if (err) {
            console.error('Erro ao salvar os resultados em um arquivo JSON:', err.message);
        } else {
            console.log('Resultados salvos com sucesso no arquivo resultados.json');
        }
    });
});

// Fechando a conexão com o banco de dados
db.close((err) => {
    if (err) {
        console.error('Erro ao fechar a conexão com o banco de dados:', err.message);
    } else {
        console.log('Conexão com o banco de dados SQLite fechada.');
    }
});