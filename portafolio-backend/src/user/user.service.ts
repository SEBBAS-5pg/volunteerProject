import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, 
  ){}

  async create(createUserDto: CreateUserDto): Promise<User>{
    const newUser = this.userRepository.create({
      ...createUserDto
    })
    return await this.userRepository.save(newUser)
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'desc' }
    })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: {id}});
    if(!user){
      throw new NotFoundException(`User with ID "${id}" not found.`)
    }
    return user
  }
  async findByEmail(email: string): Promise<User | null>{
    return await this.userRepository.findOne({where: {email}})
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({where: {id}})
    if(!userToUpdate){
      throw new NotFoundException(`User with ID "${id}" not found.`)
    }
    Object.assign(userToUpdate, updateUserDto)
    return await this.userRepository.save(userToUpdate);
  }

  async remove(id: string): Promise<number> {
    const result = await this.userRepository.delete(id)
    const affectedRows = result.affected ?? 0

    if(affectedRows === 0){
      throw new NotFoundException(`User with ID "${id}" not found.`)
    }
    return affectedRows
  }
}
