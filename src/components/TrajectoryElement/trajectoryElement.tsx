// TypeScript file for TrajectoryElement React component

import React, { useEffect, useState, PropsWithChildren } from 'react';
import useAsyncEffect from '@n1ru4l/use-async-effect';
import { Signal } from 'signals';
import { NGL, RepresentationDescriptor, mergeParams } from '../../utils';
import { useStage, ComponentReactContext } from '../../hooks';
import TrajectoryElement, { TrajectoryElementParameters, TrajectoryElementDefaultParameters } from './trajectory-element';

// Props for the TrajectoryElement React component
export interface TrajectoryElementProps {
  trajectory: NGL.TrajectoryElement;
  params?: Partial<TrajectoryElementParameters>;
  onLoad?: (trajectoryElement: TrajectoryElement) => void;
  onLoadFailure?: (error: Error) => void;
}

// TrajectoryElement React component
const TrajectoryElementComponent: React.FC<PropsWithChildren<TrajectoryElementProps>> = ({
  children,
  trajectory,
  params = TrajectoryElementDefaultParameters,
  onLoad,
  onLoadFailure,
}) => {
  const stage = useStage();
  const [trajectoryElement, setTrajectoryElement] = useState<TrajectoryElement>();

  // Asynchronous effect for creating TrajectoryElement component
  useAsyncEffect(
    function* createTrajectoryElement(setCancelHandler, c) {
      const abortController = new AbortController();
      setCancelHandler(() => abortController.abort());
      let nextTrajectoryElement: TrajectoryElement | undefined;
      try {
        nextTrajectoryElement = new TrajectoryElement(stage, trajectory, params);
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
  useEffect(() => {
    if (trajectoryElement) {
      trajectoryElement.setParameters(params);
    }
  }, [params, trajectoryElement]);

  // Render the TrajectoryElement with its children
  return (
    <>
      {trajectoryElement && (
        <ComponentReactContext.Provider value={trajectoryElement}>
          {children}
        </ComponentReactContext.Provider>
      )}
    </>
  );
};

export default TrajectoryElementComponent;
