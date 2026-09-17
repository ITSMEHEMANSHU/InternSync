import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import { TASKS_LIST } from '../../data/mockData.js';

const TABS = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  COMPLETED: 'completed',
};

const TasksPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(TABS.TODO);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [workLog, setWorkLog] = useState('');

  const handleAddWorkLog = (task) => {
    setSelectedTask(task);
    setWorkLog('');
    setIsModalOpen(true);
  };

  const handleSubmitWorkLog = () => {
    setIsModalOpen(false);
    toast.success('Work log added successfully');
  };

  const tabs = [
    { id: TABS.TODO, label: 'To Do', count: TASKS_LIST.filter(t => t.status === 'todo').length },
    { id: TABS.IN_PROGRESS, label: 'In Progress', count: TASKS_LIST.filter(t => t.status === 'inprogress').length },
    { id: TABS.COMPLETED, label: 'Completed', count: TASKS_LIST.filter(t => t.status === 'completed').length },
  ];

  const filteredTasks = TASKS_LIST.filter(t => t.status === activeTab);

  const priorityColors = {
    high: 'bg-error-container text-on-error-container',
    medium: 'bg-secondary-container text-on-secondary-container',
    low: 'bg-tertiary-container text-on-tertiary-container',
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Tasks"
        breadcrumb="My Internship / Tasks"
        actions={[
          { label: 'Add Work Log', onClick: () => toast.info('Select a task to add work log') },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-label-sm font-bold ${priorityColors[task.priority]}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Due: {task.dueDate}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Assigned by: {task.assignedBy}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={task.status} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-surface-container text-on-surface-variant font-label-sm text-label-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAddWorkLog(task)}
                    className="px-4 py-2 bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold rounded-lg hover:bg-primary-container/80 transition-colors"
                  >
                    Add Work Log
                  </button>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">task_alt</span>
                <p className="font-body-md text-body-md text-on-surface-variant">No tasks in this category</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <StatCard
            icon="task_alt"
            label="Total Tasks"
            value={TASKS_LIST.length.toString()}
            iconBg="bg-primary-fixed/60 text-primary"
            trend="Active assignments"
          />
          <StatCard
            icon="pending"
            label="Pending Tasks"
            value={TASKS_LIST.filter(t => t.status !== 'completed').length.toString()}
            iconBg="bg-secondary-fixed/50 text-secondary"
            trend="Need attention"
          />
          <StatCard
            icon="check_circle"
            label="Completed Tasks"
            value={TASKS_LIST.filter(t => t.status === 'completed').length.toString()}
            iconBg="bg-tertiary-fixed/60 text-tertiary"
            trend="Great progress"
          />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Work Log - ${selectedTask?.title}`}
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-surface-container text-on-surface font-label-md text-label-md font-semibold rounded-lg hover:bg-surface-container-high"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitWorkLog}
              className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg hover:bg-primary/90"
            >
              Submit
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Work Log Entry</label>
            <textarea
              value={workLog}
              onChange={(e) => setWorkLog(e.target.value)}
              rows={6}
              placeholder="Describe your progress, challenges faced, and next steps..."
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Hours Spent</label>
            <input
              type="number"
              placeholder="Enter hours"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;