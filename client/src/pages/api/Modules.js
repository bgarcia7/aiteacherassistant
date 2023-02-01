import axios from 'axios';
const API_URL = 'https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/';

// export const createLessonPlan = async (lessonPlan) => {
//   const response = await axios.post(`${API_URL}lesson_plan/`, lessonPlan, {
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
//       'Access-Control-Allow-Headers':
//         'X-Requested-With, Content-Type, X-Auth-Token, Origin, Authorization',
//       'Access-Control-Allow-Origin': '*',
//     },
//   });
//   if (response.status !== 200) {
//     throw new Error(response.data.message);
//   }
//   console.log(response.data);
//   return response.data;
// };

const createLessonPlan = async (req, res) => {
  const { title, learning_objective } = req.body;
  const response = await axios.post(`${API_URL}lesson_plan/`, {
    title,
    learning_objective,
  });
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  console.log(response.data);
  return response.data;
};

const getLessonPlan = async (req, res) => {
  const lessonplanId = '7bd368d3-7a0a-4f3f-992b-6c4dfeea37b4';
  const response = await axios.get(`${API_URL}lesson_plan/${lessonplanId}`);
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  console.log(response.data);
  return response.data;
};

console.log('hello');
