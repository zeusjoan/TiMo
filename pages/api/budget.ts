import { NextApiRequest, NextApiResponse } from 'next';
import { Budget } from '../../models/Budget';
import { withDatabase } from '../../lib/middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const userId = Array.isArray(req.query.userId) 
        ? req.query.userId[0] 
        : req.query.userId;

      if (!userId) {
        return res.status(400).json({ error: 'Brak ID użytkownika' });
      }

      const budget = await Budget.findOne({
        where: { userId }
      });

      return res.status(200).json(budget ? budget.toJSON() : null);

    case 'POST':
    case 'PUT':
      const updateUserId = Array.isArray(req.query.userId) 
        ? req.query.userId[0] 
        : req.query.userId;

      if (!updateUserId) {
        return res.status(400).json({ error: 'Brak ID użytkownika' });
      }

      const [updatedBudget, created] = await Budget.upsert({
        ...req.body,
        userId: updateUserId
      });

      return res.status(created ? 201 : 200).json(updatedBudget.toJSON());

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({ error: `Metoda ${method} nie jest dozwolona` });
  }
}

export default withDatabase(handler);
