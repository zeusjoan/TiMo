import { NextApiRequest, NextApiResponse } from 'next';

export function withDatabase(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async function wrappedHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
      console.log(`[API] ${req.method} ${req.url}`);
      await handler(req, res);
    } catch (error) {
      console.error('[API Error]', error);
      
      // Sprawdzamy, czy odpowiedź nie została już wysłana
      if (!res.headersSent) {
        const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
        res.status(500).json({ 
          error: 'Wystąpił błąd podczas przetwarzania żądania',
          details: errorMessage,
          timestamp: new Date().toISOString()
        });
      }
    }
  };
}
