
  
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsArray, ValidateNested, IsNumber, Min, IsOptional, IsObject } from 'class-validator';
import { IsNotEmptyArray } from 'src/common/exeptions/is-not-empty-array.exeption';

// DTO pour chaque post individuel
export class CreateServicesDto {

  @IsString()
  @IsNotEmpty({ message: 'libelle' })
  libelle: string;

  @IsString()
  @IsOptional()
  description : string;

}

// DTO pour la requête de création de post, contenant l'auteur et les données du post
export class CreateServicesDtoRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'Requette mal formée' })
  @ValidateNested({ each: true }) // Valide chaque élément du tableau `datas`
  @Type(() => CreateServicesDto) // Applique les validations de `CreateServicesDto` pour chaque élément
  @IsNotEmptyArray({ message: 'Requette mal formée' }) 
  datas: CreateServicesDto[];
}


export class DeleteServicesDto {
  @IsNumber()
  @IsNotEmpty({ message: 'id' })
  id: number;
}

export class DeleteServicesRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'datas' })
  @IsNotEmptyArray({ message: 'Requette mal formée' }) 
  datas: DeleteServicesDto[];
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
  index: number = 1; // Valeur par défaut

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Le limit doit être supérieure ou égale à 1' })
  size: number = 10; // Valeur par défaut
}

export class UpdateServicesDto {

  @IsString()
  @IsNotEmpty({ message: 'id' })
  id: string;


  @IsString()
  @IsOptional()
  libelle?: string;

  @IsString()
  @IsOptional()
  description ? : string;
}

export class UpdateServicesRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'datas' })
  @IsNotEmptyArray({ message: 'Requette mal formée' }) 
  datas: UpdateServicesDto[];
}