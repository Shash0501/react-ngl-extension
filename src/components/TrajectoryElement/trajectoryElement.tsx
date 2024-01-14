import React, { useEffect, useState } from 'react';
import { useStage } from '../../hooks';
import { TrajectoryElement } from '../../component/trajectory';

interface TrajectoryProps {
  trajectory: any; // Replace 'any' with the appropriate trajectory type
  params?: Partial<TrajectoryElementParameters>;
  onLoad?: (trajectoryElement: TrajectoryElement) => void;
  onLoadFailure?: (error: Error) => void;
}

const Trajectory: React.FC<TrajectoryProps> = ({
  trajectory,
  params = TrajectoryElementDefaultParameters,
  onLoad,
  onLoadFailure,
}) => {
  const stage = useStage();
  const [trajectoryElement, setTrajectoryElement] = useState<TrajectoryElement>();

  useEffect(() => {
    try {
      const element = new TrajectoryElement(stage, trajectory, params);
      setTrajectoryElement(element);

      if (onLoad) {
        onLoad(element);
      }
    } catch (error) {
      if (onLoadFailure) {
        onLoadFailure(error);
      }
    }
  }, [stage, trajectory, params, onLoad, onLoadFailure]);

  return (
    <>{trajectoryElement && <ComponentReactContext.Provider value={trajectoryElement} />}</>
  );
};

export default Trajectory;