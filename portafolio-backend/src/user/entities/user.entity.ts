import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../../common/enums";
import { Application } from '../../application/entities/application.entity'; // Importa Application


@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT,
    })
    role: Role

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp'})
    updateAt: Date

    @OneToMany(() => Application, application => application.user)
    applications: Application[]
}