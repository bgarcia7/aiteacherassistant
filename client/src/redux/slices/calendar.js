import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { createLessonPlan } from 'src/pages/api/Modules';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  events: [],
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
      state.events = action.payload;
    },

    // GET MODULES
    getModulesSuccess(state, action) {
      state.isLoading = false;
      state.modules = action.payload;
    },

    // CREATE MODULE
    createModuleSuccess(state, action) {
      const newModule = action.payload;
      state.isLoading = false;
      state.modules = [...state.modules, newModule];
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
      state.selectedEventId = newEvent.id;
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      state.isLoading = false;
      state.events = state.events.map((event) => {
        if (event.id === action.payload.id) {
          return action.payload;
        }
        return event;
      });
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

// export function createLessonPlan() {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await getModules();
//       dispatch(slice.actions.getModulesSuccess(response));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// createLessonPlan();

// ----------------------------------------------------------------------

// export function createNewModule(newModule) {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await createModule(newModule);
//       dispatch(slice.actions.createModuleSuccess(response));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

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

export function createEvent(newEvent) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/new', newEvent);
      dispatch(slice.actions.createEventSuccess(response.data.event));
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
