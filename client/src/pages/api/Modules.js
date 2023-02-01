import axios from 'axios';
const API_URL = 'https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/';

export const createLessonPlan = async (lessonPlan) => {
  const response = await axios.post(`${API_URL}lesson_plan`, lessonPlan, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers':
        'X-Requested-With, Content-Type, X-Auth-Token, Origin, Authorization',
    },
  });
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  console.log(response.data);
  return response.data;
};

const lessonPlan = {
  title: 'Lesson Plan 1',
  learning_objecive: 'This is a lesson plan',
};

createLessonPlan(lessonPlan);
