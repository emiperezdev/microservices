import { Router } from 'express';
import { Notification } from '../models/Notification';

const router = Router();

router.get('/ping', (_, res) => {
  res.json({ message: 'Hello, world!' });
});

router.get('/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

router.post('/notifications', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const saved = await notification.save();
    res.json(saved);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.put('/notifications/:id/read', async (req, res) => {
  try {
    const result = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true, updatedAt: new Date() },
      { new: true }
    );
    if (result) res.json(result);
    else res.status(404).json({ error: 'Notification not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    const result = await Notification.findByIdAndDelete(req.params.id);
    if (result) res.json({ message: 'Deleted' });
    else res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Deletion failed' });
  }
});

export default router;
