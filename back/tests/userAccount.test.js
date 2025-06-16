const request = require('supertest');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

// Configuration de la base de données de test
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
});

// Importer le modèle UserAccount
const UserAccount = require('../models/UserAccount')(sequelize, Sequelize.DataTypes);

// Créer une application Express pour les tests
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Simuler la route de login pour les tests
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await UserAccount.findOne({ where: { email } });
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const userResponse = user.get({ plain: true });
  delete userResponse.password;

  res.json({
    success: true,
    data: {
      user: userResponse,
      token: 'test-token-123'
    }
  });
});

describe('User Authentication', () => {
  // Données de test
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    first_name: 'Test',
    last_name: 'User',
    user_type: 'AD',
    is_actif: true
  };

  // Avant tous les tests, initialiser la base de données et créer l'utilisateur de test
  beforeAll(async () => {
    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ force: true });
    
    // Créer l'utilisateur de test
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await UserAccount.create({
      email: testUser.email,
      password: hashedPassword,
      first_name: testUser.first_name,
      last_name: testUser.last_name,
      user_type: testUser.user_type,
      is_actif: testUser.is_actif
    });
  });

  // Après tous les tests, fermer la connexion à la base de données
  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 400 if email or password is missing', async () => {
      const response1 = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email });

      const response2 = await request(app)
        .post('/auth/login')
        .send({ password: testUser.password });

      expect(response1.status).toBe(400);
      expect(response2.status).toBe(400);
      expect(response1.body.success).toBe(false);
      expect(response2.body.success).toBe(false);
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
