import express from 'express';
import { getAllContacts, getMessagesByUserId, sendMessage , getChatPartners} from '../controllers/message.controller.js';
import { protectedRoute} from '../middleware/auth.middleware.js';
import { arcjectProtection } from '../middleware/arcject.middleware.js';
const router = express.Router();

// the middleware execute in order- so request get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated request get blocked by rate limiting before hitting the auth middleware.

router.use(arcjectProtection, protectedRoute) // this means protectedRoute middleware will be implemented to all routes automatically


router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);// I am going to pass UserId at this end point then i will get to the Particuler user to chat
router.post("/send/:id",sendMessage); 

export default router;

// Note :- The order of the above routers should be same because :id is dynamic route , we can write anything here (sender and receiver id is random) and it will response accordinh to it.