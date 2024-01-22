import { createContext, useContext } from 'react';
import { NGL, ReactNGLError } from '../utils';

export const StructureReactContext = createContext<NGL.Structure | undefined>(
  undefined
);

export const useStructure = (): NGL.Structure => {
  const structure = useContext(StructureReactContext);
  if (!structure) {
    throw new ReactNGLError(
      'useStructure hook can only be used in the children of <Structure>'
    );
  }
  return structure;
};
