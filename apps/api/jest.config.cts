module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  // Paquets publiés en ESM uniquement : transpilés en CommonJS pour Jest
  transformIgnorePatterns: ['node_modules/(?!(@nestjs/config|@nestjs/jwt|nodemailer|marked)/)'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  // Tests d'intégration : Postgres requis (base gai2e_test, voir test/)
  globalSetup: '<rootDir>/test/global-setup.ts',
  setupFiles: ['<rootDir>/test/setup-env.ts'],
  testTimeout: 30000
};
