import { DUNGEON } from '../../generated/prisma/client';
import { CreateGameInput, UpdateGameInput } from '../types/gameInput';
import { prisma } from '../utils/mariaConnection';

class GameService {
  async create(data: CreateGameInput) {
    return prisma.game.create({
      data: {
        pv: data.pv,
        userId: data.userId,
        consumables: [],
        money: 0,
        ended: false,
      },
      include: {
        steps: true,
      },
    });
  }

  async list(userId: string) {
    return prisma.game.findMany({
      where: {
        userId: userId,
      },
      include: {
        steps: true,
      },
    });
  }

  async getById(id: string, userId: string) {
    return prisma.game.findUnique({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        steps: true,
      },
    });
  }

  async save(id: string, data: Partial<CreateGameInput>) {
    return prisma.game.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async update(id: string, data: Partial<UpdateGameInput>) {
    return prisma.$transaction(async (tx) => {
      const { completed, ...gameData } = data;

      const updatedGame = await tx.game.update({
        where: {
          id: id,
          userId: data.userId,
        },
        data: gameData,
      });

      if (completed === true) {
        const lastStep = await tx.game_Step.findFirst({
          where: {
            game_id: id,
          },
          orderBy: {
            date_add: 'desc',
          },
        });

        if (lastStep) {
          await tx.game_Step.update({
            where: {
              id: lastStep.id,
            },
            data: {
              completed: true,
            },
          });
        }
      }

      return updatedGame;
    });
  }

  async delete(id: string, userId: string) {
    return prisma.game.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }

  async addDungeon(gameId: string, type: DUNGEON) {
    return prisma.game_Step.create({
      data: {
        type,
        game: {
          connect: { id: gameId },
        },
      },
    });
  }
}

export { GameService };
