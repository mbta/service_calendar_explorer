import { Reducer, createStore, Store } from "redux";
import { fetchInitialData, saveInitialData } from "./util/fetch-mbta";

export interface State {
  routes: string[];
}

const parsedStoredState: State | null = fetchInitialData();

const initialState: State = parsedStoredState ? parsedStoredState : {
  routes: ["Red","39"],
}

type ActionType = "INCLUDE_ROUTE" | "EXCLUDE_ROUTE";

interface Action {
  type: ActionType;
  payload: { route: string };
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
    default:
      break;
  }

  saveInitialData(newState);
  return newState;
};

export const store: Store = createStore(reducer, initialState, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());