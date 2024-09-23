import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserCourse } from "./UserCourse"
import { UserTask } from "./UserTask"
import { UserBattlePass } from "./UserBattlePass"

@Entity("Users")
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ default: 0 })
    profileLevel: number

    @Column({ default: 0 })
    experience: number

    @OneToMany(() => UserCourse, (userCourse) => userCourse.user)
    userCourses: UserCourse[]

    @OneToMany(() => UserTask, (userTask) => userTask.user)
    userTasks: UserTask[]

    @OneToMany(() => UserBattlePass, (userBattlePass) => userBattlePass.user)
    userBattlePasses: UserBattlePass[]
}
