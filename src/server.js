const express = require('express');
const cors = require('cors');
const connection = require('./db_config');

const porta = 3007;
const app = express();


app.use(cors());
app.use(express.json());


 
app.listen(porta, () => console.log(`rodando na porta ${porta}`));  
const upload = require('./multer')

// CADASTRO DO USUARIO

app.post('/usuario/cadastrar', (request, response) => {
    const { name, email, password, cpf_number } = request.body;

    let checkQuery = 'SELECT * FROM users WHERE name = ? OR email = ?';
    connection.query(checkQuery, [name, email], (err, results) => {

        if (err) {
            console.error('Erro', err);
            return response.status(500).json({ success: false, message: 'erro', data: err });
        }
        if (results.length > 0) {
            return response.status(400).json({ success: false, message: 'nome ou email já está cadastrado.' });
        }

        let query = 'INSERT INTO users(name, email, password, cpf_number) VALUES(?,?,?,?)';
        let params = [name, email, password, cpf_number];
        connection.query(query, params, (err, results) => {
            if (err) {
                console.error('erro ao cadastrar usuario', err);
                return response.status(500).json({ success: false, message: 'erro', data: err });
            }

            const newUser = {
                id: results.insertId,
                name,
                email,
                password, 
                perfil: 'user' 
            };


            response.status(201).json({
                success: true,
                message: 'sucesso pessoal',
                data: newUser 
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
    const { name, cpf_number, email, password } = request.body;
    const id = request.params.id;
    
    // Parâmetros para atualizar
    let params = [name, cpf_number, email, password, id];
    
    // Query para atualizar os campos
    let query = `
        UPDATE users
        SET name = ?, cpf_number = ?, email = ?, password = ?
        WHERE id = ?
    `;
    
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(200).json({
                success: true,
                message: 'Edição realizada com sucesso',
                data: results
            });
        } else {
            response.status(400).json({
                success: false,
                message: 'Erro ao editar',
                data: err
            });
        }
    });
});


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

app.post('/login', (request, response) => {
    let params  = Array(
        request.body.email
    )

    let query = "select id, name, email, password, perfil from users where email = ?";

    connection.query(query, params, (err, results) => {
        if(results.length > 0 ) {

            let senhaDigitada = request.body.password
            let senhaBanco = results[0].password

            if(senhaBanco == senhaDigitada) {
                response
                .status(200)
                .json({
                    success: true, 
                    message: "sucesso pessoal",
                    data: results[0]
                })
            
            } else{
                response
                .status(400)
                .json({
                    success: false,
                    message: "verifique sua senha"
                })
                
            }
           
        } else {
            response
            .status(400)
            .json({
                success: false,
                message: "email não cadastrado"
            })
        }
        
    })
})


// CARRINHO


app.post('/carrinho/adicionar', (request, response) => {
    const { user_id, product_id, quantity } = request.body;

    const checkQuery = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
    connection.query(checkQuery, [user_id, product_id], (err, results) => {
        if (err) {
            console.error('erro', err);
            return response.status(500).json({ success: false, message: 'erro', data: err });
        }

        if (results.length > 0) {
            
            return response.status(400).json({ success: false, message: 'esse produto já está no carrinho' });
        }

        
        const query = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
        const params = [user_id, product_id, quantity];

        connection.query(query, params, (err, results) => {
            if (err) {
                console.error('erro', err);
                return response.status(500).json({ success: false, message: 'erro', data: err });
            }
            response.status(201).json({
                success: true,
                message: 'O produto foi adicionado ao carrinho!',
                data: results
            });
        });
    });
});




app.put('/carrinho/editar/:id', (request, response) => {
    const { id } = request.params;
    const { quantity } = request.body;

    let query = 'UPDATE cart_items SET quantity = ? WHERE id = ?';
    let params = [quantity, id];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('erro na atualização da quantidade', err);
            return response.status(500).json({ success: false, message: 'erro na atualização' });
        }
        response.status(200).json({ success: true, message: 'quantidade atualizada' });
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


// COMPRA 

app.post('/verificarCompra', (req, res) => {
    const { email, password } = req.body;


    let query = "SELECT id FROM users WHERE email = ? AND password = ?";


    connection.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'erro' });
        }

        if (results.length > 0) {
            res.status(200).json({ success: true, message: 'certinho' });
        } else {
            res.status(404).json({ success: false, message: 'email ou senha incorretos' });
        }
    });
});


// -----------------------------------------------------------------------------------------


app.post('/produto/cadastrar', upload.single('file'), (request, response) => {
    let params = Array(
        request.body.name,
        request.body.price,
        request.file.filename
    )

    let query = 'insert into products(name, price, image) values(?,?,?)';

    connection.query(query, params, (err, results) => {
        if(results) {
            response
                .status(201)
                .json({
                    success: true,
                    message: "sucessp",
                    data: results
                })
        }else {
            response
            .status(400)
            .json({
                success: false,
                message: "sem sucesso",
                data: err
            })
        }
    })
})
