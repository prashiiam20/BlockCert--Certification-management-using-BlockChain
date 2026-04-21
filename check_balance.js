const { ethers } = require("ethers");
require("dotenv").config();
async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const balance = await provider.getBalance(wallet.address);
  console.log("Wallet:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
}
main().catch(console.error);
