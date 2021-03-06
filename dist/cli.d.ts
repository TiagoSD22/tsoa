#!/usr/bin/env node
import { Config, RoutesConfig, SpecConfig } from './config';
export interface ExtendedSpecConfig extends SpecConfig {
  entryFile: Config['entryFile'];
  noImplicitAdditionalProperties: Exclude<Config['noImplicitAdditionalProperties'], undefined>;
  controllerPathGlobs?: Config['controllerPathGlobs'];
}
export declare const validateSpecConfig: (config: Config) => Promise<ExtendedSpecConfig>;
export interface ExtendedRoutesConfig extends RoutesConfig {
  entryFile: Config['entryFile'];
  noImplicitAdditionalProperties: Exclude<Config['noImplicitAdditionalProperties'], undefined>;
  controllerPathGlobs?: Config['controllerPathGlobs'];
}
export interface ConfigArgs {
  basePath?: string;
  configuration?: string;
}
export interface SwaggerArgs extends ConfigArgs {
  host?: string;
  json?: boolean;
  yaml?: boolean;
}
export declare function generateSpecAndRoutes(args: SwaggerArgs): Promise<[import('./metadataGeneration/tsoa').Tsoa.Metadata, import('./metadataGeneration/tsoa').Tsoa.Metadata]>;
