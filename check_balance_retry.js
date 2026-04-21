const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const walletAddr = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
  
  console.log("Checking balance of:", walletAddr);
  let bal = await provider.getBalance(walletAddr);
  console.log("Current balance:", ethers.formatEther(bal), "ETH");
  
  if (global.gc) global.gc(); // force GC if needed
  
  // Also check the specific tx
  const txHash = "0x35d68782968252dfe3f4a9f8ea8bcb44321809b027d142079de6062f2db7fb2a"; // partial from screenshot but let's see if we can get it or just skip
}
main().catch(console.error);
