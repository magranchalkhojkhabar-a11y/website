const requiredProductionVariables = ['MONGO_URI', 'JWT_SECRET', 'CORS_ORIGIN'];

const getMissingEnvironmentVariables = () => {
  const required = process.env.NODE_ENV === 'production'
    ? requiredProductionVariables
    : ['MONGO_URI', 'JWT_SECRET'];

  return required.filter((key) => !process.env[key]?.trim());
};

const validateEnvironment = () => {
  const missing = getMissingEnvironmentVariables();
  if (missing.length) {
    const error = new Error(`Missing required environment variables: ${missing.join(', ')}`);
    error.code = 'ENVIRONMENT_CONFIGURATION_ERROR';
    throw error;
  }
};

const getAllowedOrigins = () => (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const hasCloudinaryCredentials = () => [
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET
].every((value) => value?.trim());

module.exports = { getAllowedOrigins, hasCloudinaryCredentials, validateEnvironment };
