import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, ValidationPipe, UsePipes } from '@nestjs/common';
import { ValidationExceptionInterceptor } from 'src/common/exeptions/validation.error.exeption.interceptor';
import { ValidationException } from 'src/common/exeptions/validation.error.exeption';
import { __Template__Service } from './__template__.service';
import {Create__Template__DtoRequestDto} from "./dtos/__template__.dto"
import {Delete__Template__RequestDto} from "./dtos/__template__.dto"
import {GetByCriteriaDto} from "./dtos/__template__.dto"
import {Update__Template__RequestDto} from "./dtos/__template__.dto"
import { TransformIsDeletedInterceptor } from 'src/common/exeptions/deleted.value.exeption';

@Controller('__template__')
export class __Template__Controller {
  constructor(private readonly __template__Service: __Template__Service) {}

  @Post('create')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException , TransformIsDeletedInterceptor) // Utilisation de l'intercepteur

  async create(@Body(new ValidationPipe({ whitelist: true, transform: true })) Create__Template__DtoRequestDto: Create__Template__DtoRequestDto) {
    return await this.__template__Service.create(Create__Template__DtoRequestDto );
  }



  @Post('update')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException , TransformIsDeletedInterceptor) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async update(@Body(new ValidationPipe({ whitelist: true, transform: true })) update__template__RequestDto: Update__Template__RequestDto) {
    // Appel du service pour mettre à jour les utilisateurs
    return await this.__template__Service.update(update__template__RequestDto);
  }
  
  @Post('getByCriteria')
     @UseInterceptors(ValidationExceptionInterceptor ,ValidationException) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async getByCriteria(@Body(new ValidationPipe({ whitelist: true, transform: true })) getByCriteriaDto: GetByCriteriaDto) {
    return await this.__template__Service.getByCriteria(getByCriteriaDto);
  }



 @Post('delete')
    @UseInterceptors(ValidationExceptionInterceptor ,ValidationException) // Utilisation de l'intercepteur
 // Utilisation de l'intercepteur
  async delete(@Body(new ValidationPipe({ whitelist: true, transform: true })) delete__template__RequestDto: Delete__Template__RequestDto) {
    return await this.__template__Service.delete(delete__template__RequestDto);
  }
}
 