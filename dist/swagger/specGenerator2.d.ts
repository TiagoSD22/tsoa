import { ExtendedSpecConfig } from '../cli';
import { Tsoa } from '../metadataGeneration/tsoa';
import { SpecGenerator } from './specGenerator';
import { Swagger } from './swagger';
export declare class SpecGenerator2 extends SpecGenerator {
  protected readonly metadata: Tsoa.Metadata;
  protected readonly config: ExtendedSpecConfig;
  constructor(metadata: Tsoa.Metadata, config: ExtendedSpecConfig);
  GetSpec(): Swagger.Spec2;
  private buildDefinitions;
  private buildPaths;
  private buildMethod;
  protected buildOperation(controllerName: string, method: Tsoa.Method): Swagger.Operation;
  private buildBodyPropParameter;
  private buildParameter;
  protected buildProperties(
    source: Tsoa.Property[],
  ): {
    [propertyName: string]: Swagger.Schema;
  };
  protected getSwaggerTypeForUnionType(type: Tsoa.UnionType): Swagger.BaseSchema;
  protected getSwaggerTypeForIntersectionType(
    type: Tsoa.IntersectionType,
  ): {
    type: string;
    properties: {};
  };
  protected getSwaggerTypeForReferenceType(referenceType: Tsoa.ReferenceType): Swagger.BaseSchema;
  private decideEnumType;
  protected getSwaggerTypeForEnumType(enumType: Tsoa.EnumType): Swagger.Schema2;
}
