const { ethers } = require("ethers");

async function main() {
  const walletAddr = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";
  const defaultProvider = ethers.getDefaultProvider("sepolia");
  
  let bal = await defaultProvider.getBalance(walletAddr);
  console.log("Current balance (Default Infura/Ankr):", ethers.formatEther(bal), "ETH");
}
main().catch(console.error);
