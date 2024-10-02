import { Repository } from "typeorm"
import express, { Request, Response } from "express"
import MintSolanaNFTService from "../services/MintNFT"
import SendNFT from "../services/SendSolanaToken"
import LearnWeb3Parser from "../services/checkLearnWeb3"
import { User } from "../entities/User"
import { BattlePass } from "../entities/BattlePass"
import { UserBattlePass } from "../entities/UserBattlePass"
import AppDataSource from "../data-source"

const router = express.Router()

interface MintAndSendNFTRequest {
    userName: string
    battlepassId: number
    destinationAddress: string
}

async function getUserClosedLevels(user: User): Promise<number[]> {
    const battlePassRepository: Repository<BattlePass> =
        AppDataSource.getRepository(BattlePass)
    const userBattlePassRepository: Repository<UserBattlePass> =
        AppDataSource.getRepository(UserBattlePass)

    const totalExperience = user.experience

    // Get all battle pass levels ordered by required experience
    const battlePassLevels = await battlePassRepository.find({
        order: { requiredExperience: "ASC" },
    })

    let newlyClosedLevelIds: number[] = []

    for (const level of battlePassLevels) {
        if (totalExperience >= level.requiredExperience) {
            // Check if the user has already closed this level
            let userBattlePass = await userBattlePassRepository.findOne({
                where: { user: user, battlePass: level },
            })

            if (!userBattlePass) {
                // Create a new record if it doesn't exist
                userBattlePass = userBattlePassRepository.create({
                    user: user,
                    battlePass: level,
                    progress: level.requiredExperience,
                    levelClosed: true,
                })
                await userBattlePassRepository.save(userBattlePass)
                newlyClosedLevelIds.push(level.id)
            } else if (!userBattlePass.levelClosed) {
                // Update the existing record
                userBattlePass.levelClosed = true
                await userBattlePassRepository.save(userBattlePass)
                newlyClosedLevelIds.push(level.id)
            } else {
                // Level already closed previously
                continue
            }
        } else {
            // No more levels can be closed with the current experience
            break
        }
    }

    return newlyClosedLevelIds
}

router.post(
    "/mint-and-send-nft",
    async (req: Request<{}, {}, MintAndSendNFTRequest>, res: Response) => {
        const { userName, battlepassId, destinationAddress } = req.body

        try {
            const mintService = new MintSolanaNFTService(
                userName,
                battlepassId,
                "image.png"
            )

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

        if (!isTaskCompleted) {
            return res.status(200).json({
                isFinished: isTaskCompleted,
            })
        }
        const userRepository: Repository<User> =
            AppDataSource.getRepository(User)

        const user = await userRepository.findOne({ where: { id: userId } })
        if (!user) throw new Error("User not found")

        const closedLevelIds = await getUserClosedLevels(user)

        const userName = user.firstName
        const destinationAddress = user.walletAddress
        if (!user.walletAddress) {
            throw new Error("User does not have a wallet address.")
        }

        const battlePassRepository = AppDataSource.getRepository(BattlePass)
        for (const levelId of closedLevelIds) {
            const battlePass = await battlePassRepository.findOne({
                where: {
                    id: levelId,
                },
                relations: ["awards"],
            })

            if (!battlePass) {
                continue
            }

            const awards = battlePass.awards

            for (const award of awards) {
                if (!award.nftId) {
                    continue
                }
                // Proceed with NFT minting and sending
                const mintService = new MintSolanaNFTService(
                    userName,
                    battlePass.id,
                    award.nftId
                )

                const nftPubkey = await mintService.mintNft()

                const sendNFTService = new SendNFT(
                    destinationAddress,
                    nftPubkey,
                    1
                )

                const signature = await sendNFTService.sendToken()

                console.log(`NFT sent with signature: ${signature}`)
            }
        }

        return res.status(200).json({
            isFinished: isTaskCompleted,
        })
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
})

router.get(
    "/battlepass/:battlepass_id",
    async (req: Request, res: Response) => {
        const battlepassId = Number(req.params.battlepass_id)

        try {
            const battlePassRepository: Repository<BattlePass> =
                AppDataSource.getRepository(BattlePass)

            const battlePassLevels = await battlePassRepository.find({
                relations: ["awards"],
            })

            if (battlePassLevels.length === 0) {
                return res.status(404).json({ error: "BattlePass not found" })
            }

            const levels = battlePassLevels.map((battlePass) => {
                const awards = battlePass.awards.map((award) => ({
                    awardId: award.id,
                    nftId: award.nftId,
                    amount: award.amount,
                }))

                return {
                    id: battlePass.id,
                    title: null,
                    status: true, // What is it
                    isPremium: battlePass.isPremium,
                    awards: awards,
                    level: battlePass.stage,
                    experience: battlePass.requiredExperience,
                }
            })

            const data = { levels }

            return res.status(200).json({ data })
        } catch (error: any) {
            console.error("Error in /battlepass/:battlepass_id:", error)
            return res
                .status(500)
                .json({ error: "An unexpected error occurred." })
        }
    }
)

export default router
