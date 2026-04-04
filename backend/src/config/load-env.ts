import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

let loaded = false;

const getCandidateEnvPaths = () => {
  const projectRoot = process.cwd();
  const backendRoot = path.resolve(__dirname, '..', '..');

  return [
    path.resolve(projectRoot, '.env.local'),
    path.resolve(projectRoot, '.env'),
    path.resolve(projectRoot, 'backend', '.env.local'),
    path.resolve(projectRoot, 'backend', '.env'),
    path.resolve(backendRoot, '.env.local'),
    path.resolve(backendRoot, '.env'),
  ];
};

export const loadEnvironment = () => {
  if (loaded) {
    return;
  }

  for (const envPath of getCandidateEnvPaths()) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: false });
    }
  }

  loaded = true;
};
