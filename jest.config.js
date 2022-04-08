module.exports = {
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
    },
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/.next/",
        "<rootDir>/e2e/",
    ],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", {presets: ["next/babel"]}],
    },
    transformIgnorePatterns: [
        "/node_modules/",
        "^.+\\.module\\.(css|sass|scss)$",
    ],
};