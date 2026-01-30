enum DungeonType {
    SHOP = 'shop',
    DATACENTER = 'datacenter',
    DUNGEON = 'dungeon',
}

export interface CreateGameInput {
    pv: number;
    consumables: number[];
    money: number;
}

export interface UpdateInventoryInput {
    consumables: number[];
}
