import axios from 'axios';

const API_URL = 'https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/';

export const getModule = async (moduleId) => {
  try {
    const response = await axios.get(`${API_URL}/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getModules = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
