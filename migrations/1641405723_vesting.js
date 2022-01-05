const Vesting = artifacts.require("Vesting");
const Token = artifacts.require("Token");

module.exports = async function(_deployer) {
  // Use deployer to state migration tasks.
  await _deployer.deploy(Vesting);
  const vesting = await Vesting.deployed();
  await _deployer.deploy(Token,vesting.address);
};

