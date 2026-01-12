import { Router } from 'express';
import { getAllQuotes, getRandomQuote } from '../controllers/quoteController';

const router = Router();

router.get('/', getAllQuotes);
router.get('/random', getRandomQuote);

export default router;
