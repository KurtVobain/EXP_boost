import { Router, Request, Response } from "express"
import { config } from "../config"
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import AppDataSource from "../data-source"
import { User } from "../entities/User"
import { Course } from "../entities/Course"
import { UserCourse } from "../entities/UserCourse"
import LearnWeb3Parser from "../services/checkLearnWeb3"

const router = Router()

router.post(
    "/auth/register",
    [
        body("firstName").notEmpty().withMessage("First name is required"),
        body("lastName").notEmpty().withMessage("Last name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        body("walletAddress")
            .notEmpty()
            .withMessage("Solana wallet address is required"),
        body("learnWeb3url")
            .notEmpty()
            .withMessage("LearnWeb3 profile url is required"),
    ],
    async (req: Request, res: Response) => {
        const userRepository = AppDataSource.getRepository(User)
        const courseRepository = AppDataSource.getRepository(Course)
        const userCourseRepository = AppDataSource.getRepository(UserCourse)

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            firstName,
            lastName,
            email,
            password,
            walletAddress,
            learnWeb3url,
        } = req.body

        try {
            const existingUser = await userRepository.findOne({
                where: { email },
            })
            if (existingUser) {
                return res.status(400).json({ error: "Email already in use" })
            }

            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            const user = userRepository.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                walletAddress,
            })

            await userRepository.save(user)

            const defaultCourseId = 1
            const course = await courseRepository.findOne({
                where: { id: defaultCourseId },
            })
            if (!course) {
                return res
                    .status(500)
                    .json({ error: "Default course not found" })
            }

            let nickname: string
            try {
                const url = new URL(learnWeb3url)
                const pathname = url.pathname
                const pathSegments = pathname.split("/")

                nickname = pathSegments[2]
                if (!nickname) {
                    throw new Error()
                }
            } catch (error) {
                return res
                    .status(400)
                    .json({ error: "Invalid LearnWeb3 URL format" })
            }

            const parser = new LearnWeb3Parser(user.id)
            const html = await parser.asyncRequest(learnWeb3url)
            const parsedData = await parser.parseResponse(html)

            const userCourse = userCourseRepository.create({
                user: user,
                course: course,
                nickname: nickname,
                parsedData: parsedData,
            })
            await userCourseRepository.save(userCourse)

            const token = jwt.sign({ userId: user.id }, config.jwtToken, {
                expiresIn: "1h",
            })
            const { password: _, ...userData } = user

            res.status(201).json({
                message: "User registered successfully",
                user: userData,
                token,
            })
        } catch (error) {
            console.error("Error in /auth/register:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    }
)

router.post(
    "/auth/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req: Request, res: Response) => {
        const userRepository = AppDataSource.getRepository(User)

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try {
            const user = await userRepository.findOne({ where: { email } })

            if (!user) {
                return res.status(400).json({ error: "Invalid credentials" })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.jwtToken as string,
                { expiresIn: "1h" }
            )

            const { password: _, ...userData } = user

            res.status(200).json({
                message: "Login successful",
                user: userData,
                token,
            })
        } catch (error) {
            console.error("Error in /auth/login:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    }
)

export default router
