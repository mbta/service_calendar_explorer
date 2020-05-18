import { State } from "../Store";

export default function fetchMBTA(path: string) {
  return fetch(`${process.env.REACT_APP_API_URL}${path}`, {
    headers: 
      [['x-api-key', `${process.env.REACT_APP_API_KEY}`]],
  })
}

export function fetchInitialData() {
  const storedState: string | null = window.localStorage.getItem('mbta-service-exp--state');
  const parsedStoredState: State | null = storedState ? JSON.parse(storedState) : null;
  return parsedStoredState;
}

export function saveInitialData(newState: State) {
  window.localStorage.setItem('mbta-service-exp--state', JSON.stringify(newState));
}