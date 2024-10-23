import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"

import { config as EnvConfig } from "./src/config"

const config: HardhatUserConfig = {
    solidity: "0.8.1",
    defaultNetwork: "arbitrum_sepolia",
    paths: {
        sources: "./src/contracts",
        tests: "./src/tests",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    networks: {
        hardhat: {},
        arbitrum_sepolia: {
            chainId: 421614,
            url: EnvConfig.sepolia_arbitrum_url,
            accounts: [`0x${EnvConfig.sepolia_arbitrum_private_key}`],
        },
    },
}

export default config
