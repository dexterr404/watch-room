import express from 'express'
import { authenticate } from '../middleware/auth';
import { changeRoomKey, createRoom, getMyRoom, getPublicRooms, getRoomById, joinRoomByKey, kickParticipant, updateRoom } from '../controllers/roomControllers';

const router = express.Router();

router.post('/', authenticate, createRoom);
router.get('/me', authenticate, getMyRoom);
router.get('/public', authenticate, getPublicRooms);
router.post('/join-by-key/:roomKey', authenticate, joinRoomByKey);
router.patch('/:roomId/change-key', authenticate, changeRoomKey);
router.delete('/:roomId/kick-participant', authenticate, kickParticipant);
router.get('/:roomId', authenticate, getRoomById);
router.patch('/:roomId', authenticate, updateRoom);

export default router;