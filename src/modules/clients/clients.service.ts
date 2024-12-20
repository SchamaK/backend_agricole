import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Connection,
  EntityMetadata,
  DeepPartial,
  In,
} from 'typeorm';
import { Clients } from '../../common/entities/Clients';
import { CreateClientsDtoRequestDto } from './dtos/clients.dto';
import { UpdateClientsRequestDto } from './dtos/clients.dto';
import { ValidationException } from 'src/common/exeptions/validation.error.exeption';
import { DeleteClientsRequestDto } from './dtos/clients.dto';
import { GetByCriteriaDto } from './dtos/clients.dto';
import { UtilitieService } from '../../common/utilitie/utilitie.service';

@Injectable()
export class ClientsService {
  private relationRepositories: { [key: string]: Repository<any> } = {};

  constructor(
    @InjectRepository(Clients)
    private ClientsRepository: Repository<Clients>,
    private connection: Connection, // Permet d'accéder à toutes les entités et métadonnées
    private utlity: UtilitieService,
  ) {
    this.initializeRelationRepositories();
  }

  private initializeRelationRepositories() {
    const metadata: EntityMetadata = this.connection.getMetadata(Clients);
    metadata.relations.forEach((relation) => {
      const repository = this.connection.getRepository(relation.type);
      this.relationRepositories[relation.propertyName] = repository;
    });
  }

  private async validateRelations(entityData: any) {
    for (const [relationName, repository] of Object.entries(
      this.relationRepositories,
    )) {
      if (entityData[`${relationName}Id`]) {
        const relatedEntity = await repository.findOne({
          where: { id: entityData[`${relationName}Id`], isDeleted: false },
        });

        if (!relatedEntity) {
          throw new ValidationException(
            `L'entité liée avec l'ID ${
              entityData[`${relationName}Id`]
            } (${relationName}) n'existe pas ou est supprimée.`,
          );
        }
      }
    }
  }

  async create(
    CreateClientsDtoRequestDto: CreateClientsDtoRequestDto,
  ): Promise<Clients[]> {
    const { datas } = CreateClientsDtoRequestDto;
    const createdEntities: Clients[] = []; // Tableau pour stocker les entités créées

    if (!datas || datas.length === 0) {
      throw new ValidationException('Aucune donnée fournie pour la création.');
    }

    for (const data of datas) {
      // Vérification des doublons
      const existingEntity = await this.ClientsRepository.findOne({
        where: data,
      });
      if (existingEntity) {
        throw new ValidationException(
          'Un enregistrement identique existe déjà.',
        );
      }

      // Validation dynamique des relations
      await this.validateRelations(data);

      // Création de l'entité
      const newEntity: any = this.ClientsRepository.create(
        data as unknown as DeepPartial<Clients>,
      ) as Clients;
      if (newEntity?.password) {
        newEntity.password = await this.utlity.hashPassword(newEntity.password); // Hashage
      }
      const moduleName = 'Clients';
      newEntity['code'] = this.utlity.generateCode(moduleName);
      newEntity['createdAt'] = new Date();
      newEntity['createdBy'] = CreateClientsDtoRequestDto.user;
      newEntity['isDeleted'] = false;

      // Sauvegarder l'entité
      const savedEntity = await this.ClientsRepository.save(newEntity);

      // Ajouter l'entité détaillée à la liste
      const detailedEntity = await this.ClientsRepository.findOne({
        where: { id: savedEntity.id },
        relations: Object.keys(this.relationRepositories),
      });

      if (detailedEntity) {
        createdEntities.push(detailedEntity);
      }
    }

    return createdEntities; // Retourne toutes les entités créées
  }

