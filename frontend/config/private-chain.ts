import { ethers } from "ethers";

export const privateChainConfig = {
    chainId: ethers.utils.hexValue(12345),
    chainName: "Education Private Network",
    rpcUrls: ["http://localhost:8545"],
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    }
}