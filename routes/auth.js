import express from "express";
import { 
  registerUser,
  logInUser,
  logOutUser,
  refreshAccessToken
} from "../controllers/auth.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.get("/logout", logOutUser);
router.get("/refresh", refreshAccessToken);

export default router;