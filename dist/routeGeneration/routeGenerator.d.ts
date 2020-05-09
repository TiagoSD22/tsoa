import { ExtendedRoutesConfig } from '../cli';
import { Config } from '../config';
import { Tsoa } from '../metadataGeneration/tsoa';
import { TsoaRoute } from './tsoa-route';
export interface AdditionalProps {
  noImplicitAdditionalProperties: Exclude<Config['noImplicitAdditionalProperties'], undefined>;
}
export declare class RouteGenerator {
  private readonly metadata;
  private readonly options;
  private tsfmtConfig;
  constructor(metadata: Tsoa.Metadata, options: ExtendedRoutesConfig);
  GenerateRoutes(middlewareTemplate: string, pathTransformer: (path: string) => string): Promise<void>;
  GenerateCustomRoutes(template: string, pathTransformer: (path: string) => string): Promise<void>;
  private buildContent;
  buildModels(): TsoaRoute.Models;
  private getRelativeImportPath;
  private buildPropertySchema;
  private buildParameterSchema;
  private buildProperty;
}
