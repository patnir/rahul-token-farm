const { assert } = require("chai");

const TokenFarm = artifacts.require("TokenFarm");
const R8IToken = artifacts.require("R8IToken");
const DaiToken = artifacts.require("DaiToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "Ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, r8iToken, tokenFarm;

  before(async () => {
    daiToken = await DaiToken.new();
    r8iToken = await R8IToken.new();
    tokenFarm = await TokenFarm.new(r8iToken.address, daiToken.address);

    await r8iToken.transfer(tokenFarm.address, tokens("1000000"));

    await daiToken.transfer(investor, tokens("100"), { from: owner });
  });

  describe("Mock Dai Deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("R8I Dai Deployment", async () => {
    it("has a name", async () => {
      const name = await r8iToken.name();
      assert.equal(name, "R8I Token");
    });
  });

  describe("Token Farm Deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "r8i token farm");
    });

    it("contract has tokens", async () => {
      let balance = await r8iToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Farming tokens", async () => {
    it("rewards investors for staking mDai tokens", async () => {
      let result;

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor mock DAI balance correct before staking"
      );
      await daiToken.approve(tokenFarm.address, tokens("100"), {
        from: investor,
      });
      await tokenFarm.stakeTokens(tokens("100"), { from: investor });

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor has no tokens after staking"
      );

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor has 100 dai staked"
      );

      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), "true", "investor has 100 dai staked");

      await tokenFarm.issueTokens({ from: owner });

      result = await r8iToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("100"));

      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      await tokenFarm.unstakeTokens({ from: investor });

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor withdrew all dai"
      );

      result = await r8iToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor withdrew all r8i"
      );
    });
  });
});
