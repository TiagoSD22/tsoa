import { ExtendedSpecConfig } from '../cli';
import { Tsoa } from '../metadataGeneration/tsoa';
import { Swagger } from './swagger';
export declare abstract class SpecGenerator {
  protected readonly metadata: Tsoa.Metadata;
  protected readonly config: ExtendedSpecConfig;
  constructor(metadata: Tsoa.Metadata, config: ExtendedSpecConfig);
  protected buildAdditionalProperties(type: Tsoa.Type): Swagger.Schema | Swagger.BaseSchema;
  protected getOperationId(methodName: string): string;
  throwIfNotDataFormat(strToTest: string): Swagger.DataFormat;
  throwIfNotDataType(strToTest: string): Swagger.DataType;
  protected getSwaggerType(type: Tsoa.Type): Swagger.Schema | Swagger.BaseSchema;
  protected abstract getSwaggerTypeForUnionType(type: Tsoa.UnionType): any;
  protected abstract getSwaggerTypeForIntersectionType(type: Tsoa.IntersectionType): any;
  protected abstract buildProperties(
    properties: Tsoa.Property[],
  ): {
    [propertyName: string]: Swagger.Schema | Swagger.Schema3;
  };
  getSwaggerTypeForObjectLiteral(objectLiteral: Tsoa.NestedObjectLiteralType): Swagger.Schema;
  protected getSwaggerTypeForReferenceType(referenceType: Tsoa.ReferenceType): Swagger.BaseSchema;
  protected getSwaggerTypeForVoid(dataType: 'void'): Swagger.BaseSchema;
  protected determineImplicitAdditionalPropertiesValue: () => boolean;
  protected getSwaggerTypeForPrimitiveType(dataType: Tsoa.PrimitiveTypeLiteral): Swagger.Schema;
  protected getSwaggerTypeForArrayType(arrayType: Tsoa.ArrayType): Swagger.Schema;
  protected determineTypesUsedInEnum(anEnum: Array<string | number | boolean | null>): Set<'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'>;
  protected abstract getSwaggerTypeForEnumType(enumType: Tsoa.EnumType): Swagger.Schema2 | Swagger.Schema3;
}
