export type Timeblock = {
  id: string;
  seq: number;
  startTime: string;
  endTime: string;
  planText: string | null;
  planLocation: string | null;
  actualText: string | null;
  score: number | null;
  feedback: string | null;
  status: string;
};

export type DestinyDay = {
  id: string;
  date: string;
  userId: string;
  goalUltimate: string | null;
  goalLong: string | null;
  goalMonth: string | null;
  goalWeek: string | null;
  goalToday: string | null;
  timeblocks: Timeblock[];
  events: DestinyEvent[];
};

export type DestinyEvent = {
  id: string;
  userId: string;
  dayId: string | null;
  title: string;
  recordedAt: Date;
};

export type TemplateBlock = {
  seq: number;
  startTime: string;
  endTime: string;
  planText: string | null;
  planLocation: string | null;
};

export type DestinyTemplate = {
  id: string;
  userId: string;
  name: string;
  blocks: TemplateBlock[];
  createdAt: Date;
  updatedAt: Date;
};
