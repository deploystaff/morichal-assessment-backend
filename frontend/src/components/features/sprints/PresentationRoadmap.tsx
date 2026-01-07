import { SprintRoadmapView } from './SprintRoadmapView';
import type { RoadmapSummary } from '../../../types';

interface PresentationRoadmapProps {
  roadmap: RoadmapSummary | null;
  isLoading?: boolean;
}

export function PresentationRoadmap({ roadmap, isLoading }: PresentationRoadmapProps) {
  return <SprintRoadmapView roadmap={roadmap} isLoading={isLoading} />;
}
