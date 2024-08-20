const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE_URL || path.resolve(__dirname, 'HoWVI.db')

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error ("Erro ao conectar no DB", err.message);
    } else {
        console.log ("conectado o Db");
    }    
});

module.exports = db