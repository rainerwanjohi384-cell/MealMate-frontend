import { useState, useEffect } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import api from "../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

export default function Planner() {
  const [weekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [meals, setMeals] = useState({});

  const loadWeek = async () => {
    try {
      const res = await api.get(`/plans/week/${format(weekStart, "yyyy-MM-dd")}`);
      const data = res.data.entries || [];

      const weekData = {};
      data.forEach(entry => {
        if (!weekData[entry.day_of_week]) weekData[entry.day_of_week] = {};
        weekData[entry.day_of_week][entry.meal_type] = entry.recipe;
      });

      setMeals(weekData);
    } catch (err) {
      setMeals({});
    }
  };

  const saveMeal = async (day, mealType, recipe) => {
    try {
      await api.post("/plan-entries", {
        day_of_week: day,
        meal_type: mealType,
        recipe_id: recipe.id,
        week_start: format(weekStart, "yyyy-MM-dd"),
      });

      setMeals(prev => ({
        ...prev,
        [day]: { ...prev[day], [mealType]: recipe }
      }));
    } catch (error) {
      console.error("Error saving meal:", error);
      alert("Couldn't save that meal");
    }
  };

  const removeMeal = (day, mealType) => {
    setMeals(prev => {
      const updated = { ...prev };
      if (updated[day]) {
        delete updated[day][mealType];
        if (Object.keys(updated[day]).length === 0) delete updated[day];
      }
      return updated;
    });
  };

  const currentDate = (day) => {
    const index = DAYS.indexOf(day);
    return format(addDays(weekStart, index), "EEE d");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Meal Planner</h1>
        <p className="text-xl text-gray-600">
          Week of <span className="font-bold text-gray-900">{format(weekStart, "MMMM d, yyyy")}</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold text-center">Your Weekly Meal Plan</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-4 font-medium text-gray-700">Day</th>
                {MEAL_TYPES.map(meal => (
                  <th key={meal} className="text-center p-4 font-medium text-gray-700 capitalize">
                    {meal}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day => {
                const dayMeals = meals[day] || {};
                return (
                  <tr key={day} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">
                      {day} <span className="text-gray-500 text-xs">({currentDate(day)})</span>
                    </td>
                    {MEAL_TYPES.map(meal => {
                      const recipe = dayMeals[meal];
                      return (
                        <td key={meal} className="p-4 text-center min-w-[140px]">
                          {recipe ? (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 text-left shadow-sm">
                              <p className="font-bold text-gray-900">{recipe.title}</p>
                              {recipe.prep_time && (
                                <p className="text-sm text-gray-600 mt-1">🕒 {recipe.prep_time} min</p>
                              )}
                              <button
                                onClick={() => removeMeal(day, meal)}
                                className="text-red-600 text-sm mt-3 hover:underline font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">+ Add recipe</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}