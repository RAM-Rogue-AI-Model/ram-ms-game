export interface CreateGameInput {
  pv: number;
  userId: string;
}

export interface UpdateGameInput {
  pv?: number;
  userId: string;
  consumables?: number[];
  money?: number;
  ended?: boolean;
  completed?: boolean;
}

export interface UpdateStepInput {
  completed: boolean;
}

export interface UpdateInventoryInput {
  consumables: number[];
}
