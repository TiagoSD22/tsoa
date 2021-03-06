import * as ts from 'typescript';
import { Tsoa } from './tsoa';
export declare class MetadataGenerator {
  private readonly compilerOptions?;
  private readonly ignorePaths?;
  readonly nodes: ts.Node[];
  readonly typeChecker: ts.TypeChecker;
  private readonly program;
  private referenceTypeMap;
  private circularDependencyResolvers;
  IsExportedNode(node: ts.Node): boolean;
  constructor(entryFile: string, compilerOptions?: ts.CompilerOptions | undefined, ignorePaths?: string[] | undefined, controllers?: string[]);
  Generate(): Tsoa.Metadata;
  private setProgramToDynamicControllersFiles;
  private extractNodeFromProgramSourceFiles;
  private checkForMethodSignatureDuplicates;
  TypeChecker(): ts.TypeChecker;
  AddReferenceType(referenceType: Tsoa.ReferenceType): void;
  GetReferenceType(refName: string): Tsoa.ReferenceType;
  OnFinish(callback: (referenceTypes: Tsoa.ReferenceTypeMap) => void): void;
  private buildControllers;
}
