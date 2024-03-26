import dotenv from 'dotenv';

const envMap = {
  test: '.test.env',
  dev: '.dev.env',
  // prod: '.env', // Is being loaded in `<root>/docker/prod` container.
} as const;
const skipLoading = ['prod'];
type DotEnv = keyof typeof envMap;
const BUILD = 'BUILD';

function getEnvValue(value: string): DotEnv | undefined {
  return process.env[value] as DotEnv | undefined;
};

function loadEnv() {
  const envBuild = getEnvValue(BUILD);
  if (!envBuild) throw new Error('BUILD env flag not found');

  const dotenvFile = envMap[envBuild];
  if (!dotenvFile && skipLoading.includes(dotenvFile)) {
    throw new Error('Env file not in .envs map');
  }

  dotenv.config({ path: dotenvFile });
}

function buildConfiguration() {
  // env validation
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL not found');
  if (!process.env.JWT_PRIVATE_KEY) throw new Error('JWT_PRIVATE_KEY not found');
  if (!process.env.JWT_EXPIRES_IN) throw new Error('JWT_EXPIRES_IN not found');
  if (!process.env.API_PORT) throw new Error('API_PORT not found');
  if (!process.env.API_HOST) throw new Error('API_HOST not found');

  return {
    build: process.env.BUILD,
    api: {
      port: Number(process.env.API_PORT),
      host: process.env.API_HOST,
    },
    mongo: {
      url: process.env.MONGO_URL,
    },
    jwt: {
      privateKey: process.env.JWT_PRIVATE_KEY,
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  } as const;
}

loadEnv();
export const configuration = buildConfiguration();
