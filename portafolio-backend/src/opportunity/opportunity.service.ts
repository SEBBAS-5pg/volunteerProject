import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { OrganizationService } from '../organization/organization.service';
import { Repository } from 'typeorm';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
    private organizationService: OrganizationService
  ){}
  async create(createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
    const organization = await this.organizationService.findOne(createOpportunityDto.organizationId); 
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${createOpportunityDto.organizationId}" not found.`);
    }

    const newOpportunity = this.opportunityRepository.create({
      ...createOpportunityDto,
      startDate: new Date(createOpportunityDto.startDate),
      endDate: new Date(createOpportunityDto.endDate),
      organization: organization,
    });
    return await this.opportunityRepository.save(newOpportunity); 
  }

  async findAll(): Promise<Opportunity[]> {
    return await this.opportunityRepository.find({ 
      relations: ['organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({ where: { id }, relations: ['organization'] }); // <-- await
    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID "${id}" not found.`);
    }
    return opportunity;
  }

  async update(id: string, updateOpportunityDto: UpdateOpportunityDto): Promise<Opportunity> {
    const opportunityToUpdate = await this.opportunityRepository.findOne({ where: { id } }); 
    if (!opportunityToUpdate) {
      throw new NotFoundException(`Opportunity with ID "${id}" not found.`);
    }

    if (updateOpportunityDto.organizationId) {
      const newOrganization = await this.organizationService.findOne(updateOpportunityDto.organizationId); 
      if (!newOrganization) {
        throw new NotFoundException(`Organization with ID "${updateOpportunityDto.organizationId}" not found.`);
      }
      opportunityToUpdate.organization = newOrganization;
    }

    if (updateOpportunityDto.startDate) {
      opportunityToUpdate.startDate = new Date(updateOpportunityDto.startDate);
    }
    if (updateOpportunityDto.endDate) {
      opportunityToUpdate.endDate = new Date(updateOpportunityDto.endDate);
    }

    Object.assign(opportunityToUpdate, updateOpportunityDto);
    return await this.opportunityRepository.save(opportunityToUpdate); 
  }

  async remove(id: string): Promise<{ affected?: number }> {
    const result = await this.opportunityRepository.delete(id);
    const affectedCount = result.affected?? 0
    if(affectedCount === 0){
      throw new NotFoundException(`Opportunity with ID "${id}" not found.`);
    }
    return { affected: affectedCount };
  }
}

