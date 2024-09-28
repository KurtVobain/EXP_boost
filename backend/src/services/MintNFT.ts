import {
    createNft,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createGenericFile,
    createSignerFromKeypair,
    generateSigner,
    keypairIdentity,
    percentAmount,
    KeypairSigner,
    Keypair,
} from "@metaplex-foundation/umi"
import { mockStorage } from "@metaplex-foundation/umi-storage-mock"
import * as fs from "fs"
import { config } from "../config"
import { NftDetail } from "../types/NftDetail"

class MintNFTService {
    private umi = createUmi(config.rpcUrl)
    private creatorWallet: Keypair
    private creator: KeypairSigner
    private nftDetail: NftDetail

    constructor(userName: string, battlepassId: number) {
        if (config.walletSecret.length === 0) {
            throw new Error("Wallet secret is not defined or empty.")
        }

        const secretKey = new Uint8Array(config.walletSecret)
        this.creatorWallet =
            this.umi.eddsa.createKeypairFromSecretKey(secretKey)
        this.creator = createSignerFromKeypair(this.umi, this.creatorWallet)

        this.umi.use(keypairIdentity(this.creator))
        this.umi.use(mplTokenMetadata())
        this.umi.use(mockStorage())

        this.nftDetail = {
            name: `${userName} Battlepass ${battlepassId}`,
            symbol: `BP${battlepassId}`,
            uri: "IPFS_URL_OF_METADATA",
            royalties: 5.5,
            description: `${userName}'s Battlepass ${battlepassId} NFT!`,
            imgType: "image/png",
            attributes: [{ trait_type: "Speed", value: "Quick" }],
        }
    }

    async uploadImage(): Promise<string> {
        const imgDirectory = "./uploads"
        const imgName = "image.png"
        const filePath = `${imgDirectory}/${imgName}`

        if (!fs.existsSync(filePath)) {
            throw new Error(`Image file not found at path: ${filePath}`)
        }

        const fileBuffer = fs.readFileSync(filePath)
        const image = createGenericFile(fileBuffer, imgName, {
            uniqueName: this.nftDetail.name,
            contentType: this.nftDetail.imgType,
        })

        const [imgUri] = await this.umi.uploader.upload([image])
        console.log("Uploaded image:", imgUri)
        return imgUri
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

        const metadataUri = await this.umi.uploader.uploadJson(metadata)
        console.log("Uploaded metadata:", metadataUri)
        return metadataUri
    }

    async mintNft() {
        const imageUri = await this.uploadImage()
        const metadataUri = await this.uploadMetadata(imageUri)

        try {
            const mint = generateSigner(this.umi)
            await createNft(this.umi, {
                mint,
                name: this.nftDetail.name,
                symbol: this.nftDetail.symbol,
                uri: metadataUri,
                sellerFeeBasisPoints: percentAmount(this.nftDetail.royalties),
                creators: [
                    {
                        address: this.creator.publicKey,
                        verified: true,
                        share: 100,
                    },
                ],
            }).sendAndConfirm(this.umi)
            console.log(`Created NFT: ${mint.publicKey.toString()}`)
        } catch (e) {
            throw e
        }
    }
}

export default MintNFTService
