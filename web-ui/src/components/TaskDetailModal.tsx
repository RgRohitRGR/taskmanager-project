// src/components/TaskDetailModal.tsx

import React from 'react';
import { Modal, Descriptions, List, Tag, Typography, Button, Space, message } from 'antd';
import { Task, TaskExecution } from '../types/TaskTypes';
import { PlayCircleOutlined } from '@ant-design/icons';
import { TaskApi } from '../services/TaskApi';
import axios from 'axios';

const { Text, Title } = Typography;

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onRunSuccess: () => void;
}

const formatDateTime = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Invalid Date';
  }
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onRunSuccess }) => {
  if (!task) return null;

  const handleRerun = async () => {
    try {
      await TaskApi.runTask(task.id);
      message.success('Task command re-executed successfully!');
      onRunSuccess(); 
      onClose();      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message.error(`Failed to run task: ${error.response.data.message}`);
      } else {
        message.error('Failed to run task command.');
      }
    }
  };

  const sortedExecutions = [...task.taskExecutions].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <Modal
      title={`Task Details: ${task.name}`}
      open={!!task}
      onCancel={onClose}
      footer={[
        <Button 
          key="rerun" 
          icon={<PlayCircleOutlined />} 
          onClick={handleRerun}
          aria-label={`Rerun task command ${task.name}`}
        >
          Run Task Again
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
        <Descriptions.Item label="ID">{task.id}</Descriptions.Item>
        <Descriptions.Item label="Owner">{task.owner}</Descriptions.Item>
        <Descriptions.Item label="Command" span={2}>
          <Text code>{task.command}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginTop: '20px' }} aria-level={4}>
        Execution History ({task.taskExecutions.length} runs)
      </Title>

      <List
        bordered
        dataSource={sortedExecutions}
        locale={{ emptyText: 'No executions found for this task.' }}
        renderItem={(item: TaskExecution) => (
          <List.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Tag color="green">COMPLETED</Tag>
                <Text strong>Start:</Text> {formatDateTime(item.startTime)}
                <Text strong>Duration:</Text> 
                  {(new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / 1000}s
              </Space>
              
              <Text strong>Output:</Text>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap', 
                  maxHeight: '150px',     
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                }}
              >
                {item.output || 'No output recorded.'}
              </pre>
            </Space>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default TaskDetailModal;