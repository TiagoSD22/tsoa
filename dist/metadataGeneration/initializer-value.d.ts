import * as ts from 'typescript';
import { Tsoa } from './tsoa';
export declare const getInitializerValue: (
  initializer?: ts.Expression | undefined,
  typeChecker?: ts.TypeChecker | undefined,
  type?:
    | Tsoa.StringType
    | Tsoa.BooleanType
    | Tsoa.DoubleType
    | Tsoa.FloatType
    | Tsoa.IntegerType
    | Tsoa.LongType
    | Tsoa.VoidType
    | Tsoa.ObjectsNoPropsType
    | Tsoa.EnumType
    | Tsoa.ArrayType
    | Tsoa.DateTimeType
    | Tsoa.DateType
    | Tsoa.BinaryType
    | Tsoa.BufferType
    | Tsoa.ByteType
    | Tsoa.AnyType
    | Tsoa.RefEnumType
    | Tsoa.RefObjectType
    | Tsoa.RefAliasType
    | Tsoa.NestedObjectLiteralType
    | Tsoa.UnionType
    | Tsoa.IntersectionType
    | undefined,
) => any;
