import React from 'react';
import { Alert } from 'antd';
// import './ErrorMessage.css';
const Error = ({ message }) => {
  return <Alert message="Error" description={message} type="error" showIcon />;
};
export default Error;
