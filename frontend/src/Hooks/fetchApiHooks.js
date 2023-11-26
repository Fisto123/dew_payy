import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/newRequest";
import { BASEURL } from "src/utils/constant";

export const useDepartmentFetchingTransaction = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorstatus, setErrorStatus] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASEURL}/getOrgDepartments`
        );
        setData(response.data);
      } catch (error) {
        setErrorStatus(error?.response?.status);
        if (errorstatus === 403) {
          nav("/500");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [errorstatus, nav]);

  return { data, loading, errorstatus, nav };
};
export const useUsersFetchingTransaction = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorstatus, setErrorStatus] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`${BASEURL}/getorgusers`);
        setData(response.data);
      } catch (error) {
        setErrorStatus(error?.response?.status);
        if (errorstatus === 403) {
          nav("/500");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [errorstatus, nav]);

  return { data, loading, errorstatus };
};
export const useDataCorporates = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getcorporates = async () => {
      try {
        //const id = decodeTokenFromCookie().id;
        const response = await axiosInstance.get(`${BASEURL}/getcorporates`);
        setData(response.data);
      } catch (error) {
        setError(error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getcorporates();
  }, []);

  return { data, loading, error };
};
export const useDepartmentBillers = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorstatus, setErrorStatus] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchDepartmentsBiller = async () => {
      try {
        const response = await axiosInstance.get(`${BASEURL}/getBillerMangers`);
        setData(response.data);
      } catch (error) {
        setErrorStatus(error?.response?.status);
        if (errorstatus === 403) {
          nav("/500");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDepartmentsBiller();
  }, [errorstatus, nav]);

  return { data, loading, errorstatus, nav };
};
export const useGetOrganizationBiller = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorstatus, setErrorStatus] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchOrgBiller = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASEURL}/getOrganizationBiller`
        );
        setData(response.data);
      } catch (error) {
        setErrorStatus(error?.response?.status);
        if (errorstatus === 403) {
          nav("/500");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrgBiller();
  }, [errorstatus, nav]);

  return { data, loading, errorstatus, nav };
};

// export const useDataFetchingSingleProduct = (productid) => {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const nav = useNavigate()

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${getSingleProductEndpoint}/${productid}`)
//         setData(response.data)
//       } catch (error) {
//         setError(error?.response?.status)

//         if (error) {
//           nav('/notfound')
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProducts()
//   }, [productid])

//   return { data, loading, error }
// }

// export const useDataDeletingSingleProduct = (productid) => {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const nav = useNavigate()

//   useEffect(() => {
//     const deleteProduct = async () => {
//       try {
//         const response = await axiosInstance.delete(`${deleteProductEndpoint}/${productid}`)
//         setData(response.data)
//       } catch (error) {
//         setError(error?.response?.status)
//       } finally {
//         setLoading(false)
//       }
//     }

//     deleteProduct()
//   }, [productid])

//   return { data, loading, error }
// }

// //transactions
// export const useDataFetchingUserTransaction = () => {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const nav = useNavigate()

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         //const id = decodeTokenFromCookie().id;
//         const response = await axiosInstance.get(`${getUsersTransactionEndpoint}`)
//         setData(response.data)
//       } catch (error) {
//         setError(error?.response?.status)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchTransactions()
//   }, [])

//   return { data, loading, error }
// }

// export const useDataSingleTransaction = (transactionid) => {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const nav = useNavigate()

//   useEffect(() => {
//     const getTransaction = async () => {
//       try {
//         const response = await axiosInstance.get(`${getSingleTransactionEndpoint}/${transactionid}`)
//         setData(response.data)
//       } catch (error) {
//         setError(error?.response?.status)
//         error?.response?.status === 404 && nav('/notfound')
//       } finally {
//         setLoading(false)
//       }
//     }

//     getTransaction()
//   }, [transactionid])

//   return { data, loading, error }
// }
