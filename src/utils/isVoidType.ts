import { Tsoa } from '../metadataGeneration/tsoa';

export const isVoidType = (type: Tsoa.Type): boolean => {
  if (type.dataType === 'void') {
    return true;
  } else if (type.dataType === 'refAlias') {
    return isVoidType(type.type);
  } else {
    return false;
  }
};
