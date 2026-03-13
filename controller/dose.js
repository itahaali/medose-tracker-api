import Dose from "../model/Dose.js";
import Medicine from "../model/Medicine.js";

async function logDose(request, response) {
  const medicine = request.params.medId;
  if (!medicine) {
    return response.sendStatus(400);
  }
  
  const { takenAt, status, missedNote } = request.body;
  if (!takenAt) {
    return response.sendStatus(400);
  }

  try {
    const foundMedicine = await Medicine.findOne({ _id: medicine, user: request.id });
    if (!foundMedicine) {
      return response.status(404).json({ "message": "Medicine for User not found" });
    }

    const newDose = await Dose.create({
      medicine,
      user: request.id,
      takenAt,
      ...((status !== undefined) && { status }),
      ...(missedNote && { missedNote })
    });

    return response.status(201).json({ 
      "message": "Dose for Medicine is registered for the User",
      "dose": newDose 
    });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function getTodayDoses(request, response) {
  const medicine = request.params.medId;
  if (!medicine) {
    return response.sendStatus(400);
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
    
  try {
    const foundDoses = await Dose.find({
      medicine,
      user: request.id,
      takenAt: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    }).populate("medicine");

    return response.status(200).json({ "Today doses": foundDoses });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function getSummary(request, response) {
  const medicine = request.params.medId;
  if (!medicine) {
    return response.sendStatus(400);
  }

  try {
    const foundMedicine = await Medicine.findOne({ _id: medicine, user: request.id });
    if (!foundMedicine) {
      return response.status(404).json({ "message": "Medicine for User not found" });
    }

    const totalDoses = await Dose.find({ medicine, user: request.id });
    if (!totalDoses.length) {
      return response.status(404).json({ "message": "Dose for Medicine not found" });
    }

    const totalTakenDoses = totalDoses.filter(dose => dose.status.includes("taken"));
    const totalMissedDoses = totalDoses.filter(dose => dose.status.includes("missed"));
    
    const adherence = (totalTakenDoses.length / totalDoses.length) * 100;

    return response.status(200).json({
      "Medicine": foundMedicine.name,
      "Start date": foundMedicine.startDate,
      "Total logged doses": totalDoses.length,
      "Total taken doses": totalTakenDoses.length,
      "Total missed dose": totalMissedDoses.length,
      "Adherence": adherence.toFixed(2)
    });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }  
}

export {
  logDose,
  getTodayDoses,
  getSummary
};