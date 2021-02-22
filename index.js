const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const Sequelize = require('sequelize');
require('dotenv/config');
    
const port = 8088;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = new Sequelize(process.env.db, 'root', process.env.pwd,{
    host:'127.0.0.1',
    dialect: 'mysql',
});

const DataTypes = Sequelize.DataTypes;
const register = sequelize.define('register',{
    name: {
    type: DataTypes.STRING,
    allowNull: false
    },
    amount: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
});

sequelize.authenticate().then (() => {
    console.log('Database connected.')
}).catch ((error) => {
console.error(`Connecting error: ${error}`)
});

//register.sync({ force: true });

app.get('/', (req, res) => {
    res.json('Welcome!')
});

app.post('/order', (req, res) => {
    const createOrder = register.create({
        name: req.body.name,
        amount: req.body.amount
    })
    .then((createOrder) => res.json(createOrder))
    .catch((error) => res.json(error)) 
});

const Op = Sequelize.Op;
app.get('/order', (req, res) =>{
    const waitingList = register.findAll({
        where: {
            createdAt: {
                [Op.gt]: new Date(Date.now() - 1000 * (60 * 5))
            }
        }
    })
    .then((waitingList) => res.json(waitingList))
    .catch((error) => res.json(error)) 
});

app.listen(port, () => {console.log(`Server running on port ${port}`)});