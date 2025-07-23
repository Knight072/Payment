module.exports = {
  //Dónde buscar tests
  roots: ['<rootDir>/src', '<rootDir>/test'],
  //Extensiones de archivo
  moduleFileExtensions: ['js', 'json', 'ts'],
  //Pattern para detectar specs
  testRegex: '.*\\.spec\\.ts$',
  //Transformación de TS con ts-jest
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  //Variables de entorno
  testEnvironment: 'node',
  //Ignora build y node_modules
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};
