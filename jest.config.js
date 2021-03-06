// Jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './'
})

const customConfig = {
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
    moduleNameMapper: {
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
        "^.+\\.(css|sass|scss)$": "<rootDir>/test/__mocks__/styleMock.js",
        "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$":
            "<rootDir>/test/__mocks__/fileMock.js",
        '^@component(.*)$': '<rootDir>/src/components/pages/$1',
        '^@UI(.*)$': '<rootDir>/src/components/UI/$1',
        '^@containers(.*)$': '<rootDir>/src/containers/$1',
        '^@images(.*)$': '<rootDir>/src/assets/images/$1',
        '^@hooks(.*)$': '<rootDir>/src/hook/$1',
        '^@utils(.*)$': '<rootDir>/src/utils/$1',
        '^@const(.*)$': '<rootDir>/src/const/$1',
        '^@content(.*)$': '<rootDir>/src/content/$1',
    },
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/.next/",
        "<rootDir>/e2e/",
        "<rootDir>/cypress/",
    ],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", {presets: ["next/babel"]}],
    },
    transformIgnorePatterns: [
        "/node_modules/",
        "^.+\\.module\\.(css|sass|scss)$",
    ],
    moduleDirectories: ['node_modules', '<rootDir>'],
};

module.exports = createJestConfig(customConfig)