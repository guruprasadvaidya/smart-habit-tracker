import { useState, useEffect } from "react";

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get(["habits"], (data) => {
      if (data.habits) setHabits(data.habits);
    });
  }, []);

  const saveData = (updatedHabits) => {
    chrome.storage.sync.set({ habits: updatedHabits });
  };

  const addHabit = (habitName) => {
    if (!habitName.trim()) return;
    const newHabit = { name: habitName, progress: 0, streak: 0 };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveData(updatedHabits);
  };

  const increaseProgress = (index) => {
    const updatedHabits = [...habits];
    updatedHabits[index].progress += 1;
    updatedHabits[index].streak = updatedHabits[index].progress % 7 === 0 
      ? updatedHabits[index].streak + 1 
      : updatedHabits[index].streak;
    setHabits(updatedHabits);
    saveData(updatedHabits);
  };

  const deleteHabit = (index) => {
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    saveData(updatedHabits);
  };

  return (
    <div className="p-4 w-64 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Daily Habit Tracker</h2>
      <input
        type="text"
        placeholder="Add a new habit"
        onKeyDown={(e) => e.key === "Enter" && addHabit(e.target.value)}
        className="mt-2 w-full p-2 border rounded"
      />
      {habits.map((habit, index) => (
        <div key={index} className="mt-4 p-2 border rounded">
          <p>{habit.name}</p>
          <p>Progress: {habit.progress}</p>
          <p>Streak: {habit.streak}🔥</p>
          <button
            onClick={() => increaseProgress(index)}
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
          >
            Check Off Today ✅
          </button>
          <button
            onClick={() => deleteHabit(index)}
            className="mt-2 ml-2 px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete ❌
          </button>
        </div>
      ))}
    </div>
  );
}
