import { pool } from './db.js';

const sqlTabelas = `
  CREATE TABLE IF NOT EXISTS tb_usuario (
    id_usuario  SERIAL       PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    username    VARCHAR(60)  NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS tb_cliente (
    id_cliente     VARCHAR(20)  PRIMARY KEY,
    nome_fantasia  VARCHAR(150),
    razao_social   VARCHAR(150) NOT NULL,
    documento      VARCHAR(14)  NOT NULL UNIQUE,
    tipo_pessoa    VARCHAR(10)  NOT NULL CHECK (tipo_pessoa IN ('FISICA', 'JURIDICA')),
    email          VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS tb_produto (
    id_produto     SERIAL        PRIMARY KEY,
    descricao      VARCHAR(200)  NOT NULL,
    departamento   VARCHAR(80)   NOT NULL,
    codigo_barras  CHAR(13)      NOT NULL UNIQUE CHECK (codigo_barras ~ '^[0-9]{13}$'),
    preco          NUMERIC(10,2) NOT NULL CHECK (preco >= 0)
  );
`;

const sqlDadosExemplo = `
  INSERT INTO tb_usuario (nome, email, senha, username) VALUES
    ('Carla Mendes', 'carla@papelaria.com', 'carla2026', 'carla.mendes'),
    ('Rafael Souza', 'rafael@papelaria.com', 'rafa2026', 'rafael.souza')
  ON CONFLICT DO NOTHING;

  INSERT INTO tb_cliente (id_cliente, nome_fantasia, razao_social, documento, tipo_pessoa, email) VALUES
    ('C-0001', NULL, 'Ana Paula Ribeiro', '98765432100', 'FISICA', 'ana.ribeiro@email.com'),
    ('C-0002', 'Escola Saber', 'Instituto Educacional Saber LTDA', '11222333000144', 'JURIDICA', 'compras@escolasaber.com')
  ON CONFLICT DO NOTHING;

  INSERT INTO tb_produto (descricao, departamento, codigo_barras, preco) VALUES
    ('Caderno Universitário 10 Matérias', 'Cadernos', '7896543210123', 32.90),
    ('Caneta Esferográfica Azul', 'Escrita', '7891111222334', 2.50),
    ('Resma Papel A4 500 folhas', 'Papéis', '7894444555667', 29.99)
  ON CONFLICT DO NOTHING;
`;

async function montarBanco() {
  try {
    await pool.query(sqlTabelas);
    console.log('Tabelas tb_usuario, tb_cliente e tb_produto prontas.');

    await pool.query(sqlDadosExemplo);
    console.log('Dados de exemplo inseridos.');
  } catch (erro) {
    console.error('Falha ao montar o banco:', erro.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

montarBanco();
