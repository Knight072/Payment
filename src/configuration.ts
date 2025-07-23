// src/config/configuration.ts

export default () => ({
  // Entorno de ejecución
  nodeEnv: process.env.NODE_ENV || 'development',

  // Puerto de la aplicación
  port: parseInt(process.env.PORT ?? '3000', 10),

  // Configuración de la base de datos
  database: {
    type: 'postgres' as const,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    name: process.env.DB_NAME!,
    synchronize: process.env.NODE_ENV !== 'production',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '3600s',
  },

  // api
  w: {
    baseUrl: process.env.W_BASE_URL!,
    privateKey: process.env.W_PRIVATE_KEY!,
    publicKey: process.env.W_PUBLIC_KEY!,
  },
});
