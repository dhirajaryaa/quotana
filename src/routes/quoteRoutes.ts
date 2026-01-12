import { Router } from 'express';
import { getAllQuotes } from '../controllers/quoteController';

const router = Router();

router.get('/', getAllQuotes);

export default router;
