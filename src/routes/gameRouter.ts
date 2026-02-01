import express, { Router } from 'express';

import { GameController } from '../controllers/gameController';
import { authenticate, requestDetails } from '../utils/auth';

class GameRouter {
  public router: Router;

  constructor(gameController: GameController) {
    this.router = express.Router();

    this.router
      .route('/')
      .get(requestDetails, authenticate, async (req, res) => {
        //DONE - Récupérer toutes les parties
        await gameController.getAll(req, res);
      })
      .post(requestDetails, authenticate, async (req, res) => {
        //DONE - Commencer une nouvelle partie
        await gameController.create(req, res);
      });

    this.router
      .route('/:id')
      .get(requestDetails, authenticate, async (req, res) => {
        //DONE - Récupérer une partie
        await gameController.getById(req, res);
      })
      // .put(async (req, res) => {
      //     //Mettre à jour une partie (après un combat)
      //     await gameController.save(req, res);
      // })
      .patch(requestDetails, authenticate, async (req, res) => {
        //Mettre à jour une partie (après une boutique ou un datacenter)
        await gameController.update(req, res);
      })
      .delete(requestDetails, authenticate, async (req, res) => {
        //Supprimer une partie
        await gameController.deleteGame(req, res);
      });

    this.router
      .route('/:id/dungeon')
      .get(requestDetails, authenticate, async (req, res) => {
        //Récupérer tous les donjon d'une partie
        await gameController.getAllDungeons(req, res);
      })
      .put(requestDetails, authenticate, async (req, res) => {
        //Ajouter le prochain donjon choisi en completed = false
        await gameController.addDungeon(req, res);
      });

    this.router
      .route('/:id/dungeon/choice')
      .get(requestDetails, authenticate, async (req, res) => {
        //Récupérer le choix de donjon
        await gameController.createDungeonChoice(req, res);
      });

    this.router
      .route('/id/health')
      .get(requestDetails, authenticate, async (req, res) => {
        //Récupérer les points de vie actuels du joueur
        await gameController.getHealth(req, res);
      });

    this.router
      .route('/id/consumables')
      .get(requestDetails, authenticate, async (req, res) => {
        //Récupérer les items actuels du joueur
        await gameController.getConsumables(req, res);
      });
  }
}

export { GameRouter };
