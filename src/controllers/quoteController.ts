import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Quote } from '../types';

const dataPath = path.join(process.cwd(), 'data', 'quotes.json');

// Helper to read and process quotes with dynamic IDs
const getQuotesData = (): Quote[] => {
    try {
        const data = fs.readFileSync(dataPath, 'utf-8');
        const quotesRaw = JSON.parse(data);

        // Assign runtime IDs (1-based index)
        return quotesRaw.map((q: any, index: number) => ({
            ...q,
            id: (index + 1).toString()
        }));
    } catch (error) {
        console.error("Error reading quotes data:", error);
        return [];
    }
};

export const getAllQuotes = (req: Request, res: Response) => {
    let quotes = getQuotesData();
    const { search, author, category } = req.query;

    // Filtering
    if (search) {
        const searchTerm = (search as string).toLowerCase();
        quotes = quotes.filter(q =>
            q.quote.toLowerCase().includes(searchTerm) ||
            q.author.toLowerCase().includes(searchTerm)
        );
    }

    if (author) {
        const authorTerm = (author as string).toLowerCase();
        quotes = quotes.filter(q => q.author.toLowerCase().includes(authorTerm));
    }

    if (category) {
        const categoryTerm = (category as string).toLowerCase();
        quotes = quotes.filter(q => q.category.toLowerCase() === categoryTerm);
    }

    // Pagination
    // Defaults: page = 1, limit = 1 (as requested)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = quotes.slice(startIndex, endIndex);

    // Optional: Include metadata about pagination if desired, 
    // but for simplicity/standard behavior, usually just the array or a wrapped object.
    // Given requirements didn't specify wrapper, returning array of results.
    res.json(results);
};

export const getRandomQuote = (req: Request, res: Response) => {
    const quotes = getQuotesData();
    if (quotes.length === 0) {
        res.status(404).json({ message: "No quotes available" });
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    res.json(quotes[randomIndex]);
};
