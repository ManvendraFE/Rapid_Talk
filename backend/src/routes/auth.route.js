import express from 'express';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { arcjectProtection } from '../middleware/arcject.middleware.js';

const router = express.Router();

router.get("/test", arcjectProtection, (req, res) => {
    res.status(200).json({message: "Arcjet protection passed!"});
})

router.use(arcjectProtection); // this means arcjet will be implented on every route , we dont need to add manually

router.post("/signup" , signup);

router.post("/login", login )

router.post("/logout", logout)

router.put("/update-profile", protectedRoute, updateProfile); // protectedRoute middleware use karna hai, taki sirf authenticated user hi apna profile update kar sake

router.get("/check", protectedRoute, (req, res) => res.status(200).json(req.user));
export default router;
 