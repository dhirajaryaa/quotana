import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
import quoteRoutes from './routes/quoteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Enforce GET only for API
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method Not Allowed. Only GET requests are supported.' });
        return;
    }
    next();
});

// Routes
app.use('/api/quotes', quoteRoutes);

// Fallback for root if public index.html fails or for explicit clear intention
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
