const TokenFarm = artifacts.require("TokenFarm");

const R8IToken = artifacts.require("R8IToken");
const DaiToken = artifacts.require("DaiToken");

module.exports = async function(deployer, network, accounts) {
  // deploy dai token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
  // deploy r8i token
  await deployer.deploy(R8IToken);
  const r8iToken = await R8IToken.deployed();

  await deployer.deploy(TokenFarm, daiToken.address, r8iToken.address);
  const tokenFarm = await TokenFarm.deployed();

  await r8iToken.transfer(tokenFarm.address, "1000000000000000000000000");
  await daiToken.transfer(accounts[1], "100000000000000000000");
};
