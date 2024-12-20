import { clientsModule } from './modules/clients/clients.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './modules/Services/Services.module';


@Module({
  imports: [
    ServicesModule,
    clientsModule,
  
    // Chargement des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true, // Les variables d'environnement sont accessibles globalement
      envFilePath: '.env', // Chemin vers le fichier d'environnement
    }),

    // Configuration TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql', // Choisissez votre SGBD (mysql, postgres, sqlite, etc.)
      host: process.env.DB_HOST, // Adresse de la base de données
      port: +process.env.DB_PORT, // Port de la base de données
      username: process.env.DB_USERNAME, // Nom d'utilisateur
      password: process.env.DB_PASSWORD, // Mot de passe
      database: process.env.DB_DATABASE, // Nom de la base
      entities: [__dirname + '/common/entities/*{.ts,.js}'], // Inclusion automatique des entités
      synchronize: process.env.TYPEORM_SYNC === 'true', // Synchronisation automatique (uniquement pour développement)
      logging: true, // Activez les logs des requêtes pour le débogage
    }),
    // Ajout des modules de l'application
   
  ],
})
export class AppModule { }
