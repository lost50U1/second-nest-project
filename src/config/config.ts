export default () => ({
  database: {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  },
  secrets: {
    jwtSecret: process.env.JWT_SECRET,
  },
});
