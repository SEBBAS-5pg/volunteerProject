import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { OpportunityService } from '../opportunity/opportunity.service';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private userService : UserService,
    private opportunityService : OpportunityService
  ){}
  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const user = await this.userService.findOne(createApplicationDto.userId); 
    if (!user) {
      throw new NotFoundException(`User with ID "${createApplicationDto.userId}" not found.`);
    }

    const opportunity = await this.opportunityService.findOne(createApplicationDto.opportunityId); 
    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID "${createApplicationDto.opportunityId}" not found.`);
    }

    const existingApplication = await this.applicationRepository.findOne({ 
      where: {
        userID: createApplicationDto.userId,
        opportunityId: createApplicationDto.opportunityId,
      },
    });
    if (existingApplication) {
      throw new ConflictException(`User "${createApplicationDto.userId}" has already applied to opportunity "${createApplicationDto.opportunityId}".`);
    }

    const newApplication = this.applicationRepository.create({
      ...createApplicationDto,
      user: user,
      opportunity: opportunity,
    });
    return await this.applicationRepository.save(newApplication); 
  }

  async findAll(): Promise<Application[]> {
    return await this.applicationRepository.find({ 
      relations: ['user', 'opportunity'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({ where: { id }, relations: ['user', 'opportunity'] });
    if (!application) {
      throw new NotFoundException(`Application with ID "${id}" not found.`);
    }
    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const applicationToUpdate = await this.applicationRepository.findOne({ where: { id } }); 
    if (!applicationToUpdate) {
      throw new NotFoundException(`Application with ID "${id}" not found.`);
    }

    if (updateApplicationDto.userId || updateApplicationDto.opportunityId) {
        throw new ConflictException('Cannot change userId or opportunityId of an existing application.');
    }

    Object.assign(applicationToUpdate, updateApplicationDto);
    return await this.applicationRepository.save(applicationToUpdate); 
  }

  async remove(id: string): Promise<{ affected?: number }> {
    const result = await this.applicationRepository.delete(id); 
    const affectedCount = result.affected?? 0
    if (affectedCount === 0) {
      throw new NotFoundException(`Application with ID "${id}" not found.`);
    }
    return { affected: affectedCount };
  }
}
