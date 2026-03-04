export type ModuleAction =
  | { module: 'epistle'; type: 'fill'; data: EpistleFillData }
  | { module: 'discipline'; type: 'create_rule'; data: { title: string } }
  | { module: 'discipline'; type: 'check'; data: { ruleId: string } }
  | { module: 'destiny'; type: 'set_goal'; data: DestinyGoalData }
  | { module: 'money'; type: 'add_transaction'; data: MoneyTransactionData }
  | { module: 'success'; type: 'create_project'; data: { title: string } }
  | { module: 'memo'; type: 'save'; data: { content: string; tags: string[] } }
  | { module: 'nudge'; type: 'suggest'; data: { targetModule: string; message: string } };

export interface EpistleFillData {
  field: 'gratitude1' | 'gratitude2' | 'gratitude3' | 'important1' | 'important2' | 'important3' | 'anger' | 'leisure1' | 'leisure2' | 'leisure3' | 'reflection1' | 'reflection2' | 'reflection3';
  value: string;
}

export interface DestinyGoalData {
  field: 'goalUltimate' | 'goal10Year' | 'goal5Year' | 'goal3Year' | 'goal1Year' | 'goal6Month' | 'goal3Month' | 'goal1Month' | 'goal2Week' | 'goal1Week' | 'goalToday' | 'habitToKeep' | 'habitToRemove' | 'restTime';
  value: string;
}

export interface MoneyTransactionData {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  memo?: string;
}

export interface DestinySnapshot {
  goalToday?: string | null;
  goal1Week?: string | null;
  goal2Week?: string | null;
  goal1Month?: string | null;
  goal3Month?: string | null;
  goal6Month?: string | null;
  goal1Year?: string | null;
  goal3Year?: string | null;
  goal5Year?: string | null;
  goal10Year?: string | null;
  goalUltimate?: string | null;
  habitToKeep?: string | null;
  habitToRemove?: string | null;
  restTime?: string | null;
}

export interface ChatContextData {
  onboarding: {
    metArchetype?: string;
    executionLevel: number;
    focusAreas?: string[];
    availableTime?: string;
    preferredStyle?: string;
  } | null;
  todayStatus: {
    epistleWritten: boolean;
    disciplineChecked: number;
    disciplineTotal: number;
    destinyPlanned: boolean;
    moneyLogged: boolean;
    successUpdated: boolean;
  };
  destinyToday: DestinySnapshot | null;
  destinyYesterday: DestinySnapshot | null;
  todayMemos: { content: string; tags: string[]; time: string; reviewed: boolean }[];
  recentMessages: { role: string; content: string }[];
}
