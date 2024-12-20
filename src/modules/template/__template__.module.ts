import { Module } from '@nestjs/common';
import { __Template__Controller } from './__template__.controller';
import { __Template__Service } from './__template__.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { __Template__ } from '../../common/entities/__Template__';
import { UtilitieService} from '../../common/utilitie/utilitie.service'


@Module({
  imports: [TypeOrmModule.forFeature([__Template__])], // Enregistre l'entité Medecin  controllers: [MedecinController],
  providers: [__Template__Service , UtilitieService],
  exports: [__Template__Service , TypeOrmModule.forFeature([__Template__])],
  controllers: [__Template__Controller ],


})
export class __template__Module {}
