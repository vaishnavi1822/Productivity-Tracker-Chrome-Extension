import React, { useState } from 'react';
import { PlusIcon, CheckIcon, TrashIcon } from '@heroicons/react/outline';

const Goals = () => {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete project documentation', completed: false },
    { id: 2, text: 'Review pull requests', completed: true },
    { id: 3, text: 'Update team meeting notes', completed: false }
  ]);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = (e) => {
    e.preventDefault();
    if (newGoal.trim()) {
      setGoals([
        ...goals,
        { id: Date.now(), text: newGoal, completed: false }
      ]);
      setNewGoal('');
    }
  };

  const toggleGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Goals</h2>
        
        <form onSubmit={addGoal} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </form>

        <div className="space-y-2">
          {goals.map(goal => (
            <div
              key={goal.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-1 rounded-full ${
                    goal.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200'
                  }`}
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
                <span className={goal.completed ? 'line-through text-gray-500' : ''}>
                  {goal.text}
                </span>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Goals; 