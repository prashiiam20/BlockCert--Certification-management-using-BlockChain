const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const walletAddr = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";
  
  try {
    const sepProvider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
    const sepBal = await sepProvider.getBalance(walletAddr);
    console.log("Sepolia Balance:", ethers.formatEther(sepBal), "ETH");
  } catch(e) { console.log("Sepolia Error", e.message); }

  try {
    const amoyProvider = new ethers.JsonRpcProvider(process.env.ALCHEMY_AMOY_URL);
    const amoyBal = await amoyProvider.getBalance(walletAddr);
    console.log("Amoy Balance:", ethers.formatEther(amoyBal), "POL");
  } catch(e) { console.log("Amoy Error", e.message); }
}

main();
