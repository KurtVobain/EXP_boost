import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserBattlePass } from "./UserBattlePass"

@Entity("BattlePass")
export class BattlePass {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    stage: number

    @Column()
    requiredExperience: number

    @Column()
    reward: string

    @OneToMany(
        () => UserBattlePass,
        (userBattlePass) => userBattlePass.battlePass
    )
    userBattlePasses: UserBattlePass[]
}