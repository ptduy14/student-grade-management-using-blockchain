import { ethers } from "ethers";

export const privateChainConfig = {
    chainId: ethers.utils.hexValue(12345),
    chainName: "My Private Chain",
    rpcUrls: ["http://localhost:8545"],
    nativeCurrency: {
        name: 'MyCoin',
        symbol: 'MYC',
        decimals: 18
    }
}