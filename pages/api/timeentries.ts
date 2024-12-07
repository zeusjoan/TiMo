import { NextApiRequest, NextApiResponse } from 'next';
import { TimeEntry, Overtime } from '../../models/TimeEntry';
import { initDatabase } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Inicjalizacja bazy danych
  try {
    await initDatabase();
  } catch (error) {
    return res.status(500).json({ error: 'Błąd połączenia z bazą danych' });
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const userId = Array.isArray(req.query.userId) 
          ? req.query.userId[0] 
          : req.query.userId;

        const entries = await TimeEntry.findAll({
          where: { userId },
          include: [{
            model: Overtime,
            as: 'overtimes'
          }],
          order: [['month', 'DESC']]
        });
        res.status(200).json(entries);
      } catch (error: any) {
        res.status(500).json({ error: error.message || 'Błąd podczas pobierania wpisów' });
      }
      break;

    case 'POST':
      try {
        const entry = await TimeEntry.create(req.body, {
          include: [{
            model: Overtime,
            as: 'overtimes'
          }]
        });
        res.status(201).json(entry);
      } catch (error: any) {
        res.status(500).json({ error: error.message || 'Błąd podczas tworzenia wpisu' });
      }
      break;

    case 'PUT':
      try {
        const id = Array.isArray(req.query.id) 
          ? req.query.id[0] 
          : req.query.id;

        if (!id) {
          return res.status(400).json({ error: 'Brak ID wpisu' });
        }

        const [updated] = await TimeEntry.update(req.body, {
          where: { id: Number(id) }
        });
        
        if (updated === 0) {
          return res.status(404).json({ error: 'Nie znaleziono wpisu' });
        }

        // Aktualizacja nadgodzin
        if (req.body.overtimes) {
          // Usuń istniejące nadgodziny
          await Overtime.destroy({
            where: { timeEntryId: Number(id) }
          });

          // Dodaj nowe nadgodziny
          for (const overtime of req.body.overtimes) {
            await Overtime.create({
              ...overtime,
              timeEntryId: Number(id)
            });
          }
        }

        const updatedEntry = await TimeEntry.findByPk(Number(id), {
          include: [{
            model: Overtime,
            as: 'overtimes'
          }]
        });

        res.status(200).json(updatedEntry);
      } catch (error: any) {
        res.status(500).json({ error: error.message || 'Błąd podczas aktualizacji wpisu' });
      }
      break;

    case 'DELETE':
      try {
        const id = Array.isArray(req.query.id) 
          ? req.query.id[0] 
          : req.query.id;

        if (!id) {
          return res.status(400).json({ error: 'Brak ID wpisu' });
        }

        const deleted = await TimeEntry.destroy({
          where: { id: Number(id) }
        });

        if (deleted === 0) {
          return res.status(404).json({ error: 'Nie znaleziono wpisu' });
        }

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ error: error.message || 'Błąd podczas usuwania wpisu' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Metoda ${method} nie jest dozwolona`);
  }
}
