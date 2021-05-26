import dotenv from 'dotenv';

const dotenvs = {
  dev: '.env.dev',
  prod: '.env',
} as const;
type DotEnv = keyof typeof dotenvs;
const BUILD = 'BUILD';
export const getEnvValue = (value: string): DotEnv | undefined => {
  return process.env[value] as DotEnv | undefined;
};
const envBuild = getEnvValue(BUILD);
if (!envBuild) throw new Error('BUILD env flag not found');
dotenv.config({ path: dotenvs[envBuild] ?? dotenvs.prod });
// .env validation
if (!process.env.MONGO_URL) throw new Error('MONGO_URL not found');
if (!process.env.JWT_PRIVATE_KEY) throw new Error('JWT_PRIVATE_KEY not found');
if (!process.env.JWT_EXPIRES_IN) throw new Error('JWT_EXPIRES_IN not found');
export const configuration = {
  mongo: {
    url: process.env.MONGO_URL
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN
  }
} as const;
