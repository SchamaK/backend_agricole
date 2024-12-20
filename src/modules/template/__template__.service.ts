import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Connection,
  EntityMetadata,
  DeepPartial,
  In,
} from 'typeorm';
import { __Template__ } from '../../common/entities/__Template__';
import { Create__Template__DtoRequestDto } from './dtos/__template__.dto';
import { Update__Template__RequestDto } from './dtos/__template__.dto';
import { ValidationException } from 'src/common/exeptions/validation.error.exeption';
import { Delete__Template__RequestDto } from './dtos/__template__.dto';
import { GetByCriteriaDto } from './dtos/__template__.dto';
import { UtilitieService } from '../../common/utilitie/utilitie.service';

@Injectable()
export class __Template__Service {
  private relationRepositories: { [key: string]: Repository<any> } = {};

  constructor(
    @InjectRepository(__Template__)
    private __Template__Repository: Repository<__Template__>,
    private connection: Connection, // Permet d'accéder à toutes les entités et métadonnées
    private utlity: UtilitieService,
  ) {
    this.initializeRelationRepositories();
  }

  private initializeRelationRepositories() {
    const metadata: EntityMetadata = this.connection.getMetadata(__Template__);
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
    Create__Template__DtoRequestDto: Create__Template__DtoRequestDto,
  ): Promise<__Template__[]> {
    const { datas } = Create__Template__DtoRequestDto;
    const createdEntities: __Template__[] = []; // Tableau pour stocker les entités créées

    if (!datas || datas.length === 0) {
      throw new ValidationException('Aucune donnée fournie pour la création.');
    }

    for (const data of datas) {
      // Vérification des doublons
      const existingEntity = await this.__Template__Repository.findOne({
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
      const newEntity: any = this.__Template__Repository.create(
        data as unknown as DeepPartial<__Template__>,
      ) as __Template__;
      if (newEntity?.password) {
        newEntity.password = await this.utlity.hashPassword(newEntity.password); // Hashage
      }
      const moduleName = '__Template__';
      newEntity['code'] = this.utlity.generateCode(moduleName);
      newEntity['createdAt'] = this.utlity.formatToFrenchDateTime(new Date());
      newEntity['createdBy'] = Create__Template__DtoRequestDto.user;
      newEntity['isDeleted'] = false;

      // Sauvegarder l'entité
      const savedEntity = await this.__Template__Repository.save(newEntity);

      // Ajouter l'entité détaillée à la liste
      const detailedEntity = await this.__Template__Repository.findOne({
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
    update__Template__RequestDto: Update__Template__RequestDto,
  ): Promise<__Template__[]> {
    const { datas } = update__Template__RequestDto;
    const updatedEntities: __Template__[] = []; // Tableau pour stocker les entités mises à jour

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

      const existingEntity = await this.__Template__Repository.findOne({
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
        updatedAt: this.utlity.formatToFrenchDateTime(new Date()),
        createdBy: update__Template__RequestDto.user,
      };

      // Mise à jour de l'entité
      const updatedEntity = await this.__Template__Repository.save(updatedData);

      // Ajouter l'entité détaillée à la liste
      const detailedEntity = await this.__Template__Repository.findOne({
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
    data: __Template__[];
    count: number;
    index: number;
    size: number;
  }> {
    const { data, index, size } = getByCriteriaDto;
    const skip = (index - 1) * size;

    const [results, count] = await this.__Template__Repository.findAndCount({
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
    delete__Template__RequestDto: Delete__Template__RequestDto,
  ): Promise<__Template__> {
    const { datas } = delete__Template__RequestDto;

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
    const entity = await this.__Template__Repository.findOne({
      where: { id: entityData.id, isDeleted: false },
    });

    if (!entity) {
      throw new ValidationException(
        `L'entité avec l'ID ${entityData.id} est introuvable ou déjà supprimée.`,
      );
    }

    // Vérifier si l'entité est référencée dans d'autres tables via des clés étrangères
    const metadata = this.__Template__Repository.metadata;
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
    entity.deletedAt = this.utlity.formatToFrenchDateTime(new Date());
    // entity.deletedBy = delete__Template__RequestDto.user;
    await this.__Template__Repository.save(entity);

    return entity; // Retourner l'entité mise à jour
  }
}
