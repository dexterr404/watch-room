import express from "express"
import { authenticate } from "../middleware/auth";
import { getUser, registerUser } from "../controllers/authControllers";

const router = express.Router();

router.get('/me', authenticate, getUser);
router.post('/register', authenticate, registerUser);

export default router;