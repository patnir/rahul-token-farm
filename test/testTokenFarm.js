const { assert } = require("chai");

const TokenFarm = artifacts.require("TokenFarm");
const R8IToken = artifacts.require("R8IToken");
const DaiToken = artifacts.require("DaiToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("TokenFarm", (accounts) => {
  // write tests
  describe("Mock Dai Deployment", async () => {
    it("has a name", async () => {
      let daiToken = await DaiToken.new();
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });
});
