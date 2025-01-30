module.exports = {
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  transformIgnorePatterns: ["/node_modules/"],
  setupFiles: ["<rootDir>/frontend/jest.setup.js"],
};
