// const { pathsToModuleNameMapper } = require("ts-jest");
// const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", // Important for backend testing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  //   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //     prefix: "<rootDir>/",
  //   }),
};
