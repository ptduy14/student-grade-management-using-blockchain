import { ethers } from "ethers";

export const privateChainConfig = {
    chainId: ethers.utils.hexValue(12345),
    chainName: "Education Network",
    rpcUrls: ["http://localhost:8545"],
    nativeCurrency: {
        name: 'EducationToken',
        symbol: 'EDU',
        decimals: 18
    }
}