import React from 'react';
import { ToastContainer } from 'react-toastify';
import '../../assets/css/toast.css'

const CustomToastContainer: React.FC = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ marginTop: '90px' }}
            toastClassName="custom-toast"
        />
    );
};

export default CustomToastContainer;
