// import axios from "axios";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// export const useDelete = () => {
//   const { user } = useSelector((state) => state.auth); // Get user from Redux store
//   const [loadingDelete, setLoadingDelete] = useState(false);
//   const [responseDelete, setResponseDelete] = useState(null);

//   const deleteData = async (url, name) => {
//     setLoadingDelete(true);
//     try {
//       const config = {
//         headers: {
//           'Authorization': `Bearer ${user?.token || ''}`,
//         },
//       };

//       const response = await axios.delete(url, config);

//       if (response.status === 200) {
//         setResponseDelete(response)
//         toast.success(name);
//         return true; // Return true on success
//       }
//     } catch (error) {
//       toast.error(error.message);
//       console.error('Error Delete:', error);
//       return false; // Return false on error
//     } finally {
//       setLoadingDelete(false);
//     }
//   };

//   return { deleteData, loadingDelete, responseDelete };
// };

import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

export const useDelete = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux store
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [responseDelete, setResponseDelete] = useState(null);

  const deleteData = async (url, payload = {}, successMessage) => {
    setLoadingDelete(true);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user?.token || ''}`,
        },
        data: payload, // Include payload in the DELETE request
      };

      const response = await axios.delete(url, config);

      if (response.status === 200) {
        setResponseDelete(response);
        toast.success(successMessage);
        return true; // Return true on success
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Error Delete:', error);
      return false; // Return false on error
    } finally {
      setLoadingDelete(false);
    }
  };

  return { deleteData, loadingDelete, responseDelete };
};