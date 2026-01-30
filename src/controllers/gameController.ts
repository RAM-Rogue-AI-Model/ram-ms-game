import { Request, Response } from 'express';

import { GameService } from '../services/gameService';
import { CreateGameInput } from '../types/gameInput';

class GameController {
    service: GameService;

    constructor(service: GameService) {
        this.service = service;
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body as Partial<CreateGameInput>;
            if (!body.pv) {
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

    async getAll(req: Request, res: Response) {
        const games = await this.service.list();
        res.json(games);
    }

    async getById(req: Request, res: Response) {
        const id: string = req.params.id as string;
        if (!id) {
            return res.status(400).json({ error: 'Missing game id' });
        }
        const game = await this.service.getById(id);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.json(game);
    }

    async update(req: Request, res: Response) {
        const id: string = req.params.id as string;
        const body = req.body as Partial<CreateGameInput>;
        if (!id) {
            return res.status(400).json({ error: 'Missing game id' });
        }
        const gameExists = await this.service.getById(id);
        if (!gameExists) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const updatedGame = await this.service.update(id, body);
        res.json(updatedGame);
    }

    async updateInventory(req: Request, res: Response) {
        const id: string = req.params.id as string;
        const body = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing game id' });
        }
        if (!body.consumables) {
            return res.status(400).json({ error: 'Missing consumables in body' });
        }

        const gameExists = await this.service.getById(id);
        if (!gameExists) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const updatedGame = await this.service.updateInventory(id, body.consumables);
        res.json(updatedGame);
    }
}

export { GameController };
