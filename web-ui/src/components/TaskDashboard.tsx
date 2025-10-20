// src/components/TaskDashboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, message, Modal, Tag, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, PlayCircleOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Task } from '../types/TaskTypes';
import { TaskApi } from '../services/TaskApi';
import TaskForm from './TaskForm';
import TaskDetailModal from './TaskDetailModal';
import axios from 'axios';

const { Search } = Input;
const { Text } = Typography;

const TaskDashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormModalVisible, setIsFormModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // 🆕 NEW STATE FOR DELETE CONFIRMATION
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);


    // --- Fetching Logic (Search and List) ---
    const fetchTasks = useCallback(async (nameFilter: string = '') => {
        setLoading(true);
        try {
            const data = nameFilter
                ? await TaskApi.searchTasksByName(nameFilter)
                : await TaskApi.getAllTasks();
                
            setTasks(data);
            if (nameFilter && data.length === 0) {
                message.info(`No tasks found matching "${nameFilter}".`);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setTasks([]);
            } else {
                message.error('Failed to fetch tasks from the API. Check backend status (port 8080).');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        fetchTasks(value);
    };

    // 🆕 DELETE HANDLER: Shows the custom confirmation modal
    const showDeleteConfirm = (taskId: string) => {
        setTaskToDeleteId(taskId);
        setIsDeleteModalOpen(true);
    };

    // 🆕 FINAL DELETE LOGIC: Executes API call
    const handleConfirmDelete = async () => {
        if (!taskToDeleteId) return;
        setLoading(true);

        try {
            await TaskApi.deleteTask(taskToDeleteId);
            message.success(`Task ${taskToDeleteId} deleted successfully.`);
            fetchTasks(searchQuery);
        } catch (error) {
            message.error('Failed to delete task.');
        } finally {
            setIsDeleteModalOpen(false);
            setTaskToDeleteId(null);
            setLoading(false);
        }
    };


    const handleRunTask = async (taskId: string) => {
        try {
            await TaskApi.runTask(taskId);
            message.success('Task command executed successfully! Output will be visible upon refresh.');
            fetchTasks(searchQuery);
        } catch (error) {
            message.error('Failed to run task command.');
        }
    };

    const handleViewTask = (task: Task) => {
        setSelectedTask(task);
    };
    
    const handleTaskActionSuccess = () => {
        setIsFormModalVisible(false);
        fetchTasks(searchQuery);
    };


    // --- Table Configuration ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 120, responsive: ['lg'] as const[] },
        { title: 'Name', dataIndex: 'name', key: 'name', 
            sorter: (a: Task, b: Task) => a.name.localeCompare(b.name) 
        },
        { title: 'Owner', dataIndex: 'owner', key: 'owner', responsive: ['sm'] as const[] },
        {
            title: 'Runs',
            key: 'runs',
            width: 80,
            render: (_: any, record: Task) => (
                <Tag color={record.taskExecutions.length > 0 ? 'blue' : 'default'}>
                    {record.taskExecutions.length}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 250,
            render: (_: any, record: Task) => (
                <Space size="middle">
                    <Button
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleRunTask(record.id)}
                        aria-label={`Run command for task ${record.name}`}
                        title="Run Command"
                        type="primary"
                    >Run</Button>
                    <Button
                        onClick={() => handleViewTask(record)} 
                        aria-label={`View details for task ${record.name}`}
                        title="View Details"
                    >
                        View
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        // 🆕 Calls the state setter to open the confirmation modal
                        onClick={() => showDeleteConfirm(record.id)} 
                        aria-label={`Delete task ${record.name}`}
                        title="Delete Task"
                    />
                </Space>
            ),
        },
    ];

    // --- UI Structure ---
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Rohit's Kubernetes Task Manager</h1>

            <Space 
                style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}
                wrap
            >
                <Search
                    placeholder="Search tasks by name"
                    onSearch={handleSearch}
                    allowClear
                    enterButton={<SearchOutlined />}
                    style={{ width: 350 }}
                    aria-label="Search tasks by name"
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedTask(null);
                        setIsFormModalVisible(true);
                    }}
                    aria-label="Create new task"
                >
                    Create New Task
                </Button>
            </Space>

            <Table
                dataSource={tasks}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 'max-content' }}
                role="region"
                aria-live="polite"
                aria-label="Task Management List"
            />

            {/* 1. Create/Edit Modal */}
            <Modal
                title={selectedTask ? 'Edit Task' : 'Create New Task'}
                open={isFormModalVisible}
                onCancel={() => setIsFormModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <TaskForm
                    initialTask={selectedTask}
                    onSuccess={handleTaskActionSuccess}
                />
            </Modal>

            {/* 2. Detail/Execution View Modal */}
            <TaskDetailModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onRunSuccess={() => fetchTasks(searchQuery)}
            />

            {/* 3. 🆕 CUSTOM DELETE CONFIRMATION MODAL (Permanent Fix) */}
            <Modal
                title={
                    <Space>
                        <QuestionCircleOutlined style={{ color: '#faad14' }} />
                        Confirm Deletion
                    </Space>
                }
                open={isDeleteModalOpen}
                onOk={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Delete"
                okType="danger"
                confirmLoading={loading}
            >
                <Text>
                    Are you sure you want to delete task ID: 
                    <Text strong type="danger"> {taskToDeleteId}</Text>? 
                    This action cannot be undone.
                </Text>
            </Modal>
        </div>
    );
};

export default TaskDashboard;