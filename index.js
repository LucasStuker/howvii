const db = require ('./db');

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

db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    const results = rows.map((row) => {
        return {
            id_venda: row.id_venda,
            data_do_pagamento: row.data_do_pagamento,
            valor_do_pagamento: row.valor_do_pagamento,
            codigo_imovel: row.codigo_imovel,
            descricao_imovel: row.descricao_imovel,
            tipo_imovel: row.tipo_imovel
        };
    });
    console.log(results);
});

db.close((err) => {
    if (err) {
        console.error('Erro ao fechar a conexão com o banco de dados:', err.message);
    } else {
        console.log('Conexão com o banco de dados SQLite fechada.');
    }
});
