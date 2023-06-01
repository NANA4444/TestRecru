// controllers/userController.js

const bcrypt = require('bcrypt');
const User = require('../models/User');

async function register(req, res) {
  const { email, password } = req.body;

  try {
    // Vérifiez si l'utilisateur existe déjà dans la base de données
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'inscription' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Vérifiez si l'utilisateur existe dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifiez le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générez un token JWT
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la connexion' });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
  }
}

module.exports = { register, login, getUsers };
