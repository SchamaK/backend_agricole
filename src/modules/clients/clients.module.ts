import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../../common/entities/Clients';
import { UtilitieService} from '../../common/utilitie/utilitie.service'


@Module({
  imports: [TypeOrmModule.forFeature([Clients])], // Enregistre l'entité Medecin  controllers: [MedecinController],
  providers: [ClientsService , UtilitieService],
  exports: [ClientsService , TypeOrmModule.forFeature([Clients])],
  controllers: [ClientsController ],


})
export class clientsModule {}
