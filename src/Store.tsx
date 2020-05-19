import { Reducer, createStore, Store } from "redux";
import { fetchInitialData, saveInitialData } from "./util/fetch-mbta";

export interface State {
  routes: string[];
  loading: boolean;
  error: string | null;
}

const parsedStoredState: State | null = fetchInitialData();

const initialState: State = parsedStoredState ? parsedStoredState : {
  routes: ["Red","39"],
  loading: true,
  error: null
}

type ActionType = "START_LOAD" | "END_LOAD" | "SET_ERROR" | "INCLUDE_ROUTE" | "EXCLUDE_ROUTE";

interface Action {
  type: ActionType;
  payload: { route: string; error: string | null };
}

const reducer: Reducer<State, Action> = (
  state = initialState,
  action: Action
): State => {
  let newState: State = { ...state };
  switch (action.type) {
    case "START_LOAD":
      newState = {
        ...newState,
        loading: true
      }
      break;
    case "END_LOAD":
      newState = {
        ...newState,
        loading: false
      }
      break;
    case "INCLUDE_ROUTE":
      newState = {
        ...newState,
        routes: [
          ...newState.routes,
          action.payload!.route
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
    default:
      break;
  }

  saveInitialData(newState);
  return newState;
};

export const store: Store = createStore(reducer, initialState, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());