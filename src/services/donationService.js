import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Create checkout session
export const createCheckoutSession = async (amount, alumniData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/api/donations/create-checkout-session`,
      {
        amount,
        alumniId: alumniData.alumniId,
        alumniName: alumniData.alumniName,
        alumniEmail: alumniData.alumniEmail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Verify payment
export const verifyPayment = async (sessionId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/api/donations/verify/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Get recent donations
export const getRecentDonations = async (limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/api/donations/recent?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


// ✅ Get donation analytics (uses alumniId)
export const getDonationAnalytics = async (alumniId = null) => {
  try {
    const token = localStorage.getItem("token");

    const url = alumniId
      ? `${API_URL}/api/donations/analytics?alumniId=${alumniId}`
      : `${API_URL}/api/donations/analytics`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


// ✅ Get alumni donations (uses alumniId)
export const getAlumniDonations = async (alumniId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/api/donations/alumni/${alumniId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
