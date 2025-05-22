import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApplicationStatus } from "src/common/enums";
import { User } from "src/user/entities/user.entity";
import { Opportunity } from "src/opportunity/entities/opportunity.entity";


@Entity('applications')
export class Application{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid'})
    userID: string

    @ManyToOne(() => User, user => user.applications, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'userID'})
    user: User

    @Column({ type: 'uuid'})
    opportunityId: string

    @ManyToOne(() => Opportunity, opportunity => opportunity.applications, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'opportunityID'})
    opportunity: Opportunity

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING
    })
    status: ApplicationStatus

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date
}