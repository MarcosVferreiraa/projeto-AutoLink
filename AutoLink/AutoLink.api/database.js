
import bcrypt from 'bcryptjs';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { config } from './config.js';

export let users;
export let cars;
export let favorites;
export let proposals;

const ADMIN_ID = 'admin-fixo-desenvolvimento-123';

export async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI não configurada.');
  }

  const client = new MongoClient(config.mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  
  await client.connect();

  const database = client.db(config.mongoDatabase);

  
  await database.command({ ping: 1 });

  
  users = database.collection('users');
  cars = database.collection('cars');
  favorites = database.collection('favorites');
  proposals = database.collection('proposals');

  
  await users.createIndex(
    { email: 1 },
    { unique: true }
  );

  await favorites.createIndex(
    {
      user_id: 1,
      car_id: 1,
    },
    {
      unique: true,
    }
  );
}

export async function seedDevelopmentAdmin() {
  const admin = {
    id: ADMIN_ID,
    name: 'Administrador Geral',
    email: 'admin@stand.com',
    password_hash: bcrypt.hashSync('123456', 12),
    phone: '912 345 678',
    birth_date: '',
    role: 'admin',
    approved: true,
    created_at: new Date().toISOString(),
  };

  await users.updateOne(
    { id: ADMIN_ID },
    {
      $setOnInsert: admin,
    },
    {
      upsert: true,
    }
  );
}
export function getCollections() {
  if (!users || !cars || !favorites || !proposals) {
    throw new Error('Banco de dados ainda não foi inicializado.');
  }

  return {
    users,
    cars,
    favorites,
    proposals,
  };
}