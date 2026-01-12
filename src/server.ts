import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import quoteRoutes from './routes/quoteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

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

// Fallback for root
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 Handler
app.use((req: Request, res: Response) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ message: "Endpoint not found" });
    } else {
        res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
