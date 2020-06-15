import { Reducer, createStore, Store } from "redux";
import ReduxQuerySync from 'redux-query-sync';
import { fetchInitialData, saveInitialData } from "./util/fetch-mbta";

export interface State {
  routes: string[] | null;
  loading: boolean;
  error: string | null;
}

const parsedStoredState: State | null = fetchInitialData();

const initialState: State = parsedStoredState ? parsedStoredState : {
  routes: ["Red", "39"],
  loading: true,
  error: null
}

type ActionType = "START_LOAD" | "END_LOAD" | "SET_ERROR" | "INCLUDE_ROUTE" | "EXCLUDE_ROUTE" | "SET_ROUTES";

interface ActionPayload { route: string; routes: string[], error: string | null }

interface Action {
  type: ActionType;
  payload: Partial<ActionPayload>;
}

const reducer: Reducer<State, Action> = (
  state = initialState,
  action: Action
): State => {
  let newState: State = { ...state };
  let { routes, route, error } = action.payload || {};
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
    case "SET_ERROR":
      newState = {
        ...newState,
        loading: false,
        error: error ? error : state.error
      }
      break;
    case "INCLUDE_ROUTE":
      newState = {
        ...newState,
        routes: route && newState.routes ? [
          ...newState.routes,
          route
        ] : state.routes
      }
      break;
    case "EXCLUDE_ROUTE":
      newState = {
        ...newState,
        routes: newState.routes ? [
          ...newState.routes.filter(routeId => routeId !== route)
        ] : []
      }
      break;
    case "SET_ROUTES":
      newState = {
        ...newState,
        routes: routes ? routes : []
      }
      break;
    default:
      break;
  }

  saveInitialData(newState);
  return newState;
};

const storeEnhancer = ReduxQuerySync.enhancer({
  params: {
    routes: {
      selector: (state: State) => state.routes,
      action: (value: Action) => ({ type: 'setPageNumber', payload: value }),
      defaultValue: initialState.routes,
    }
  },
  initialTruth: "store"
});

export const store: Store = createStore(reducer, initialState, storeEnhancer);