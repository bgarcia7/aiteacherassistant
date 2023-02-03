import axios from 'axios';

const API_URL = 'https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/';

export const createLessonPlan = async (lessonPlan) => {
  console.log('Sending lesson plan to server: ', lessonPlan);
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
//   console.log('response', response.data);
//   return response.data.lesson_plan;
};
