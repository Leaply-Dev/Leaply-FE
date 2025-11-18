'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { TaskItem } from '@/components/TaskItem';
import { PageContainer } from '@/components/Layout';
import { useApplicationsStore } from '@/lib/store/applicationsStore';
import { mockTasks } from '@/lib/data/applications';
import { PageTransition } from '@/components/PageTransition';

export default function TasksPage() {
  const { tasks, setTasks, toggleTaskComplete } = useApplicationsStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');

  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(mockTasks);
    }
  }, [tasks.length, setTasks]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority || 'medium'] || 1) - (priorityOrder[b.priority || 'medium'] || 1);
    }
  });

  return (
    <PageTransition>
      <PageContainer>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-grey mb-2">
              Tasks
            </h1>
            <p className="text-lg text-mid-grey">
              Manage your application tasks and deadlines
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-mid-grey">Show:</span>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-40"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-mid-grey">Sort by:</span>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-40"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </Select>
          </div>

          <span className="text-sm text-mid-grey ml-auto">
            {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tasks List */}
        {sortedTasks.length > 0 ? (
          <div className="space-y-3">
            {sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                completed={task.completed}
                priority={task.priority}
                onToggle={toggleTaskComplete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-dark-grey mb-2">
              No tasks found
            </h3>
            <p className="text-mid-grey mb-6">
              {filter === 'completed' 
                ? 'No completed tasks yet.'
                : filter === 'pending'
                ? 'All caught up! No pending tasks.'
                : 'Start by adding your first task.'}
            </p>
            {filter === 'all' && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Task
              </Button>
            )}
          </div>
        )}
      </PageContainer>
    </PageTransition>
  );
}
