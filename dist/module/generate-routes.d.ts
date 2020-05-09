import * as ts from 'typescript';
import { ExtendedRoutesConfig } from '../cli';
import { Tsoa } from '../metadataGeneration/tsoa';
export declare const generateRoutes: (
  routesConfig: ExtendedRoutesConfig,
  compilerOptions?: ts.CompilerOptions | undefined,
  ignorePaths?: string[] | undefined,
  metadata?: Tsoa.Metadata | undefined,
) => Promise<Tsoa.Metadata>;
