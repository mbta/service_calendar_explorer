/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactElement, useEffect } from 'react';
import RouteButton from './RouteButton';
import useLocalStorage from '../hooks/useLocalStorage';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../Store';
import fetchMBTA from '../util/fetch-mbta';

type RouteType = 0 | 1 | 2 | 3 | 4 | 5;
interface RouteAttributes {
  color: string;
  text_color: string;
  type: RouteType;
  short_name: string;
  long_name: string;
}
export interface Route {
  id: string;
  attributes: RouteAttributes;
}

const Settings = (): ReactElement | null => {
  const [routes, setRoutes] = useLocalStorage("mbta-service-exp--allRoutes");
  const selectedRouteIDs = useSelector((store: State) => store.routes);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchMBTA("/routes");
        const json = await res.json();
        setRoutes(json.data);
        dispatch({ type: "SET_ERROR", payload: { error: null } })
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: { error: error } })
      }
    };
  
    if (!routes) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  if (!routes) {
    return null;
  }

  
  const routeGroups = routes.reduce((acc: { selectedRoutes: Route[], otherRoutes: Route[] }, route: Route) => {
    if (selectedRouteIDs && selectedRouteIDs.includes(route.id)) {
      acc["selectedRoutes"].push(route);
    } else {
      acc["otherRoutes"].push(route);
    }
    return acc;
  }, {
    selectedRoutes: [],
    otherRoutes: []
  });

  return <>
    <a data-toggle="collapse" data-target="#more-routes" aria-expanded="false" aria-controls="more-routes">
      Show/hide more routes
    </a>
    <div className="btn-group-toggle btn-group__routes">
      {routeGroups["selectedRoutes"].map((route: Route) => (
        <RouteButton key={route.id} checked={true} route={route} />
      ))}
    </div>

    <div id="more-routes" className="collapse btn-group-toggle btn-group__routes">
      <hr />
      {routeGroups["otherRoutes"].map((route: Route) => (
        <RouteButton key={route.id} checked={false} route={route} />
      ))}
    </div>
  </>
}

export default Settings;