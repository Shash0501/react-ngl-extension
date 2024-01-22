import { createContext, useContext } from 'react';
import { NGL, ReactNGLError } from '../utils';

export const TrajectoryReactContext = createContext<NGL.TrajectoryElement | undefined>(
  undefined
);

export const useTrajectory = (): NGL.TrajectoryElement => {
  const trajectory = useContext(TrajectoryReactContext);
  if (!trajectory) {
    throw new ReactNGLError(
      'useTrajectory hook can only be used in the children of <Trajectory>'
    );
  }
  return trajectory;
};
