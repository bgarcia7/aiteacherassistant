import axios from 'axios';

const API_URL =
  'https://puoytuho08.execute-api.us-west-2.amazonaws.com/production/lessonplan/sjdkfl';

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
