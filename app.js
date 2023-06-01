const express = require('express');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const authenticateToken = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connecté à la base de données MongoDB'))
  .catch(err => console.error('Erreur de connexion à la base de données', err));

app.use(express.json());

app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/users', authenticateToken, userController.getUsers);

app.listen(3000, () => {
  console.log('Le serveur est en écoute sur le port 3000');
});
