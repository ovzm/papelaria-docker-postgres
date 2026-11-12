import { pool } from './db.js';

const tabelasEsperadas = ['tb_usuario', 'tb_cliente', 'tb_produto'];

async function checarBanco() {
  try {
    const { rows } = await pool.query(
      `SELECT table_name
         FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = ANY($1)`,
      [tabelasEsperadas]
    );

    const existentes = rows.map((r) => r.table_name);
    let faltando = 0;

    for (const tabela of tabelasEsperadas) {
      if (existentes.includes(tabela)) {
        const { rows: contagem } = await pool.query(`SELECT COUNT(*) AS total FROM ${tabela}`);
        console.log(`[OK] ${tabela} (${contagem[0].total} registros)`);
      } else {
        console.log(`[FALTA] ${tabela}`);
        faltando++;
      }
    }

    if (faltando > 0) process.exitCode = 1;
  } catch (erro) {
    console.error('Falha ao checar o banco:', erro.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

checarBanco();
