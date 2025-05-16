// src/services/api.js
import axios from "axios";

// Base URL for the backend API
const BASE_URL = "https://merklecert-backend.onrender.com/api"; // Update with your backend URL
//const BASE_URL = "http://localhost:5000/api"; // Update with your backend URL
//const isFormData = data instanceof FormData;
// Axios instance for reusable configurations
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility function to handle API requests
const apiRequest = async ({
  url,
  method = "GET",
  data = null,
  headers = {},
}) => {
  try {
    // const response = await apiClient({
    //   url,
    //   method,
    //   data,
    //   headers: isFormData
    //     ? headers
    //     : { "Content-Type": "application/json", ...headers },
    // });
      const isFormData = data instanceof FormData;

      const response = await axios({
        baseURL: BASE_URL,
        url,
        method,
        data,
        headers: isFormData
          ? headers
          : { "Content-Type": "application/json", ...headers },
      });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch certificates by wallet address (GET)
export const fetchCertificates = async (walletAddress, authToken) => {
  const url = `/certificates/${walletAddress}`;
  const headers = {
    Authorization: `Bearer ${authToken}`, // Add JWT token if needed
  };
  return apiRequest({ url, method: "GET", headers });
};

// Upload certificate (POST) for admin (issue certificate without minting)
export const issueCertificate = async (certificateData, authToken) => {
  const url = "/certificates"; // Matches the POST route for issuing certificates
  const headers = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : undefined;
  return apiRequest({ url, method: "POST", data: certificateData, headers });
};

// Verify a certificate using its ID (GET)
export const verifyCertificate = async (certId) => {
  const url = `/verify/${certId}`;
  return apiRequest({ url, method: "GET" });
};

// Mint a certificate NFT (POST) - separate route for minting
export const merkleCertificateNFT = async (certificateData, authToken) => {
  const url = "/certificates/merkle"; // Minting route (separate from issuing)
    const headers = {
      "Content-Type": "application/json", // ← required
      Authorization: `Bearer ${authToken}`,
    };
  return apiRequest({ url, method: "POST", data: certificateData, headers });
};

// Register or find user by wallet address (POST)
export const registerOrFindUser = async (walletAddress) => {
  const url = "/users"; // Endpoint for registering or finding a user
  const data = { wallet: walletAddress };
  return apiRequest({ url, method: "POST", data });
};


// Get user role based on wallet address (GET)
export const getUserRole = async (walletAddress) => {
  const url = `/users/role/${walletAddress}`; // Assuming you have a route for this in the backend
  return apiRequest({ url, method: "GET" });
};

// Helper function to handle custom API error handling
const handleApiError = (error) => {
  if (error.response) {
    return { message: error.response.data.message || "Unknown Error" };
  }
  return { message: error.message || "Unknown Error" };
};


//   fetchCertificates,
//   uploadCertificate,
//   verifyCertificate,
//   mintCertificateNFT,
// };
