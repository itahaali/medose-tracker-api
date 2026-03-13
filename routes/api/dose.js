import express from "express";
import {
  logDose,
  getTodayDoses,
  getSummary
} from "../../controller/dose.js";
import verifyRoles from "../../middleware/ownership.js";
import rolesList from "../../config/roles.js";

const router = express.Router();

router.post("/:medId", verifyRoles(rolesList.patient), logDose);
router.get("/:medId/today", verifyRoles(rolesList.patient, rolesList.viewer), getTodayDoses);
router.get("/:medId/summary", verifyRoles(rolesList.patient, rolesList.viewer), getSummary);

export default router;