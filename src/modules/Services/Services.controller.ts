import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, ValidationPipe, UsePipes } from '@nestjs/common';
import { ValidationExceptionInterceptor } from 'src/common/exeptions/validation.error.exeption.interceptor';
import { ValidationException } from 'src/common/exeptions/validation.error.exeption';
import { ServicesService } from './Services.service';
import {CreateServicesDtoRequestDto} from "./dtos/Services.dto"
import {DeleteServicesRequestDto} from "./dtos/Services.dto"
import {GetByCriteriaDto} from "./dtos/Services.dto"
import {UpdateServicesRequestDto} from "./dtos/Services.dto"
import { TransformIsDeletedInterceptor } from 'src/common/exeptions/deleted.value.exeption';

@Controller('Services')
export class ServicesController {
  constructor(private readonly ServicesService: ServicesService) {}

  @Post('create')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException , TransformIsDeletedInterceptor) // Utilisation de l'intercepteur

  async create(@Body(new ValidationPipe({ whitelist: true, transform: true })) CreateServicesDtoRequestDto: CreateServicesDtoRequestDto) {
    return await this.ServicesService.create(CreateServicesDtoRequestDto );
  }



  @Post('update')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException , TransformIsDeletedInterceptor) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async update(@Body(new ValidationPipe({ whitelist: true, transform: true })) updateServicesRequestDto: UpdateServicesRequestDto) {
    // Appel du service pour mettre à jour les utilisateurs
    return await this.ServicesService.update(updateServicesRequestDto);
  }
  
  @Post('getByCriteria')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async getByCriteria(@Body(new ValidationPipe({ whitelist: true, transform: true })) getByCriteriaDto: GetByCriteriaDto) {
    return await this.ServicesService.getByCriteria(getByCriteriaDto);
  }



 @Post('delete')
    @UseInterceptors(ValidationExceptionInterceptor ,ValidationException) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async delete(@Body(new ValidationPipe({ whitelist: true, transform: true })) deleteServicesRequestDto: DeleteServicesRequestDto) {
    return await this.ServicesService.delete(deleteServicesRequestDto);
  }
}
 