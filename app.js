const express = require('express');
const db = require('./db'); // Conexão com o banco de dados
const app = express();

// Função a: Retornar id do imóvel e soma dos pagamentos
app.get('/pagamentos-por-imovel', (req, res) => {
    const sql = `
    SELECT 
        i.id_imovel AS codigo_imovel,
        SUM(p.valor_do_pagamento) AS total_pagamentos
    FROM 
        Pagamento p
    JOIN 
        Imovel i ON p.codigo_imovel = i.id_imovel
    GROUP BY 
        i.id_imovel
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Função b: Retornar total de vendas por mês/ano
app.get('/vendas-por-mes', (req, res) => {
    const sql = `
    SELECT 
        STRFTIME('%m/%Y', p.data_do_pagamento) AS mes_ano,
        SUM(p.valor_do_pagamento) AS total_vendas
    FROM 
        Pagamento p
    GROUP BY 
        mes_ano
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Função c: Retornar percentual de vendas por tipo de imóvel
app.get('/percentual-por-tipo-imovel', (req, res) => {
    const sqlTotal = `
    SELECT COUNT(*) AS total_vendas FROM Pagamento;
    `;
    const sql = `
    SELECT 
        t.nome_tipo AS tipo_imovel,
        COUNT(p.id_venda) AS total_vendas_tipo
    FROM 
        Pagamento p
    JOIN 
        Imovel i ON p.codigo_imovel = i.id_imovel
    JOIN 
        TipoImovel t ON i.id_tipo_imovel = t.id_tipo_imovel
    GROUP BY 
        t.nome_tipo
    `;

    // Primeiro, obtemos o total de vendas
    db.get(sqlTotal, [], (err, totalRow) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const totalVendas = totalRow.total_vendas;

        // Depois, obtemos as vendas por tipo de imóvel
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Calcula o percentual de vendas por tipo de imóvel
            const resultados = rows.map(row => ({
                tipo_imovel: row.tipo_imovel,
                percentual: ((row.total_vendas_tipo / totalVendas) * 100).toFixed(2) + ' %'
            }));

            res.json(resultados);
        });
    });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});