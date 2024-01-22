// TypeScript file for TrajectoryElement React component

import React, { useEffect, useState, PropsWithChildren } from 'react';
import useAsyncEffect from '@n1ru4l/use-async-effect';
import { NGL } from '../../utils';
import { useStage, TrajectoryReactContext } from '../../hooks';
import Trajectory from '../../@types/ngl/declarations/trajectory/trajectory';
// Props for the TrajectoryElement React component
import {TrajectoryPlayerInterpolateType,TrajectoryPlayerDirection,TrajectoryPlayerMode} from '../../@types/ngl/declarations/trajectory/trajectory-player';
import { useStructure } from '../../hooks/useStructure';

export const TrajectoryElementDefaultParameters = {
  defaultStep: 1,
  defaultTimeout: 50,
  defaultInterpolateType:"" as TrajectoryPlayerInterpolateType ,
  defaultInterpolateStep: 1,
  defaultMode: 'loop' as TrajectoryPlayerMode,
  defaultDirection: 'forward' as TrajectoryPlayerDirection,
  initialFrame: 1,
  name: '',
  status: '',
};
export interface TrajectoryElementProps {
  params?: Partial<NGL.TrajectoryElementParameters>;
  filePath?: string;
  frame?: number;
  onLoad?: (trajectoryElement: NGL.TrajectoryElement) => void;
  onLoadFailure?: (error: Error) => void;
}

// TrajectoryElement React component
const TrajectoryElementComponent: React.FC<PropsWithChildren<TrajectoryElementProps>> = ({
  children,
  params = TrajectoryElementDefaultParameters,
  filePath,
  frame,
  onLoad,
  onLoadFailure,
}) => {
  const stage = useStage();
  const structure = useStructure();
  const [trajectoryElement, setTrajectoryElement] = useState<NGL.TrajectoryElement>();
  const trajectory = new Trajectory(filePath as string, structure, undefined);
  // Asynchronous effect for creating TrajectoryElement component
  useAsyncEffect(
    function* createTrajectoryElement(setCancelHandler, c) {
      const abortController = new AbortController();
      setCancelHandler(() => abortController.abort());
      let nextTrajectoryElement: NGL.TrajectoryElement | undefined;
      try {
        nextTrajectoryElement = new NGL.TrajectoryElement(stage, trajectory, params);
      } catch (error) {
        if (error instanceof Error) {
          if (onLoadFailure) {
            onLoadFailure(error);
          }
        }
      }
      if (nextTrajectoryElement) {
        setTrajectoryElement(nextTrajectoryElement);
      }
    },
    [onLoadFailure, params, stage, trajectory]
  );

  // Effect for handling onLoad callback
  useEffect(() => {
    if (trajectoryElement && onLoad) {
      onLoad(trajectoryElement);
    }
  }, [onLoad, trajectoryElement]);

  // Effect for disposing the TrajectoryElement when unmounting
  useEffect(() => {
    return () => {
      if (trajectoryElement) {
        trajectoryElement.dispose();
      }
    };
  }, [trajectoryElement]);

  // Effect for updating parameters
  // useEffect(() => {
  //   if (trajectoryElement) {
  //     trajectoryElement.params = params;
  //   }
  // }, [params, trajectoryElement]);


  // Effect for updating frame
  useEffect(() => {
    if (trajectoryElement) {
      trajectoryElement.setFrame(frame as number);
    }
  }, [frame, trajectoryElement]);
  // Render the TrajectoryElement with its children
  return (
    <>
      {trajectoryElement && (
        <TrajectoryReactContext.Provider value={trajectoryElement}>
          {children}
        </TrajectoryReactContext.Provider>
      )}
    </>
  );
};

export default TrajectoryElementComponent;
