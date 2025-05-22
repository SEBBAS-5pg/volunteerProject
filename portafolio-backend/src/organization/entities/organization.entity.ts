import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Opportunity } from '../../opportunity/entities/opportunity.entity'; // Importa Opportunity

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ type: 'text' })
  description: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  // Relaciones
  @OneToMany(() => Opportunity, opportunity => opportunity.organization)
  opportunities: Opportunity[]
  logoUrl: void;
}