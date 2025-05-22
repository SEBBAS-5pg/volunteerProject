import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const newOrganization = this.organizationRepository.create(createOrganizationDto);
    return this.organizationRepository.save(newOrganization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found.`);
    }
    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const organizationToUpdate = await this.organizationRepository.findOne({ where: { id } });
    if (!organizationToUpdate) {
      throw new NotFoundException(`Organization with ID "${id}" not found.`);
    }
    Object.assign(organizationToUpdate, updateOrganizationDto);
    return this.organizationRepository.save(organizationToUpdate);
  }

  async remove(id: string): Promise<{ affected?: number }> {
    const result = await this.organizationRepository.delete(id);
    const affectedCount = result.affected ?? 0;
    if (affectedCount === 0) {
      throw new NotFoundException(`Organization with ID "${id}" not found.`);
    }
    return { affected: affectedCount };
  }}