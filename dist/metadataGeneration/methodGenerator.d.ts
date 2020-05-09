import * as ts from 'typescript';
import { MetadataGenerator } from './metadataGenerator';
import { Tsoa } from './tsoa';
export declare class MethodGenerator {
  private readonly node;
  private readonly current;
  private readonly parentTags?;
  private readonly parentSecurity?;
  private readonly isParentHidden?;
  private method;
  private path;
  constructor(node: ts.MethodDeclaration, current: MetadataGenerator, parentTags?: string[] | undefined, parentSecurity?: Tsoa.Security[] | undefined, isParentHidden?: boolean | undefined);
  IsValid(): boolean;
  Generate(): Tsoa.Method;
  private buildParameters;
  private getCurrentLocation;
  private processMethodDecorators;
  private getMethodResponses;
  private getMethodSuccessResponse;
  private getMethodSuccessExamples;
  private supportsPathMethod;
  private getIsDeprecated;
  private getOperationId;
  private getTags;
  private getSecurity;
  private getIsHidden;
  private getDecoratorsByIdentifier;
}
