import React from 'react';
import { Alert } from 'antd';
// import './ErrorMessage.css';
const Error = ({ message }) => {
  return (
    <Alert
      message="Error"
      // description="Could not get data from server. Please try again in 5 minutes."
      description={message}
      type="error"
      showIcon
    />
  );
};
export default Error;
