import express, { Router } from 'express';

import { GameController } from '../controllers/gameController';

class GameRouter {
    public router: Router;

    constructor(gameController: GameController) {
        this.router = express.Router();

        this.router
            .route('/')
            .get(async (req, res) => {
                await gameController.getAll(req, res);
            })
            .post(async (req, res) => {
                await gameController.create(req, res);
            });

        this.router
            .route('/:id')
            .get(async (req, res) => {
                await gameController.getById(req, res);
            })
            .put(async (req, res) => {
                await gameController.update(req, res);
            })
            .patch(async (req, res) => {
                await gameController.updateInventory(req, res);
            });
    }
}

export { GameRouter };
