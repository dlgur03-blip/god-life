export type ModuleAction =
  | { module: 'epistle'; type: 'fill'; data: EpistleFillData }
  | { module: 'discipline'; type: 'create_rule'; data: { title: string } }
  | { module: 'discipline'; type: 'check'; data: { ruleId: string } }
  | { module: 'destiny'; type: 'set_goal'; data: DestinyGoalData }
  | { module: 'money'; type: 'add_transaction'; data: MoneyTransactionData }
  | { module: 'success'; type: 'create_project'; data: { title: string } }
  | { module: 'nudge'; type: 'suggest'; data: { targetModule: string; message: string } };

export interface EpistleFillData {
  field: 'gratitude1' | 'gratitude2' | 'gratitude3' | 'important1' | 'important2' | 'important3' | 'anger' | 'leisure1' | 'leisure2' | 'leisure3' | 'reflection1' | 'reflection2' | 'reflection3';
  value: string;
}

export interface DestinyGoalData {
  field: 'goalUltimate' | 'goal10Year' | 'goal5Year' | 'goal3Year' | 'goal1Year' | 'goal6Month' | 'goal3Month' | 'goal1Month' | 'goal2Week' | 'goal1Week' | 'goalToday' | 'habitToKeep' | 'habitToRemove';
  value: string;
}

export interface MoneyTransactionData {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  memo?: string;
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
  recentMessages: { role: string; content: string }[];
}
