import cors from 'cors';
import express from 'express';
import 'dotenv/config';

import { GameController } from './controllers/gameController';
import { GameRouter } from './routes/gameRouter';
import { GameService } from './services/gameService';
import { config } from './utils/config';

const app = express();
const port = config.PORT;

app.use(
  cors({
    origin: [process.env.CLIENT_URL ?? 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Game!');
});

const gameService = new GameService();
const gameController = new GameController(gameService);

app.use('/game', new GameRouter(gameController).router);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