  async update(
    updateClientsRequestDto: UpdateClientsRequestDto,
  ): Promise<Clients[]> {
    const { datas } = updateClientsRequestDto;
    const updatedEntities: Clients[] = []; // Tableau pour stocker les entités mises à jour

    if (!datas || datas.length === 0) {
      throw new ValidationException(
        'Aucune donnée fournie pour la mise à jour.',
      );
    }

    for (const data of datas) {
      if (!data.id) {
        throw new ValidationException(
          'Le champ "id" est requis pour effectuer une mise à jour.',
        );
      }

      const existingEntity = await this.ClientsRepository.findOne({
        where: { id: data.id },
      });

      if (!existingEntity) {
        throw new ValidationException(
          `L'entité avec l'ID ${data.id} n'existe pas.`,
        );
      }

      // Validation dynamique des relations
      await this.validateRelations(data);

      // Fusion des données existantes avec les nouvelles données
      const updatedData: any = {
        ...existingEntity,
        ...data,
        updatedAt: new Date(),
        createdBy: updateClientsRequestDto.user,
      };

      // Mise à jour de l'entité
      const updatedEntity = await this.ClientsRepository.save(updatedData);

      // Ajouter l'entité détaillée à la liste
      const detailedEntity = await this.ClientsRepository.findOne({
        where: { id: updatedEntity.id },
        relations: Object.keys(this.relationRepositories),
      });

      if (detailedEntity) {
        updatedEntities.push(detailedEntity);
      }
    }

    return updatedEntities; // Retourne toutes les entités mises à jour
  }

  async getByCriteria(
    getByCriteriaDto: GetByCriteriaDto,
  ): Promise<{
    data: Clients[];
    count: number;
    index: number;
    size: number;
  }> {
    const { data, index, size } = getByCriteriaDto;
    const skip = (index - 1) * size;

    const [results, count] = await this.ClientsRepository.findAndCount({
      where: { isDeleted: false },
      skip,
      take: size,
      relations: Object.keys(this.relationRepositories),
    });

    // Transformez "isDeleted" dans la réponse
    const transformedResults = results.map((item) => {
      let isDeleted: boolean = false;

      if (Buffer.isBuffer(item.isDeleted)) {
        // Si c'est un Buffer, on le transforme en booléen
        isDeleted = item.isDeleted.readInt8(0) === 1;
      } else if (typeof item.isDeleted === 'boolean') {
        // Si c'est déjà un boolean, on le garde tel quel
        isDeleted = item.isDeleted;
      } else if (item.isDeleted === 1 || item.isDeleted === '1') {
        // Si la valeur est 1 (ou "1"), on considère que c'est true
        isDeleted = true;
      }

      return {
        ...item,
        isDeleted,
      };
    });

    return {
      data: transformedResults,
      count,
      index,
      size,
    };
  }

  async delete(
    deleteClientsRequestDto: DeleteClientsRequestDto,
  ): Promise<Clients> {
    const { datas } = deleteClientsRequestDto;

    if (!datas || datas.length === 0) {
      throw new ValidationException(
        'Requête mal formée : aucune donnée à supprimer.',
      );
    }

    const entityData = datas[0];

    if (!entityData || !entityData.id) {
      throw new ValidationException(
        'Donnée manquante ou invalide : id requis.',
      );
    }

    // Rechercher l'entité dans la base de données
    const entity = await this.ClientsRepository.findOne({
      where: { id: entityData.id, isDeleted: false },
    });

    if (!entity) {
      throw new ValidationException(
        `L'entité avec l'ID ${entityData.id} est introuvable ou déjà supprimée.`,
      );
    }

    // Vérifier si l'entité est référencée dans d'autres tables via des clés étrangères
    const metadata = this.ClientsRepository.metadata;
    for (const relation of metadata.relations) {
      const relatedRepository = this.connection.getRepository(relation.type);
      const relatedEntities = await relatedRepository.find({
        where: {
          [relation.propertyName]: entityData.id,
          isDeleted: false,
        },
      });

      if (relatedEntities.length > 0) {
        throw new ValidationException(
          `L'entité avec l'ID ${entityData.id} est référencée dans la table "${relation.type}". Suppression impossible.`,
        );
      }
    }

    // Marquer l'entité comme supprimée
    entity.isDeleted = true;
    entity.deletedAt = new Date();
    entity.deletedBy = deleteClientsRequestDto.user;
    await this.ClientsRepository.save(entity);

    return entity; // Retourner l'entité mise à jour
  }
}
