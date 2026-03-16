import express from "express";
import {
  createMedicine, 
  getMyMedicines, 
  getOneMedicine, 
  updateMedicine, 
  deleteMedicine 
} from "../../controllers/medicine.js";
import verifyRoles from "../../middlewares/ownership.js";
import rolesList from "../../configs/roles.js";

const router = express.Router();

router.route("/")
      .post(verifyRoles(rolesList.patient), createMedicine)
      .get(verifyRoles(rolesList.patient, rolesList.viewer), getMyMedicines);

router.route("/:id")
      .get(verifyRoles(rolesList.patient, rolesList.viewer), getOneMedicine)
      .put(verifyRoles(rolesList.patient), updateMedicine)
      .delete(verifyRoles(rolesList.patient), deleteMedicine);

export default router;