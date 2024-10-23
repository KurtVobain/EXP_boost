import { ethers } from "ethers"
import { MintNFT__factory } from "../artifacts/types"
import { config } from "../config"

class SendNFTArbitrumService {
    private provider: ethers.providers.JsonRpcProvider
    private wallet: ethers.Wallet
    private contract: ethers.Contract
    private destinationAddress: string
    private tokenId: number

    constructor(destinationAddress: string, tokenId: number) {
        this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl)
        this.wallet = new ethers.Wallet(
            config.sepolia_arbitrum_private_key,
            this.provider,
        )
        this.contract = MintNFT__factory.connect(
            config.contractAddress,
            this.wallet,
        )
        this.destinationAddress = destinationAddress
        this.tokenId = tokenId
    }

    async sendToken(): Promise<string> {
        try {
            const owner = await this.contract.ownerOf(this.tokenId)
            if (owner.toLowerCase() !== this.wallet.address.toLowerCase()) {
                throw new Error(`Wallet does not own token ID ${this.tokenId}`)
            }

            const tx = await this.contract.transferFrom(
                this.wallet.address,
                this.destinationAddress,
                this.tokenId,
            )
            const receipt = await tx.wait()

            console.log(
                `Transaction successful with hash: ${receipt.transactionHash}`,
            )
            return receipt.transactionHash
        } catch (error) {
            console.error("Error transferring NFT:", error)
            throw new Error("NFT transfer failed.")
        }
    }
}

export default SendNFTArbitrumService
