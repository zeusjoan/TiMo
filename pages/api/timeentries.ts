import { NextApiRequest, NextApiResponse } from 'next';
import { TimeEntry } from '../../models/TimeEntry';
import { Overtime } from '../../models/Overtime';
import { withDatabase } from '../../lib/middleware';
import sequelize from '../../lib/database';

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

      const entries = await TimeEntry.findAll({
        where: { userId },
        order: [['month', 'DESC']]
      });

      return res.status(200).json(entries.map(entry => entry.toJSON()));

    case 'POST':
      const { userId: newUserId, month } = req.body;

      // Sprawdzamy czy istnieje już wpis dla danego miesiąca
      const existingEntry = await TimeEntry.findOne({
        where: { 
          userId: newUserId,
          month: month
        }
      });

      if (existingEntry) {
        return res.status(400).json({ 
          error: 'Wpis dla tego miesiąca już istnieje',
          existingEntryId: existingEntry.id
        });
      }

      // Pobieramy sumę niezatwierdzonych nadgodzin dla danego miesiąca
      const overtimes = await Overtime.findAll({
        where: {
          userId: newUserId,
          month: month,
          isApproved: false
        }
      });

      const overtimeHours = overtimes.reduce((sum, ot) => sum + ot.duration, 0);

      // Tworzymy wpis z sumą nadgodzin
      const entry = await TimeEntry.create({
        ...req.body,
        overtimeHours,
        isApproved: true
      });

      // Oznaczamy nadgodziny jako zatwierdzone
      await Overtime.update(
        { isApproved: true },
        {
          where: {
            userId: newUserId,
            month: month,
            isApproved: false
          }
        }
      );

      return res.status(201).json(entry.toJSON());

    case 'PUT':
      const id = Array.isArray(req.query.id) 
        ? req.query.id[0] 
        : req.query.id;

      if (!id) {
        return res.status(400).json({ error: 'Brak ID wpisu' });
      }

      // Sprawdzamy czy wpis istnieje
      const timeEntry = await TimeEntry.findByPk(Number(id));
      
      if (!timeEntry) {
        return res.status(404).json({ error: 'Nie znaleziono wpisu' });
      }

      // Jeśli zmieniamy miesiąc, sprawdzamy czy nie ma już wpisu dla tego miesiąca
      if (req.body.month && req.body.month !== timeEntry.month) {
        const existingEntryForMonth = await TimeEntry.findOne({
          where: { 
            userId: timeEntry.userId,
            month: req.body.month
          }
        });

        if (existingEntryForMonth) {
          return res.status(400).json({ 
            error: 'Wpis dla tego miesiąca już istnieje',
            existingEntryId: existingEntryForMonth.id
          });
        }
      }

      // Aktualizujemy wpis
      const [updated] = await TimeEntry.update(req.body, {
        where: { id: Number(id) }
      });
      
      if (updated === 0) {
        return res.status(404).json({ error: 'Nie znaleziono wpisu' });
      }

      const updatedEntry = await TimeEntry.findByPk(Number(id));

      return res.status(200).json(updatedEntry!.toJSON());

    case 'DELETE':
      const deleteId = Array.isArray(req.query.id) 
        ? req.query.id[0] 
        : req.query.id;

      if (!deleteId) {
        return res.status(400).json({ error: 'Brak ID wpisu' });
      }

      // Sprawdzamy czy wpis istnieje
      const entryToDelete = await TimeEntry.findByPk(Number(deleteId));
      
      if (!entryToDelete) {
        return res.status(404).json({ error: 'Nie znaleziono wpisu' });
      }

      // Oznaczamy powiązane nadgodziny jako niezatwierdzone
      await Overtime.update(
        { isApproved: false },
        {
          where: {
            userId: entryToDelete.userId,
            month: entryToDelete.month,
            isApproved: true
          }
        }
      );

      await entryToDelete.destroy();

      return res.status(200).json({ success: true });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Metoda ${method} nie jest dozwolona` });
  }
}

export default withDatabase(handler);
