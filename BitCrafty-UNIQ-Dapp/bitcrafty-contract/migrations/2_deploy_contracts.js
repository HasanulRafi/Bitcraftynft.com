const BitCrafty_Contract = artifacts.require("BitCrafty_Contract");
const Uniq = artifacts.require("UNIQ");


module.exports = async function(deployer) {
    await deployer.deploy(Uniq);
    const token = await Uniq.deployed();
    await deployer.deploy(BitCrafty_Contract, token.address);
};
