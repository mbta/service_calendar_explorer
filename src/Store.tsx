import { Reducer, createStore, Store } from "redux";

export interface Service {
  id: string;
  added_dates: string[];
  added_dates_notes: string[];
  description: string;
  end_date: string;
  rating_description: string;
  rating_end_date: string;
  rating_start_date: string;
  removed_dates: string[];
  removed_dates_notes: string[];
  schedule_name: string;
  schedule_type: string;
  schedule_typicality: number;
  start_date: string;
  valid_days: number[];
}

export interface State {
  routes: string[];
  grouping: {
    [key in keyof Omit<Service, "id">]: boolean;
  };
  sorting: {
    [key in keyof Omit<Service, "id">]: "asc" | "desc" | null;
  };
}

const storedState: string | null = window.localStorage.getItem('state');
const parsedStoredState: State | null = storedState ? JSON.parse(storedState) : null;

const initialState: State = parsedStoredState ? parsedStoredState : {
  routes: ["1","39"],
  grouping: {
    added_dates: false,
    added_dates_notes: false,
    description: false,
    end_date: false,
    rating_description: false,
    rating_end_date: false,
    rating_start_date: false,
    removed_dates: false,
    removed_dates_notes: false,
    schedule_name: false,
    schedule_type: false,
    schedule_typicality: false,
    start_date: false,
    valid_days: false,
  },
  sorting: {
    added_dates: null,
    added_dates_notes: null,
    description: null,
    end_date: null,
    rating_description: null,
    rating_end_date: null,
    rating_start_date: null,
    removed_dates: null,
    removed_dates_notes: null,
    schedule_name: null,
    schedule_type: null,
    schedule_typicality: null,
    start_date: null,
    valid_days: null,
  }
}

type ActionType = "INCLUDE_ROUTE" | "EXCLUDE_ROUTE" | "CHANGE_GROUPING" | "CHANGE_SORTING";

interface Action {
  type: ActionType;
  payload: { [key in "grouping"|"sorting"|"route"]: any };
}

const reducer: Reducer<State, Action> = (
  state = initialState,
  action: Action
): State => {
  let newState: State = { ...state };
  switch (action.type) {
    case "INCLUDE_ROUTE":
      newState = {
        ...newState,
        routes: [
          ...newState.routes,
          action.payload.route
        ]
      }
      break;
    case "EXCLUDE_ROUTE":
      newState = {
        ...newState,
        routes: [
          ...newState.routes.filter(routeId => routeId !== action.payload.route)
        ]
      }
      break;
    case "CHANGE_GROUPING":
      newState = {
        ...newState,
        grouping:  {
          ...newState.grouping,
          ...action.payload.grouping
        }
      }
      break;
    case "CHANGE_SORTING":
      newState = {
        ...newState,
        sorting: {
          ...newState.sorting,
          ...action.payload.sorting
        }
      }
      break;
    default:
      break;
  }

  window.localStorage.setItem('state', JSON.stringify(newState));
  return newState;
};

export const store: Store = createStore(reducer, initialState, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());