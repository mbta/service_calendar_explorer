import React, { ReactElement, useEffect, useState } from 'react';
import RouteButton from './RouteButton';
import { Error, NoData, Loading } from './Messages';
import useLocalStorage from '../hooks/useLocalStorage';
import { useSelector } from 'react-redux';
import { State } from '../Store';

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

const Settings = (): ReactElement => {
  const [routes, setRoutes] = useLocalStorage("allRoutes", "");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!routes) {
      const fetchData = async () => {
        try {
          const res = await fetch("https://green.dev.api.mbtace.com/routes", {});
          const json = await res.json();
          setRoutes(json.data);
        } catch (error) {
          setError(error);
        }
      };
  
      fetchData();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedRouteIDs = useSelector((store: State) => store.routes)
  if (!routes) return <Loading />;
  if (routes.length === 0) return <NoData />;
  if (error) return <Error error={error} />;

  const routeGroups = routes.reduce((acc: { selectedRoutes: Route[], otherRoutes: Route[] }, route: Route) => {
    if (selectedRouteIDs.includes(route.id)) {
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