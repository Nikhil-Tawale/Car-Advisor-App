import fs from "fs";
import path from "path";
import cars from "../data/cars.json";

export const rankCars = async (prefs?: any) => {
  if (!prefs || Object.keys(prefs).length === 0) {
    return cars;
  }

  const ranked = cars
    .map((car: any) => {
      let score = 0;
      const reasons: string[] = [];

      // Budget (optional)
      if (prefs?.budget) {
        if (car.price_lakh <= prefs.budget) {
          score += 40;
          reasons.push("within budget");
        } else {
          const penalty = Math.min(
            40,
            ((car.price_lakh - prefs.budget) / prefs.budget) * 80
          );
          score += Math.max(0, 40 - penalty);
        }
      }

      // Fuel (optional)
      if (prefs?.fuel) {
        if (prefs.fuel === "Any" || prefs.fuel === car.fuel) {
          score += 20;
          reasons.push("fuel matched");
        }
      }

      // Usage (optional)
      if (prefs?.usage) {
        if (prefs.usage === "city") {
          score += car.type === "Hatchback" ? 20 : 5;
          reasons.push("good for city");
        }

        if (prefs.usage === "highway") {
          score +=
            car.type === "Sedan" || car.mileage_kmpl > 20 ? 15 : 5;
          reasons.push("good for highway");
        }

        if (prefs.usage === "family") {
          score +=
            car.type === "SUV" || car.safety_rating >= 4 ? 20 : 5;
          reasons.push("family friendly");
        }
      }

      // Priority (optional)
      if (prefs?.priority) {
        if (prefs.priority === "safety") {
          score += Math.min(20, car.safety_rating * 4);
          reasons.push("strong safety");
        }

        if (prefs.priority === "mileage") {
          score += Math.min(20, (car.mileage_kmpl / 30) * 20);
          reasons.push("good mileage");
        }

        if (prefs.priority === "boot") {
          score += Math.min(20, (car.boot_space_l / 500) * 20);
          reasons.push("large boot space");
        }
      }

      return {
        ...car,
        score: Math.round(score),
        reason:
          reasons.length > 0
            ? `${car.model}: ${reasons.slice(0, 2).join(", ")}.`
            : `${car.model}: General recommendation.`,
      };
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

  // Save logs
  const logsDir = path.join(__dirname, "../logs");

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  fs.appendFileSync(
    path.join(logsDir, "queries.jsonl"),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      preferences: prefs,
      shortlist: ranked,
    }) + "\n"
  );

  return ranked;
};