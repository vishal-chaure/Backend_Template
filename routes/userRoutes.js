import { authenticateToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { Router } from "express";
import { register, login, getProfile } from "../controllers/userController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/getProfile', authenticateToken, getProfile);

export default router;