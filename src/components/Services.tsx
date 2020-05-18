import React, { ReactElement, useState, useEffect } from 'react';
import { Loading, NoData } from './Messages';
import useLocalStorage from '../hooks/useLocalStorage';
import fetchMBTA from '../util/fetch-mbta';
import { dateRange, dateText } from '../util/date';
import { typicality, Service } from '../util/service';

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

const Services = ({routeIDs}: {routeIDs: string[]}): ReactElement => {
  const [loading, setLoading] = useState(false);
  const routesQuery = routeIDs.sort().join("-");
  const [services, setServices] = useLocalStorage(routesQuery);
  const [result, setResult] = useState(services);
  useEffect(() => {
    setLoading(!result)
  }, [result, setLoading]);
  
  useEffect(() => {
    async function fetchIt() {
      try {
        setLoading(true);
        const response = await fetchMBTA(`/services?filter%5Broute%5D=${routeIDs.sort().join(",")}`)
        const { data: newServices } = await response.json();
        setServices(newServices);
        setResult(newServices)
      } catch (error) {
        setLoading(false);
      }
    }

    if (services === "") {
      fetchIt();
    }
  }, [services, routeIDs, setServices]);
  
  if (loading) return <Loading />
  if (!result) return <NoData />;
  return <div className="services-wrapper">
    {result.map((service: any, i: number) =>
      <ServiceCard key={`${service.id}-${i}`} id={service.id} service={service.attributes} />
    )}
  </div>
}

export default Services;