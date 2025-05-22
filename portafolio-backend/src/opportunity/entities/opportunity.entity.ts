import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity'; // Importa Organization
import { Application } from '../../application/entities/application.entity'; // Importa Application

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  location: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: true })
  active: boolean;

  // Relación ManyToOne con Organization (una organización puede tener muchas oportunidades)
  // No necesitamos @Column() para organizationId si usamos JoinColumn y la relación correctamente.
  // Sin embargo, si quieres mantener el campo organizationId directamente en la entidad para facilitar, puedes hacerlo.
  // Por simplicidad, mantendremos organizationId aquí como una columna, y TypeORM lo manejará.
  @Column({ type: 'uuid' }) 
  organizationId: string; 

  @ManyToOne(() => Organization, organization => organization.opportunities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' }) // Especifica la columna de la clave foránea
  organization: Organization; // Esta propiedad contendrá el objeto Organization

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relación OneToMany con Application (una oportunidad puede tener muchas aplicaciones)
  @OneToMany(() => Application, application => application.opportunity)
  applications: Application[];
}

