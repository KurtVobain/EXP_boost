import express, { Request, Response } from "express"
import MintSolanaNFTService from "../services/MintNFT"
import SendNFT from "../services/SendSolanaToken"
import LearnWeb3Parser from "../services/checkLearnWeb3"

const router = express.Router()

interface MintAndSendNFTRequest {
    userName: string
    battlepassId: number
    destinationAddress: string
}

router.post(
    "/mint-and-send-nft",
    async (req: Request<{}, {}, MintAndSendNFTRequest>, res: Response) => {
        const { userName, battlepassId, destinationAddress } = req.body

        try {
            const mintService = new MintSolanaNFTService(userName, battlepassId)

            const nftPubkey = await mintService.mintNft()

            const sendNFTService = new SendNFT(destinationAddress, nftPubkey, 1)

            const signature = await sendNFTService.sendToken()

            res.status(200).json({
                message: "NFT minted and sent successfully",
                nftPubkey,
                transactionSignature: signature,
            })
        } catch (error) {
            console.error("Error in mint-and-send-nft:", error)
            res.status(500).json({ error: "Failed to mint and send NFT" })
        }
    }
)

router.post("/daily/check", async (req: Request, res: Response) => {
    if (!req.query.userId || !req.query.dailyId) {
        return res
            .status(400)
            .json({ error: "Missing userId or dailyId parameter." })
    }

    const userId = Number(req.query.userId)
    const dailyId = Number(req.query.dailyId)

    try {
        const scraper = new LearnWeb3Parser(userId, dailyId)
        const isTaskCompleted = await scraper.checkDailyCompletion()

        return res.status(200).json({
            isFinished: isTaskCompleted,
        })
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
})

export default router
