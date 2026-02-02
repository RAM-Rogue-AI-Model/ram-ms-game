export interface CreateGameInput {
  pv: number;
  playerId: string;
}

export interface UpdateGameInput {
  pv?: number;
  playerId: string;
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
