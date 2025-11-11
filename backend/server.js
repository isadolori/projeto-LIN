const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();
const PORT = 3001; 

app.use(cors());
app.use(express.json()); 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Administrador', 
  password: '654321',       
  database: 'loja_lin_db'  
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL com sucesso!');
});

app.get('/produtos', (req, res) => {
    const searchTerm = req.query.q; 
    
  // Use a subquery to get a single image per product. This avoids GROUP BY issues
  // (ONLY_FULL_GROUP_BY errors) on MySQL when selecting p.* together with joined
  // columns. The subquery returns one caminho_imagem (or null) per produto.
  let sql = `
    SELECT p.*, (
      SELECT ip.caminho_imagem
      FROM imagem_produto ip
      WHERE ip.id_produto = p.id_produto
      LIMIT 1
    ) AS caminho_imagem
    FROM produto p
  `;
    let values = [];

    if (searchTerm) {
        sql += ` WHERE p.nome_produto LIKE ? `; 
        values.push(`%${searchTerm}%`);
    }
  // removed GROUP BY to avoid ONLY_FULL_GROUP_BY SQL errors; using subquery above
  // to select a single image per product instead.

    connection.query(sql, values, (err, data) => {
        if (err) {
            console.error("Erro ao buscar produtos:", err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        return res.json(data);
    });
});

app.post('/registro-completo', (req, res) => {
  const {
    nome,
    cpf,
    email,
    senha, 
    telefone,
    cep,
    logradouro,
    numero,
    bairro,
    cidade,
    uf,
    complemento
  } = req.body;

  if (!nome || !cpf || !email || !senha || !cep || !logradouro || !numero || !bairro || !cidade || !uf) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }
  connection.beginTransaction((err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
    const sqlCliente = `
      INSERT INTO cliente 
      (nome_cliente, cpf_cliente, email_cliente, senha_cliente, telefone_cliente) 
      VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(sqlCliente, [nome, cpf, email, senha, telefone], (err, resultCliente) => {
      if (err) {
        return connection.rollback(() => {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email ou CPF já cadastrado.' });
          }
          console.error("Erro ao inserir cliente:", err);
          return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
        });
      }
      const idClienteNovo = resultCliente.insertId;

      const sqlEndereco = `
        INSERT INTO Endereco
        (id_cliente, logradouro_endereco, numero_endereço, bairro_endereço, cidade_endereço, uf_endereço, cep_endereço, complemento_endereço)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      connection.query(sqlEndereco, [idClienteNovo, logradouro, numero, bairro, cidade, uf, cep, complemento], (err, resultEndereco) => {
        if (err) {
          return connection.rollback(() => {
            console.error("Erro ao inserir endereço:", err);
            return res.status(500).json({ error: 'Erro ao cadastrar endereço.' });
          });
        }
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              console.error("Erro ao confirmar transação:", err);
              return res.status(500).json({ error: 'Erro ao finalizar cadastro.' });
            });
          }
        
          res.status(201).json({ message: 'Cadastro realizado com sucesso!', idCliente: idClienteNovo });
        });
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  const sql = "SELECT * FROM cliente WHERE email_cliente = ? AND senha_cliente = ?";

  connection.query(sql, [email, senha], (err, results) => {
    if (err) {
      console.error("Erro no login:", err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }

    if (results.length > 0) {
      const cliente = results[0];
      res.status(200).json({ 
        message: 'Login bem-sucedido!',
        cliente: {
          id_cliente: cliente.id_cliente,
          nome_cliente: cliente.nome_cliente,
          email_cliente: cliente.email_cliente
        }
      });
    } else {
      res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  });
});

app.post('/clientes', (req, res) => {
  const { nome, cpf, email, senha, telefone } = req.body;

  if (!nome || !cpf || !email || !senha) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const sql = "INSERT INTO cliente (nome_cliente, cpf_cliente, email_cliente, senha_cliente, telefone_cliente) VALUES (?, ?, ?, ?, ?)";
  
  connection.query(sql, [nome, cpf, email, senha, telefone], (err, result) => {
    if (err) {

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email ou CPF já cadastrado.' });
      }
      console.error("Erro ao cadastrar cliente:", err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    return res.status(201).json({ 
      message: 'Cliente cadastrado com sucesso!', 
      idCliente: result.insertId 
    });
  });
});

app.put('/produtos/:id/estoque', (req, res) => {
  const { id } = req.params; 
  const { novoEstoque } = req.body; 

  const sql = "UPDATE produto SET estoque_produto = ? WHERE id_produto = ?";
  
  connection.query(sql, [novoEstoque, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar estoque:", err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    return res.status(200).json({ message: 'Estoque atualizado!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});