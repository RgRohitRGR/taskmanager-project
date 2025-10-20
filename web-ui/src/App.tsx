// src/App.tsx

import React from 'react';
import TaskDashboard from './components/TaskDashboard';
import { ConfigProvider } from 'antd'; 

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      {/* TaskDashboard is the main component containing all the UI logic */}
      <TaskDashboard />
    </ConfigProvider>
  );
};

export default App;