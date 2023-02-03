import axios from 'axios';

// const API_URL = 'https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/';
const API_URL = 'http://127.0.0.1:5000/';

// ====================== Lesson Functions ======================

export const createLessonPlan = async (lessonPlan) => {
  console.log('Sending lesson plan to server: ', lessonPlan);
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
  console.log('response', response.data);
  return response.data.lesson_plan;
};

export const getLessonPlan = async (id) => {
  const response = await axios.get(`${API_URL}lesson_plan/${id}`);
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  console.log(response.data);
  return response.data;
};

// ====================== Module Functions ======================

export const regenerateModuleBody = async (moduleId) => {
  const response = await axios.post(`${API_URL}module/${moduleId}/regenerate`, {});
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const updateModule = async (moduleId, module) => {
  const response = await axios.post(`${API_URL}module/${moduleId}/edit`, { module });
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const deleteModule = async (moduleId) => {
  const response = await axios.delete(`${API_URL}module/${moduleId}`);
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
};

// ====================== Quiz Functions ======================

export const generateQuiz = async (lesson_plan_id) => {
  const response = await axios.post(`${API_URL}quiz/`, { lesson_plan_id });
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

// ====================== Slide Deck Functions ======================
export const generateSlides = async (lesson_plan_id) => {
  const response = await axios.post(`${API_URL}slide_deck/`, { lesson_plan_id });
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;

  // const slide_deck = response.data;
  // console.log('Step 1/2 Generating Slides Complete: ', slide_deck);

  // const response2 = await axios.post(`${API_URL}slide_deck/${slide_deck.id}google`, {
  //   lesson_plan_id,
  // });
  // if (response2.status !== 200) {
  //   throw new Error(response2.data.message);
  // }

  // return response2.data;
};
