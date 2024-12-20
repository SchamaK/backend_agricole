import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotEmptyArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Array.isArray(value) && value.length > 0; // Vérifie que c'est un tableau non vide
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} doit contenir au moins un élément.`;
        },
      },
    });
  };
}
