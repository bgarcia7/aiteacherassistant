import axios from 'axios';

// ----------------------------------------------------------------------

export const getModule = async (moduleId) => {
  try {
    const response = await axios.get(`/api/module/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getModules = async () => {
  try {
    const response = await axios.get(
      'https://puoytuho08.execute-api.us-west-2.amazonaws.com/production/lessonplan/sjdkfl/'
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
