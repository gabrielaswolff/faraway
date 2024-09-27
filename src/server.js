const express = require('express');
const cors = require('cors');
const connection = require('./db_config');
const session = require('express-session');


const porta = 3007;
const app = express();

app.use(cors());
app.use(express.json());


app.use(session({
    secret: 'chave',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


app.listen(porta, () => console.log(`rodando na porta ${porta}`));

// CADASTRO DO USUARIO

app.post('/usuario/cadastrar', (request, response) => {
    const { name, email, password, cpf_number } = request.body;

    let checkQuery = 'SELECT * FROM users WHERE name = ? OR email = ?';
    connection.query(checkQuery, [name, email], (err, results) => {
        if (err) {
            console.error('Erro', err);
            return response.status(500).json({ success: false, message: 'Erro no servidor.', data: err });
        }
        if (results.length > 0) {
            return response.status(400).json({ success: false, message: 'Nome ou email já cadastrado.' });
        }

        let query = 'INSERT INTO users(name, email, password, cpf_number) VALUES(?,?,?,?)';
        let params = [name, email, password, cpf_number];
        connection.query(query, params, (err, results) => {
            if (err) {
                console.error('Erro ao cadastrar usuário:', err);
                return response.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.', data: err });
            }
            response.status(201).json({
                success: true,
                message: 'Cadastro realizado com sucesso!',
                data: results
            });
        });
    });
});

app.get('/usuarios/listar', (request, response) => {
    const query = 'select * from users';

    connection.query(query, (err, results) => {

    
    if(results) {
        response
        .status(200)
        .json({
            sucess: true,
            message: 'sucesso',
            data: results

        })
    } else {
        response
        .status(400)
        .json({
            sucess: false,
            message: 'sem sucesso',
            data: err
        })
    }

    })


})

app.put('/usuario/editar/:id', (request, response) => {
    let params = Array(
        request.body.name,
        request.params.id
    );

    let query = 'update users set name = ? where id = ?';

    connection.query(query, params, (err, results) => {
        if(results) {
            response.status(200)
            .json({
                sucess: true,
                message: 'sucesso',
                data: results
            })
        } else {
            response
            .status(400)
            .json({
                sucess: false,
                message: 'sem sucesso',
                data: err
            })
        
        }
    }
    ) 


})

app.delete('/usuario/deletar/:id', (request, response) => {
    let params = Array(
        request.params.id
    );

    let query = 'delete from users where id = ?;'

    connection.query(query, params, (err, results) => {
        if(results) {
            response
            .status(200)
            .json({
                sucess: true,
                message: 'sucesso pessoal :p',
                data: 'results'  
            })
        } else {
            response
            .status(400)
            .json({
                sucess: false,
                message: 'sem sucesso',
                data: err
            })
        }
    }
    )

})

// LOGIN 

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'precisa do email e senha' });
        }

        console.log('procurando o usuário', email);

        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('erro para listar', err);
                return res.status(500).json({ message: 'erro' });
            }

            if (results.length === 0) {
                console.log('não existe usuário com o email', email);
                return res.status(401).json({ message: 'email não encontrado.' });
            }

            console.log('usuario foi encontrado');

            if (results[0].password !== password) {
                console.log('senha incorreta para o email:', email);
                return res.status(401).json({ message: 'senha incorreta.' });
            }

            console.log('login com sucesso para o email:', email);

            req.session.userId = results[0].id;
            res.status(200).json({ message: 'Login com sucesso' });
        });
    } catch (error) {
        console.error('erro', error);
        return res.status(500).json({ message: 'erro' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'erro para deslogar' });
        }
        res.status(200).json({ message: 'Logout de sucesso' });
    });
});

function isAdmin(req, res, next) {
    const userId = req.body.userId || req.query.userId; 

    let query = 'SELECT role FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'erro no servidor.' });
        }
        
        if (results.length === 0 || results[0].role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Acesso negado. tem que acertar a senha né' });
        }
        
        next();
    });
}


// CADASTRO DE PRODUTOS INTERFACE ADMIN

app.post('/produto/cadastrar', (req, res) => {
    const { name, description, price, image_url, adminPassword } = req.body;

    const validAdminPassword = 'senha'; 

    if (adminPassword !== validAdminPassword) {
        return res.status(403).json({ success: false, message: 'senha do admin incorreta' });
    }

    const query = 'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)';
    const params = [name, description, price, image_url];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('erro', err);
            return res.status(500).json({ success: false, message: 'erro para cadastrar produto', data: err });
        }
        res.status(201).json({ success: true, message: 'sucesso para cadastrar produto' });
    });
});


app.get('/produtos/listar', (req, res) => {
    const query = 'SELECT * FROM products';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('erro para listar', err);
            return res.status(500).json({ success: false, message: 'erro para listar', data: err });
        }
        res.status(200).json({ success: true, data: results });
    });
});


app.put('/produto/editar/:id', (request, response) => {
    let params = [request.body.name, request.params.id];

    let query = 'UPDATE products SET name = ? WHERE id = ?';
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(200).json({
                success: true,
                message: 'edição com sucesso',
                data: results
            });
        } else {
            response.status(400).json({
                success: false,
                message: 'erro para editar',
                data: err
            });
        }
    });
});


app.delete('/produto/deletar/:id', (request, response) => {
    let params = [request.params.id];

    let query = 'DELETE FROM products WHERE id = ?';
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(200).json({
                success: true,
                message: 'produto deletado',
                data: results  
            });
        } else {
            response.status(400).json({
                success: false,
                message: 'erro para deletar produto',
                data: err
            });
        }
    });
});


// CARRINHO


app.post('/carrinho/adicionar', (request, response) => {
    const { user_id, product_id, quantity } = request.body;

    let query = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
    let params = [user_id, product_id, quantity];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('erro para adicionar ao carrinho', err);
            return response.status(500).json({ success: false, message: 'erro, tem que ver isso ai', data: err });
        }
        response.status(201).json({
            success: true,
            message: 'produto adicionado ao carrinho',
            data: results
        });
    });
});

app.get('/carrinho/:user_id', (req, res) => {
    const { user_id } = req.params;

    
    const query = `
        SELECT ci.id, p.name AS product_name, p.price, ci.quantity, (p.price * ci.quantity) AS total
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
    `;

    connection.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('erro para listar', err);
            return res.status(500).json({ success: false, message: 'erro para listar', data: err });
        }

       
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'nenhum item foi encontrado ao carrinho' });
        }

    
        res.status(200).json({
            success: true,
            message: 'sucessoooo',
            data: results
        });
    });
});


app.delete('/carrinho/remover/:id', (request, response) => {
    const { id } = request.params;

    let query = 'DELETE FROM cart_items WHERE id = ?';
    let params = [id];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('erro na remoção', err);
            return response.status(500).json({ success: false, message: 'erro na remoção', data: err });
        }
        response.status(200).json({
            success: true,
            message: 'sucesso',
            data: results
        });
    });
});

