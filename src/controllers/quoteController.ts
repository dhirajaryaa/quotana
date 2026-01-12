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
    const { search, author, category, page, limit } = req.query;

    // Input Validation Helper
    const validateInput = (input: any): boolean => {
        if (!input) return true; // Optional inputs are valid if undefined
        const regex = /^[a-zA-Z0-9\s\-_]+$/;
        return regex.test(String(input));
    };

    // Validate inputs
    if (!validateInput(search) || !validateInput(author) || !validateInput(category)) {
        res.status(400).json({ message: "Invalid characters in query parameters." });
        return;
    }

    // Default to Random Quote if no filter/search parameters are provided
    // We check if specific filter params are missing. content-based filtering logic.
    // The user requested "if not search or query req", implying if no specific filters.
    if (!search && !author && !category) {
        if (quotes.length === 0) {
            res.status(404).json({ message: "No quotes available" });
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        res.json(quotes[randomIndex]);
        return;
    }

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

    // Pagination (Only applies if returning a list, i.e., not the random default)
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10; // Default limit 10 for list view? User previously had 1. Let's stick to valid defaults. 
    // Previous code had limit default 1. A bit small for valid list, but if they want to see more they supply it.
    // Let's use 10 as a more standard API default if not random.

    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const results = quotes.slice(startIndex, endIndex);

    res.json(results);
};
