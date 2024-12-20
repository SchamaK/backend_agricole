
  
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsArray, ValidateNested, IsNumber, Min, IsOptional, IsObject } from 'class-validator';
import { IsNotEmptyArray } from 'src/common/exeptions/is-not-empty-array.exeption';

// DTO pour chaque post individuel
export class Create__Template__Dto {

  @IsString()
  @IsNotEmpty({ message: 'code' })
  code: string;

}

// DTO pour la requête de création de post, contenant l'auteur et les données du post
export class Create__Template__DtoRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'Requette mal formée' })
  @ValidateNested({ each: true }) // Valide chaque élément du tableau `datas`
  @Type(() => Create__Template__Dto) // Applique les validations de `Create__Template__Dto` pour chaque élément
  @IsNotEmptyArray({ message: 'Requette mal formée' }) 
  datas: Create__Template__Dto[];
}


export class Delete__Template__Dto {
  @IsNumber()
  @IsNotEmpty({ message: 'id' })
  id: number;
}

export class Delete__Template__RequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'datas' })
  @IsNotEmptyArray({ message: 'Requette mal formée' }) 
  datas: Delete__Template__Dto[];
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

export class Update__Template__Dto {

  @IsString()
  @IsNotEmpty({ message: 'id' })
  id: string;


  @IsString()
  @IsOptional()
  libelle?: string;
}

export class Update__Template__RequestDto {
  @IsString()
  @IsNotEmpty({ message: 'user' })
  user: string;

  @IsArray()
  @IsNotEmpty({ message: 'datas' })
  @IsNotEmptyArray({ message: 'Requette mal formée' }) 
  datas: Update__Template__Dto[];
}