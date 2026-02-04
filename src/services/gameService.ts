import { DUNGEON } from '../../generated/prisma/client';
import { CreateGameInput, UpdateGameInput } from '../types/gameInput';
import { prisma } from '../utils/mariaConnection';
import { sendLog } from '../utils/message';

class GameService {
  async create(data: CreateGameInput) {
    try {
      const result = await prisma.game.create({
        data: {
          pv: data.pv,
          playerId: data.playerId,
          consumables: [],
          money: 0,
          ended: false,
        },
        include: {
          steps: true,
        },
      });
      void sendLog(
        'GAME',
        'INSERT',
        'INFO',
        `Created game with id ${result.id} for player ${data.playerId}`
      );
      return result;
    } catch (error) {
      void sendLog(
        'GAME',
        'INSERT',
        'ERROR',
        `Failed to create game for player ${data.playerId}: ${String(error)}`
      );
      throw new Error('Failed to create game');
    }
  }

  async list(playerId: string) {
    try {
      const result = await prisma.game.findMany({
        where: {
          playerId: playerId,
        },
        include: {
          steps: true,
        },
      });
      void sendLog(
        'GAME',
        'OTHER',
        'INFO',
        `Listed ${result.length} games for player ${playerId}`
      );
      return result;
    } catch (error) {
      void sendLog(
        'GAME',
        'OTHER',
        'ERROR',
        `Failed to list games for player ${playerId}: ${String(error)}`
      );
      throw new Error('Failed to list games');
    }
  }

  async getById(id: string, playerId: string) {
    try {
      const result = await prisma.game.findUnique({
        where: {
          id: id,
          playerId: playerId,
        },
        include: {
          steps: true,
        },
      });
      if (result === null) {
        void sendLog(
          'GAME',
          'OTHER',
          'WARN',
          `Game with id ${id} for player ${playerId} not found`
        );
      }
      void sendLog(
        'GAME',
        'OTHER',
        'INFO',
        `Retrieved game with id ${id} for player ${playerId}`
      );
      return result;
    } catch (error) {
      void sendLog(
        'GAME',
        'OTHER',
        'ERROR',
        `Failed to retrieve game with id ${id} for player ${playerId}: ${String(
          error
        )}`
      );
      throw new Error('Failed to retrieve game');
    }
  }

  async save(id: string, data: Partial<CreateGameInput>) {
    try {
      const existingGame = await prisma.game.findUnique({
        where: {
          id: id,
        },
      });
      if (existingGame === null) {
        void sendLog(
          'GAME',
          'UPDATE',
          'WARN',
          `Game with id ${id} not found for saving`
        );
        throw new Error('Game not found');
      }
      const result = await prisma.game.update({
        where: {
          id: id,
        },
        data: data,
      });
      if (result === null) {
        void sendLog(
          'GAME',
          'UPDATE',
          'ERROR',
          `Failed to save game with id ${id}`
        );
        throw new Error('Failed to save game');
      }
      void sendLog('GAME', 'UPDATE', 'INFO', `Saved game with id ${id}`);
      return result;
    } catch (error) {
      void sendLog(
        'GAME',
        'UPDATE',
        'ERROR',
        `Failed to save game with id ${id}: ${String(error)}`
      );
      throw new Error('Failed to save game');
    }
  }

  async update(id: string, data: Partial<UpdateGameInput>) {
    try {
      return await prisma.$transaction(async (tx) => {
        const { completed, ...gameData } = data;

        const updatedGame = await tx.game.update({
          where: {
            id: id,
            playerId: data.playerId,
          },
          data: gameData,
        });

        if (updatedGame === null) {
          void sendLog(
            'GAME',
            'UPDATE',
            'ERROR',
            `Failed to update game with id ${id}`
          );
          throw new Error('Failed to update game');
        }

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
        void sendLog('GAME', 'UPDATE', 'INFO', `Updated game with id ${id}`);

        return updatedGame;
      });
    } catch (error) {
      void sendLog(
        'GAME',
        'UPDATE',
        'ERROR',
        `Failed to update game with id ${id}: ${String(error)}`
      );
      throw new Error('Failed to update game');
    }
  }

  async delete(id: string, playerId: string) {
    try {
      const existingGame = await prisma.game.findUnique({
        where: {
          id: id,
          playerId: playerId,
        },
      });
      if (existingGame === null) {
        void sendLog(
          'GAME',
          'REMOVE',
          'WARN',
          `Game with id ${id} for player ${playerId} not found for deletion`
        );
        throw new Error('Game not found');
      }
      return await prisma.game.delete({
        where: {
          id: id,
          playerId: playerId,
        },
      });
    } catch (error) {
      void sendLog(
        'GAME',
        'REMOVE',
        'ERROR',
        `Failed to delete game with id ${id} for player ${playerId}: ${String(
          error
        )}`
      );
      throw new Error('Failed to delete game');
    }
  }

  async addDungeon(gameId: string, type: DUNGEON) {
    try {
      return await prisma.game_Step.create({
        data: {
          type,
          game: {
            connect: { id: gameId },
          },
        },
      });
    } catch (error) {
      void sendLog(
        'GAME',
        'INSERT',
        'ERROR',
        `Failed to add dungeon of type ${type} to game with id ${gameId}: ${String(
          error
        )}`
      );
      throw new Error('Failed to add dungeon to game');
    }
  }
}

export { GameService };
