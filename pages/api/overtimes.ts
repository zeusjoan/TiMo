import { NextApiRequest, NextApiResponse } from 'next';
import { Overtime } from '../../models/Overtime';
import { withDatabase } from '../../lib/middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const userId = Array.isArray(req.query.userId) 
        ? req.query.userId[0] 
        : req.query.userId;

      const month = Array.isArray(req.query.month)
        ? req.query.month[0]
        : req.query.month;

      if (!userId) {
        return res.status(400).json({ error: 'Brak ID użytkownika' });
      }

      const where = {
        userId,
        ...(month && { month })
      };

      const overtimes = await Overtime.findAll({
        where,
        order: [['date', 'DESC'], ['startTime', 'ASC']]
      });

      // Return empty array if no overtimes found
      return res.status(200).json(overtimes?.length ? overtimes.map(overtime => overtime.toJSON()) : []);

    case 'POST':
      const newOvertime = await Overtime.create({
        ...req.body,
        isApproved: false
      });

      return res.status(201).json(newOvertime.toJSON());

    case 'PUT':
      const id = Array.isArray(req.query.id) 
        ? req.query.id[0] 
        : req.query.id;

      if (!id) {
        return res.status(400).json({ error: 'Brak ID wpisu' });
      }

      const [updated] = await Overtime.update(req.body, {
        where: { id: Number(id) }
      });
      
      if (updated === 0) {
        return res.status(404).json({ error: 'Nie znaleziono wpisu' });
      }

      const updatedOvertime = await Overtime.findByPk(Number(id));

      if (!updatedOvertime) {
        return res.status(404).json({ error: 'Nie znaleziono zaktualizowanego wpisu' });
      }

      return res.status(200).json(updatedOvertime.toJSON());

    case 'DELETE':
      const deleteId = Array.isArray(req.query.id) 
        ? req.query.id[0] 
        : req.query.id;

      if (!deleteId) {
        return res.status(400).json({ error: 'Brak ID wpisu' });
      }

      // Sprawdź czy nadgodziny nie są już zatwierdzone
      const overtimeToDelete = await Overtime.findByPk(Number(deleteId));
      
      if (!overtimeToDelete) {
        return res.status(404).json({ error: 'Nie znaleziono wpisu' });
      }

      if (overtimeToDelete.isApproved) {
        return res.status(400).json({ error: 'Nie można usunąć zatwierdzonych nadgodzin' });
      }

      await overtimeToDelete.destroy();

      return res.status(200).json({ success: true });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Metoda ${method} nie jest dozwolona` });
  }
}

export default withDatabase(handler);
