require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "sepolia",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL
    }
  }
};
