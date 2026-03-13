import Medicine from "../model/Medicine.js";

async function createMedicine(request, response) {
  const { name, dosage, frequency, timesPerDay, startDate, isActive } = request.body;

  if (!name || !dosage || !frequency || !timesPerDay || !startDate) {
    return response.sendStatus(400);
  }

  try {
    const foundMedicine = await Medicine.findOne({ name, user: request.id });
    if (foundMedicine) {
      return response.status(409).json({ "message": "Medicine for User already exists" });
    }

    const newMedicine = await Medicine.create({ 
      name, 
      dosage, 
      frequency, 
      timesPerDay, 
      startDate, 
      user: request.id, 
      isActive 
    });

    return response.status(201).json({ 
      "message": "Medicine for User has been registered",
      "medicine": newMedicine
     });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function getMyMedicines(request, response) {
  try {
    const foundMedicines = await Medicine.find({ user: request.id });
    if (!foundMedicines.length) {
      return response.status(404).json({ "message": "Medicine for User not found" });
    }

    return response.status(200).json({ foundMedicines });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function getOneMedicine(request, response) {
  try {
    const foundMedicine = await Medicine.findOne({ _id: request.params.id, user: request.id });
    if (!foundMedicine) {
      return response.status(404).json({ "message": "Medicine for User not found" });
    }

    return response.status(200).json({ foundMedicine });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function updateMedicine(request, response) {
  try {
    const foundMedicine = await Medicine.findOne({ _id: request.params.id, user: request.id });
    if (!foundMedicine) {
      return response.status(404).json({ "message": "Medicine for User not found" });
    }

    if (request.body?.name) foundMedicine.name = request.body.name; 
    if (request.body?.dosage) foundMedicine.dosage = request.body.dosage; 
    if (request.body?.frequency) foundMedicine.frequency = request.body.frequency; 
    if (request.body?.timesPerDay) foundMedicine.timesPerDay = request.body.timesPerDay;
    if (request.body?.startDate) foundMedicine.startDate = request.body.startDate; 
    if ("isActive" in request.body) foundMedicine.isActive = request.body.isActive;

    const updatedMedicine = await foundMedicine.save();

    return response.status(200).json({ 
      "message": "Medicine for User is updated",
      "medicine": updatedMedicine
     });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function deleteMedicine(request, response) {
  try {
    const deletedMedicine = await Medicine.deleteOne({ _id: request.params.id, user: request.id });
    if (!deletedMedicine.deletedCount) {
      return response.status(404).json({ "message": "Medicine for User not found" });
    }

    return response.status(200).json({ "message": "Medicine for User has been deleted" });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

export { 
  createMedicine, 
  getMyMedicines, 
  getOneMedicine, 
  updateMedicine, 
  deleteMedicine 
};