import { CreateGameInput } from '../types/gameInput';
import { prisma } from '../utils/mariaConnection';

class GameService {
    async create(data: CreateGameInput) {
        return prisma.game.create({
            data: {
                pv: data.pv,
                consumables: [],
                money: 0,
            },
            include: {
                steps: true
            }
        });
    }

    async list() {
        return prisma.game.findMany();
    }

    async getById(id: string) {
        return prisma.game.findUnique({
            where: {
                id: id,
            },
            include: {
                steps: true
            }
        });
    }

    async update(id: string, data: Partial<CreateGameInput>) {
        return prisma.game.update({
            where: {
                id: id,
            },
            data: data,
        });
    }

    async updateInventory(id: string, consumables: number[]) {
        return prisma.game.update({
            where: {
                id: id,
            },
            data: {
                consumables: consumables,
            },
        });
    }
}

export { GameService };
