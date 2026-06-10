import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { points, type PointArea } from '../data/points';

export type CheckinRecord = {
  id: string;
  pointId: string;
  pointName: string;
  photoUrl: string;
  timestamp: string;
  routeStage: PointArea;
  stampUnlocked: boolean;
};

type ExperienceState = {
  currentPointId: string | null;
  visitedPointIds: string[];
  checkedPointIds: string[];
  checkinRecords: CheckinRecord[];
  stamps: string[];
  badges: string[];
  score: number;
  setCurrentPoint: (pointId: string | null) => void;
  visitPoint: (pointId: string) => void;
  collectPoint: (pointId: string) => void;
  checkinPoint: (pointId: string, photoUrl: string) => CheckinRecord | null;
  resetExperience: () => void;
};

const initialState = {
  currentPointId: null,
  visitedPointIds: [],
  checkedPointIds: [],
  checkinRecords: [],
  stamps: [],
  badges: [],
  score: 0
};

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function resolveBadges(checkedPointIds: string[]) {
  const externalIds = points.filter((point) => point.area === 'external').map((point) => point.id);
  const internalIds = points.filter((point) => point.area === 'internal').map((point) => point.id);
  const badges: string[] = [];
  if (externalIds.every((id) => checkedPointIds.includes(id))) badges.push('园区探索者');
  if (internalIds.every((id) => checkedPointIds.includes(id))) badges.push('厂房记录者');
  if (points.every((point) => checkedPointIds.includes(point.id))) badges.push('炉光记忆完整卡');
  return badges;
}

export const useExperienceStore = create<ExperienceState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setCurrentPoint: (pointId) => set({ currentPointId: pointId }),
      visitPoint: (pointId) => set((state) => ({
        currentPointId: pointId,
        visitedPointIds: unique([...state.visitedPointIds, pointId])
      })),
      collectPoint: (pointId) => set((state) => ({
        currentPointId: pointId,
        visitedPointIds: unique([...state.visitedPointIds, pointId]),
        stamps: unique([...state.stamps, pointId])
      })),
      checkinPoint: (pointId, photoUrl) => {
        const point = points.find((item) => item.id === pointId);
        if (!point) return null;
        const alreadyChecked = get().checkedPointIds.includes(pointId);
        const record: CheckinRecord = {
          id: `${pointId}-${Date.now()}`,
          pointId,
          pointName: point.title,
          photoUrl,
          timestamp: new Date().toISOString(),
          routeStage: point.area,
          stampUnlocked: true
        };
        const checkedPointIds = unique([...get().checkedPointIds, pointId]);
        const stamps = unique([...get().stamps, pointId]);
        set((state) => ({
          currentPointId: pointId,
          visitedPointIds: unique([...state.visitedPointIds, pointId]),
          checkedPointIds,
          checkinRecords: [record, ...state.checkinRecords],
          stamps,
          badges: resolveBadges(checkedPointIds),
          score: alreadyChecked ? state.score : state.score + 10
        }));
        return record;
      },
      resetExperience: () => set(initialState)
    }),
    {
      name: 'furnace-memory-experience-v1'
    }
  )
);
