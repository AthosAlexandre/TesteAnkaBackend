import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts','js'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/types/**'],
};
export default config;
