import { Request, Response } from 'express';

import { DUNGEON } from '../../generated/prisma/client';
import { GameService } from '../services/gameService';
import { CreateGameInput, UpdateGameInput } from '../types/gameInput';
import { getRandomInt } from '../utils/helpers';

class GameController {
  service: GameService;

  constructor(service: GameService) {
    this.service = service;
  }

  //DONE - create new game
  async create(req: Request, res: Response) {
    try {
      const body = req.body as Partial<CreateGameInput>;
      if (!body.pv || !body.playerId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const payload: CreateGameInput = body as CreateGameInput;
      const game = await this.service.create(payload);
      res.status(201).json(game);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to create game' });
    }
  }

  //DONE - find all games of a user
  async getAll(req: Request, res: Response) {
    try {
      const { playerId } = req.query;

      if (!playerId || typeof playerId !== 'string') {
        return res.status(400).json({
          error: 'playerId query param is required',
        });
      }

      const games = await this.service.list(playerId);
      res.json(games);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  //DONE - find one game of a user
  async getById(req: Request, res: Response) {
    try {
      const playerId = req.query.playerId as string;
      const id: string = req.params.id as string;

      if (!id || !playerId || typeof playerId !== 'string') {
        return res.status(400).json({ error: 'Missing parameters' });
      }

      const game = await this.service.getById(id, playerId);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json(game);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  //DONE - Update game
  async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id as string;
      const body = req.body as Partial<UpdateGameInput>;
      if (!id || !body.playerId) {
        return res.status(400).json({ error: 'Missing game id' });
      }

      const gameExists = await this.service.getById(id, body.playerId);
      if (!gameExists) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const updatedGame = await this.service.update(id, body);
      res.json(updatedGame);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  //DONE - delete game
  async deleteGame(req: Request, res: Response) {
    try {
      const { playerId } = req.query;
      const id: string = req.params.id as string;

      if (!id || !playerId || typeof playerId !== 'string') {
        return res.status(400).json({ error: 'Missing parameters' });
      }

      const gameExists = await this.service.getById(id, playerId);
      if (!gameExists) {
        return res.status(404).json({ error: 'Game not found' });
      }

      await this.service.delete(id, playerId);

      res.sendStatus(200);
      return;
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  //DONE - get all dungeons
  async getAllDungeons(req: Request, res: Response) {
    try {
      const { playerId } = req.query;
      const id: string = req.params.id as string;

      if (!id || !playerId || typeof playerId !== 'string') {
        return res.status(400).json({ error: 'Missing parameters' });
      }

      const game = await this.service.getById(id, playerId);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json(game.steps);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  //DONE - add dungeon
  async addDungeon(req: Request, res: Response) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: 'Missing gameId or type' });
      }
      const gameId = req.params.id as string;
      const body = req.body as { type: DUNGEON };

      const step = await this.service.addDungeon(gameId, body.type);

      res.status(201).json(step);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }

  //DONE - return table of dungeon types
  async createDungeonChoice(req: Request, res: Response) {
    try {
      const id: string = req.params.id as string;
      const { playerId } = req.query;

      if (!id || !playerId || typeof playerId !== 'string') {
        return res.status(400).json({ error: 'Missing parameters' });
      }

      const gameExists = await this.service.getById(id, playerId);
      if (!gameExists) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const dungeons: DUNGEON[] = ['DUNGEON'];
      if (gameExists.steps.length === 0) {
        res.json(dungeons);
        return;
      } else {
        const lastDungeon = gameExists.steps.at(-1);
        if (lastDungeon?.completed) {
          const datacenterProba = getRandomInt(100);
          if (datacenterProba <= 20) dungeons.push('DATACENTER');

          const shopProba = getRandomInt(100);
          if (shopProba <= 20) dungeons.push('SHOP');

          res.json(dungeons);
          return;
        } else {
          return res.status(400).json({ error: 'Last dungeon not completed' });
        }
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  //DONE - return current health of player
  async getHealth(req: Request, res: Response) {
    try {
      const { playerId } = req.query;
      const id: string = req.params.id as string;

      if (!id || !playerId || typeof playerId !== 'string') {
        return res.status(400).json({ error: 'Missing parameters' });
      }

      const game = await this.service.getById(id, playerId);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json(game.pv);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  //DONE - return current consumables of player
  async getConsumables(req: Request, res: Response) {
    try {
      const { playerId } = req.query;
      const id: string = req.params.id as string;

      if (!id || !playerId || typeof playerId !== 'string') {
        return res.status(400).json({ error: 'Missing parameters' });
      }

      const game = await this.service.getById(id, playerId);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json(game.consumables);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }
}

export { GameController };
