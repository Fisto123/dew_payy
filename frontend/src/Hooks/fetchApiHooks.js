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
export const useDepartmentTerminals = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorstatus, setErrorStatus] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchDepartmentsTerminal = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASEURL}/getterminalmanagers`
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
    fetchDepartmentsTerminal();
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
export const useDataUser = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(id);
  useEffect(() => {
    const getuser = async () => {
      try {
        //const id = decodeTokenFromCookie().id;
        const response = await axiosInstance.get(`${BASEURL}/getuser/${id}`);
        setData(response.data);
      } catch (error) {
        setError(error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getuser();
  }, []);

  return { data, loading, error };
};
export const useAllDataUsers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getusers = async () => {
      try {
        //const id = decodeTokenFromCookie().id;
        const response = await axiosInstance.get(`${BASEURL}/getUsers`);
        setData(response.data);
      } catch (error) {
        setError(error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getusers();
  }, []);

  return { data, loading, error };
};
export const useAllBillCode = (billcode, orgid) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(1, billcode, 2, orgid);

  useEffect(() => {
    const getBill = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASEURL}/getbill/${orgid}/${billcode}`
        );
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.log(error);
        setError(error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getBill();
  }, [billcode, orgid]);

  return { data, loading, error };
};
export const useGetInvoices = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getinvoices = async () => {
      try {
        //const id = decodeTokenFromCookie().id;
        const response = await axiosInstance.get(`${BASEURL}/getInvoices`);
        setData(response.data);
      } catch (error) {
        setError(error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getinvoices();
  }, []);

  return { data, loading, error };
};
export const useGetInvoice = (invoiceid) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getinvoices = async () => {
      try {
        //const id = decodeTokenFromCookie().id;
        const response = await axiosInstance.get(
          `${BASEURL}/getInvoice/${invoiceid}`
        );
        setData(response.data);
      } catch (error) {
        setError(error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getinvoices();
  }, [invoiceid]);

  return { data, loading, error };
};

export const useGetPaymentsAnalytics = () => {
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getPaymentsAnalyticals = async () => {
      try {
        //const id = decodeTokenFromCookie().id;
        const response = await axiosInstance.get(`${BASEURL}/getprofit`);
        setAmount(response?.data?.profit);
      } catch (error) {
        setError(error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getPaymentsAnalyticals();
  }, []);

  return { amount, loading, error };
};

export const useGetPendingPayments = () => {
  const [pendingamount, setPendingamount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getPaymentsAnalyticals = async () => {
      try {
        //const id = decodeTokenFromCookie().id;
        const response = await axiosInstance.get(`${BASEURL}/getpendingprofit`);
        setPendingamount(response?.data?.profit);
      } catch (error) {
        setError(error?.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getPaymentsAnalyticals();
  }, []);

  return { pendingamount, loading, error };
};
