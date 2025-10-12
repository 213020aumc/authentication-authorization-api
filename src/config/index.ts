import "dotenv/config";

/**
 * A helper function to validate that all required environment variables are set.
 * If any variable is missing or empty, it throws an error to stop the application startup.
 * This is a "fail-fast" approach, preventing the app from running in a misconfigured state.
 * @param vars An object where keys are the environment variable names and values are their values.
 */
const validateEnv = (vars: { [key: string]: string | undefined }) => {
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined || value === "") {
      throw new Error(`❌ Missing required environment variable: ${key}`);
    }
  }
};

const requiredEnv = {
  // Database
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,

  // JSON Web Token
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  // Mailer (Mailtrap)
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM,
};

validateEnv(requiredEnv);

const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN!,
  },
  mail: {
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT!),
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!,
    from: process.env.MAIL_FROM!,
  },
};

export default config;
