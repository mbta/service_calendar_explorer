import React, { ReactElement, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import fetchMBTA from '../util/fetch-mbta';
import { dateRange, dateText } from '../util/date';
import { typicality, Service } from '../util/service';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../Store';

const ServiceCard = ({ id, service }: { id: string, service: Service }): ReactElement => {
  return (
    <div className="service border-primary-lightest-contrast">
      <header className="rating">
        {dateRange(service.rating_start_date, service.rating_end_date)}
        <span className="float-right">{service.rating_description}</span>
      </header>

      <div>
        {typicality(service.schedule_typicality)}
        <span className="badge badge-secondary">{service.schedule_type} [{service.valid_days.join(", ")}]</span>
      </div>

      <header className="mt-2">
        <span className="text-uppercase font-weight-bold">{service.schedule_name}</span>
        <br />
        {dateRange(service.start_date, service.end_date)}
      </header>


      {service.added_dates.length > 0 && (
        <div className="added-dates">
          {service.added_dates.map((d, i) => 
            <div key={d} className="text-success">
              ⊕ {dateText(d)} {service.added_dates_notes[i]}
            </div>
          )}
        </div>
      )}

      {service.removed_dates.length > 0 && (
        <div className="removed-dates">
          {service.removed_dates.map((d, i) =>
            <div key={d} className="text-danger">
              ⊖ {dateText(d)} {service.removed_dates_notes[i]}
            </div>
          )}
        </div>
      )}  

      <footer className="text-muted small">
        {id}
      </footer>
    </div>
  )
}

const Services = (): ReactElement => {
  const dispatch = useDispatch();
  const routeIDs = useSelector((store: State) => store.routes);
  const routesQuery = routeIDs.sort().join("-");
  const [services, setServices] = useLocalStorage(routesQuery);

  useEffect(() => {
    async function fetchIt() {
      dispatch({ type: "START_LOAD" })
      try {
        const response = await fetchMBTA(`/services?filter%5Broute%5D=${routeIDs.sort().join(",")}`)
        const { data: newServices } = await response.json();
        setServices(newServices);
        dispatch({ type: "SET_ERROR", payload: { error: null } })
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: { error: error } })
      }
    }

    if (services === "") {
      fetchIt();
    }
  }, [services, routeIDs, setServices, dispatch]);
  
  return <div className="services-wrapper">
    {!!services && services.map((service: any, i: number) =>
      <ServiceCard key={`${service.id}-${i}`} id={service.id} service={service.attributes} />
    )}
  </div>
}

export default Services;