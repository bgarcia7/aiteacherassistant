import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { createLessonPlan, getLessonPlan } from 'src/pages/api/Modules';

// ----------------------------------------------------------------------
const API_URL = 'https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/';

const initialState = {
  isLoading: false,
  error: null,
  events: {},
  modules: [],
  openDrawer: false,
  newLesson: false,
  selectedEventId: null,
  selectedRange: null,
  modules: [],
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      Object.keys(action.payload).forEach((key) => {
        state.events[action.payload[key].id] = action.payload[key];
      });
      console.log('events:', state.events);
    },

    // CREATE LESSON
    createEventSuccess(state, action) {
      const newLesson = action.payload.lesson_plan;
      // const lessonModules = newLesson.modules;
      state.isLoading = false;
      state.events = {
        ...state.events,
        [newLesson.id]: newLesson,
      };

      // state.modules = [...state.modules, lessonModules];
      state.selectedEventId = newLesson.id;
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const newLesson = action.payload.lesson_plan;
      state.isLoading = false;
      state.events = {
        ...state.events,
        [newLesson.id]: newLesson,
      };
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const eventId = action.payload;
      state.events = state.events.filter((event) => event.id !== eventId);
    },

    // SELECT EVENT
    selectEvent(state, action) {
      state.selectedEventId = null;
      const eventId = action.payload;
      state.selectedEventId = eventId;
      console.log(eventId);
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.openDrawer = true;
      state.selectedRange = { start, end };
    },

    // OPEN Drawer
    onNewLesson(state) {
      state.newLesson = true;
    },

    // CLOSE Drawer
    onCloseDrawer(state) {
      state.newLesson = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { onOpenDrawer, onCloseDrawer, selectEvent, selectRange } = slice.actions;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function getEvents() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/calendar/events');
      dispatch(slice.actions.getEventsSuccess(response.data.events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(event) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await createLessonPlan(event).then((response) => {
        console.log('response: ', response);
        return response;
      });
      console.log('create event response: ', response);
      dispatch(slice.actions.createEventSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(eventId, event) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/update', {
        eventId,
        event,
      });
      dispatch(slice.actions.updateEventSuccess(response.data.event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(slice.actions.deleteEventSuccess(eventId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
