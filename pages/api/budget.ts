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

      const year = Array.isArray(req.query.year)
        ? parseInt(req.query.year[0])
        : req.query.year
          ? parseInt(req.query.year)
          : new Date().getFullYear();

      if (!userId) {
        return res.status(400).json({ error: 'Brak ID użytkownika' });
      }

      const budget = await Budget.findOne({
        where: { userId, year }
      });

      return res.status(200).json(budget ? budget.toJSON() : null);

    case 'GET_ALL':
      const allUserId = Array.isArray(req.query.userId) 
        ? req.query.userId[0] 
        : req.query.userId;

      if (!allUserId) {
        return res.status(400).json({ error: 'Brak ID użytkownika' });
      }

      const budgets = await Budget.findAll({
        where: { userId: allUserId },
        order: [['year', 'DESC']]
      });

      // Return empty array if no budgets found
      return res.status(200).json(budgets?.length ? budgets.map(b => b.toJSON()) : []);

    case 'POST':
    case 'PUT':
      const updateUserId = Array.isArray(req.query.userId) 
        ? req.query.userId[0] 
        : req.query.userId;

      if (!updateUserId) {
        return res.status(400).json({ error: 'Brak ID użytkownika' });
      }

      // Ensure year is set
      const updateData = {
        ...req.body,
        userId: updateUserId,
        year: req.body.year || new Date().getFullYear()
      };

      const [updatedBudget, created] = await Budget.upsert(updateData);

      return res.status(created ? 201 : 200).json(updatedBudget.toJSON());

    default:
      res.setHeader('Allow', ['GET', 'GET_ALL', 'POST', 'PUT']);
      return res.status(405).json({ error: `Metoda ${method} nie jest dozwolona` });
  }
}

export default withDatabase(handler);
