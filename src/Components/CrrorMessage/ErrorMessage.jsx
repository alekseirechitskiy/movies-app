import React from 'react';
import { Alert } from 'antd';
// import './ErrorMessage.css';
const Error = () => {
  return (
    <Alert
      message="Error"
      description="Could not get date from server. Please try again in 5 minutes."
      type="error"
      showIcon
    />
  );
  // return (
  //   <div className="error-message">
  //     <svg fill="#ff6347" width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467L12.884 2.532zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z" />
  //     </svg>
  //     <h2>Error!</h2>
  //     <p>Something happened!</p>
  //   </div>
  // );
};
export default Error;
