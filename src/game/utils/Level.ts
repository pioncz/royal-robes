const baseExp = 50;

export const getExperienceForLevel = (level: number) =>
  baseExp * Math.pow(level, 1.6);
