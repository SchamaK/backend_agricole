import { Module } from '@nestjs/common';
import { ServicesController } from './Services.controller';
import { ServicesService } from './Services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../../common/entities/Services';
import { UtilitieService} from '../../common/utilitie/utilitie.service'


@Module({
  imports: [TypeOrmModule.forFeature([Services])], // Enregistre l'entité Medecin  controllers: [MedecinController],
  providers: [ServicesService , UtilitieService],
  exports: [ServicesService , TypeOrmModule.forFeature([Services])],
  controllers: [ServicesController ],


})
export class ServicesModule {}
