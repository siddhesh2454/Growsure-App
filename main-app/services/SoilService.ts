import axios from 'axios';

// ⚠️ Replace with your system’s local IP (not localhost)
const BASE_URL = 'http://172.20.10.2:8000';

export const getSoilPrediction = async () => {
  try {
    // If backend reads Firebase data automatically
    const response = await axios.get(`${BASE_URL}/predict`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching soil data:', error.message);
    throw error;
  }
};
