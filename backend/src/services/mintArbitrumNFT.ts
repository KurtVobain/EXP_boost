import { ethers } from "ethers"
import { create } from "ipfs-http-client"
import { MintNFT__factory } from "../artifacts/types"
import { config } from "../config"
import * as fs from "fs"
import { NftDetail } from "../types/NftDetail"

class MintArbitrumNFTService {
    private provider: ethers.providers.JsonRpcProvider
    private wallet: ethers.Wallet
    private contract: ethers.Contract
    private nftDetail: NftDetail
    private nftID: string
    private ipfsClient = create({ url: config.ipfsApiUrl }) // IPFS client setup

    constructor(userName: string, battlepassId: number, nftID: string) {
        this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl) // Arbitrum provider
        this.wallet = new ethers.Wallet(
            config.sepolia_arbitrum_private_key,
            this.provider,
        ) // Signer wallet
        this.contract = MintNFT__factory.connect(
            config.contractAddress,
            this.wallet,
        ) // MintNFT contract

        this.nftID = nftID

        this.nftDetail = {
            name: `${userName} Battlepass ${battlepassId}`,
            symbol: `BP${battlepassId}`,
            uri: "", // URI will be populated after IPFS upload
            royalties: 5.5,
            description: `${userName}'s Battlepass ${battlepassId} NFT!`,
            imgType: "image/png",
            attributes: [{ trait_type: "Speed", value: "Quick" }],
        }
    }

    // Upload the image to IPFS
    async uploadImage(): Promise<string> {
        const imgDirectory = `${__dirname}/../public/rewards`
        const imgName = `${this.nftID}.png`
        const filePath = `${imgDirectory}/${imgName}`

        if (!fs.existsSync(filePath)) {
            throw new Error(`Image file not found at path: ${filePath}`)
        }

        const fileBuffer = fs.readFileSync(filePath)

        try {
            const result = await this.ipfsClient.add({ content: fileBuffer })
            const imgUri = `${config.ipfsGatewayUrl}/ipfs/${result.path}`
            console.log("Uploaded image:", imgUri)
            return imgUri
        } catch (error) {
            console.error("Error uploading image to IPFS:", error)
            throw new Error("Image upload failed.")
        }
    }

    async uploadMetadata(imageUri: string): Promise<string> {
        const metadata = {
            name: this.nftDetail.name,
            description: this.nftDetail.description,
            image: imageUri,
            attributes: this.nftDetail.attributes,
            properties: {
                files: [
                    {
                        type: this.nftDetail.imgType,
                        uri: imageUri,
                    },
                ],
            },
        }

        try {
            const result = await this.ipfsClient.add(JSON.stringify(metadata))
            const metadataUri = `${config.ipfsGatewayUrl}/ipfs/${result.path}`
            console.log("Uploaded metadata:", metadataUri)
            return metadataUri
        } catch (error) {
            console.error("Error uploading metadata to IPFS:", error)
            throw new Error("Metadata upload failed.")
        }
    }

    async mintNft(): Promise<string> {
        const imageUri = await this.uploadImage()
        const metadataUri = await this.uploadMetadata(imageUri)

        try {
            const tx = await this.contract.mintNFT(
                this.wallet.address,
                metadataUri,
            )
            const receipt = await tx.wait()
            const tokenId = receipt.events[0].args[2].toString()
            console.log(`Minted NFT with token ID: ${tokenId}`)
            return tokenId
        } catch (e) {
            console.error("Error minting NFT:", e)
            throw new Error("NFT minting failed.")
        }
    }
}

export default MintArbitrumNFTService
