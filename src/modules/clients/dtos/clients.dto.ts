import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsOptional,
  IsObject,
} from 'class-validator';
import { IsNotEmptyArray } from 'src/common/exeptions/is-not-empty-array.exeption';

export class CreateClient_subscriptionDto {
  @IsNumber()
  @IsNotEmpty({ message: 'servicesId' })
  servicesId: number;

  @IsString()
  @IsNotEmpty({ message: 'nom' })
  nom: string;

  @IsString()
  @IsNotEmpty({ message: 'prenom' })
  prenom: string;

  @IsString()
  @IsNotEmpty({ message: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'telephone' })
  telephone: string;

  @IsString()
  @IsOptional()
  commentaire?: string;
}

export class CreateClientsDtoRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'Requette mal formée' })
  @ValidateNested({ each: true })
  @Type(() => CreateClient_subscriptionDto)
  @IsNotEmptyArray({ message: 'Requette mal formée' })
  datas: CreateClient_subscriptionDto[];
}

export class DeleteClient_subscriptionDto {
  @IsNumber()
  @IsNotEmpty({ message: 'id' })
  id: number;
}

export class DeleteClientsRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'datas' })
  @IsNotEmptyArray({ message: 'Requette mal formée' })
  datas: DeleteClient_subscriptionDto[];
}

export class GetByCriteriaDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsObject()
  @IsOptional()
  data: Record<string, any>;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'La page doit être supérieure ou égale à 1' })
  index = 1;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Le limit doit être supérieure ou égale à 1' })
  size = 10;
}

export class UpdateClientsDto {
  @IsString()
  @IsNotEmpty({ message: 'id' })
  id: string;

  @IsNumber()
  @IsOptional()
  servicesId?: number;

  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  prenom?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  commentaire?: string;
}

export class UpdateClientsRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'datas' })
  @IsNotEmptyArray({ message: 'Requette mal formée' })
  datas: UpdateClientsDto[];
}