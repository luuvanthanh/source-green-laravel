import { Result } from 'antd';
import React from 'react';

const NoFoundPage = () => (
  <div className="d-flex justify-content-center align-items-center h-100" style={{ zIndex: 1 }}>
    <Result status="500" />
  </div>
);

export default NoFoundPage;
