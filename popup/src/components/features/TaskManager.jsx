import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, TrashIcon, PencilIcon, 
  CheckCircleIcon, ClockIcon, TagIcon 
} from '@heroicons/react/outline';
import { useWebSocket } from '../../context/WebSocketContext';

const TaskManager = () => {
  const ws = useWebSocket();
  // Load initial state from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [tasks, setTasks] = useState(loadFromStorage('tasks', []));
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState(loadFromStorage('taskFilter', 'all'));
  const [sortBy, setSortBy] = useState(loadFromStorage('taskSort', 'date'));

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save filter preference
  useEffect(() => {
    localStorage.setItem('taskFilter', filter);
  }, [filter]);

  // Save sort preference
  useEffect(() => {
    localStorage.setItem('taskSort', sortBy);
  }, [sortBy]);

  useEffect(() => {
    // Subscribe to task updates
    ws.subscribe('TASK_UPDATE', handleTaskUpdate);
    return () => ws.unsubscribe('TASK_UPDATE', handleTaskUpdate);
  }, []);

  const handleTaskUpdate = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const newTasks = [
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: 'medium',
        category: 'work',
        dueDate: null,
        createdAt: new Date().toISOString(), // Store as ISO string for better serialization
        estimatedTime: 30
      }
    ];
    
    setTasks(newTasks);
    ws.send('TASK_UPDATE', newTasks);
    setNewTask('');
  };

  const updateTask = (id, updates) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    ws.send('TASK_UPDATE', updatedTasks);
  };

  const deleteTask = (id) => {
    const remainingTasks = tasks.filter(task => task.id !== id);
    setTasks(remainingTasks);
  };

  const getSortedTasks = () => {
    let filteredTasks = [...tasks];
    
    // Apply filter
    if (filter !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        if (filter === 'high') return task.priority === 'high';
        return true;
      });
    }

    // Apply sorting
    return filteredTasks.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  };

  return (
    <div className="section-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Task Manager</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="high">High Priority</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="date">Date Created</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      <form onSubmit={addTask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {getSortedTasks().map(task => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              task.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={() => updateTask(task.id, { completed: !task.completed })}
                className={`p-1 rounded-full ${
                  task.completed ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                <CheckCircleIcon className="w-6 h-6" />
              </button>
              {editingTask === task.id ? (
                <input
                  type="text"
                  value={task.text}
                  onChange={(e) => updateTask(task.id, { text: e.target.value })}
                  onBlur={() => setEditingTask(null)}
                  autoFocus
                  className="flex-1 p-1 border rounded"
                />
              ) : (
                <span className={task.completed ? 'line-through text-gray-400' : ''}>
                  {task.text}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${
                task.priority === 'high' ? 'bg-red-100 text-red-600' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <span className="text-sm text-gray-500 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}

              <button
                onClick={() => setEditingTask(task.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager; 