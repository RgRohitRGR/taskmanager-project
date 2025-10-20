// src/components/TaskForm.tsx

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Task, TaskPayload } from '../types/TaskTypes';
import { TaskApi } from '../services/TaskApi';
import axios from 'axios'; // Import axios to check for axios errors

interface TaskFormProps {
  initialTask: Task | null;
  onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTask) {
      form.setFieldsValue(initialTask);
    } else {
      form.resetFields();
      form.setFieldValue('id', `TEMP-${Date.now()}`); 
    }
  }, [initialTask, form]);


  const onFinish = async (values: TaskPayload) => {
    setLoading(true);
    try {
      await TaskApi.createOrUpdateTask(values); 
      message.success(`Task ${initialTask ? 'updated' : 'created'} successfully!`);
      onSuccess();
    } catch (error) {
      const errorMessage = initialTask ? 'update' : 'create';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
         message.error(`Failed to ${errorMessage} task: ${error.response.data.message}`);
      } else {
         message.error(`Failed to ${errorMessage} task. Check API status.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="task_form"
      onFinish={onFinish}
      initialValues={initialTask || {}}
      autoComplete="off"
    >
      <Form.Item
        label="Task ID"
        name="id"
        rules={[{ required: true, message: 'Task ID is required for the API.' }]}
      >
        <Input 
          disabled={!!initialTask} 
          aria-label="Task ID (read-only when editing)"
        />
      </Form.Item>

      <Form.Item
        label="Task Name"
        name="name"
        rules={[{ required: true, message: 'Please input the task name!' }]}
      >
        <Input placeholder="e.g., Deploy Frontend" />
      </Form.Item>

      <Form.Item
        label="Owner"
        name="owner"
        rules={[{ required: true, message: 'Please input the task owner!' }]}
      >
        <Input placeholder="e.g., Jane Doe" />
      </Form.Item>

      <Form.Item
        label="Shell Command"
        name="command"
        rules={[
          { required: true, message: 'Please input the shell command!' },
        ]}
      >
        <Input.TextArea rows={4} placeholder="e.g., echo 'Hello World'" />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading} 
          style={{ width: '100%' }}
          aria-label={initialTask ? 'Update Task' : 'Create Task'}
        >
          {initialTask ? 'Update Task' : 'Create Task'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;