import 'dotenv/config';
import { defineConfig } from '@prisma/config'; // Ajout du '@'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Utilisation de la variable d'environnement
    url: process.env.DATABASE_URL,
  },
});
