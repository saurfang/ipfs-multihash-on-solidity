const IPFSStorage = artifacts.require('./IPFSStorage.sol');

module.exports = (deployer) => {
  deployer.deploy(IPFSStorage);
};
