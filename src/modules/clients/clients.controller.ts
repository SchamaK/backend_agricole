import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, ValidationPipe, UsePipes } from '@nestjs/common';
import { ValidationExceptionInterceptor } from 'src/common/exeptions/validation.error.exeption.interceptor';
import { ValidationException } from 'src/common/exeptions/validation.error.exeption';
import { ClientsService } from './clients.service';
import {CreateClientsDtoRequestDto} from "./dtos/clients.dto"
import {DeleteClientsRequestDto} from "./dtos/clients.dto"
import {GetByCriteriaDto} from "./dtos/clients.dto"
import {UpdateClientsRequestDto} from "./dtos/clients.dto"
import { TransformIsDeletedInterceptor } from 'src/common/exeptions/deleted.value.exeption';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('create')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException , TransformIsDeletedInterceptor) // Utilisation de l'intercepteur

  async create(@Body(new ValidationPipe({ whitelist: true, transform: true })) CreateClientsDtoRequestDto: CreateClientsDtoRequestDto) {
    return await this.clientsService.create(CreateClientsDtoRequestDto );
  }



  @Post('update')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException , TransformIsDeletedInterceptor) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async update(@Body(new ValidationPipe({ whitelist: true, transform: true })) updateclientsRequestDto: UpdateClientsRequestDto) {
    // Appel du service pour mettre à jour les utilisateurs
    return await this.clientsService.update(updateclientsRequestDto);
  }
  
  @Post('getByCriteria')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async getByCriteria(@Body(new ValidationPipe({ whitelist: true, transform: true })) getByCriteriaDto: GetByCriteriaDto) {
    return await this.clientsService.getByCriteria(getByCriteriaDto);
  }



 @Post('delete')
    @UseInterceptors(ValidationExceptionInterceptor ,ValidationException) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async delete(@Body(new ValidationPipe({ whitelist: true, transform: true })) deleteclientsRequestDto: DeleteClientsRequestDto) {
    return await this.clientsService.delete(deleteclientsRequestDto);
  }
}
 