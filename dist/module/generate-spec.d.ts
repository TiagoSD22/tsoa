import * as ts from 'typescript';
export { SpecConfig as SwaggerConfig, Config, RoutesConfig } from '../config';
import { ExtendedSpecConfig } from '../cli';
import { Tsoa } from '../metadataGeneration/tsoa';
export declare const generateSpec: (
  swaggerConfig: ExtendedSpecConfig,
  compilerOptions?: ts.CompilerOptions | undefined,
  ignorePaths?: string[] | undefined,
  metadata?: Tsoa.Metadata | undefined,
) => Promise<Tsoa.Metadata>;
