import axios from 'axios';
const API_URL = 'https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/';

// ====================== Generate New Lesson ======================

export const createLessonPlan = async (lessonPlan) => {
  const response = await axios.post(`${API_URL}lesson_plan/`, lessonPlan, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers':
        'X-Requested-With, Content-Type, X-Auth-Token, Origin, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  console.log(response.data);
  return response.data;
};

// ====================== Get Lesson ID ======================
const getLessonPlan = async (req, res) => {
  const lessonplanId = '7bd368d3-7a0a-4f3f-992b-6c4dfeea37b4';
  const response = await axios.get(`${API_URL}lesson_plan/${lessonplanId}`);
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  console.log(response.data);
  return response.data;
};

// ====================== Regenerate Module Body ======================

export const regenerateModuleBody = async (moduleId) => {
  const response = await axios.post(`${API_URL}module/${moduleId}/regenerate`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers':
        'X-Requested-With, Content-Type, X-Auth-Token, Origin, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};
