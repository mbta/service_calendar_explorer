import React, { ReactElement } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useSelector } from 'react-redux';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryLabel } from 'victory';
import { State, Service } from '../Store';
import { typicality } from './Services';

const today = new Date();

const serviceDateRanges = (service: Service, index: number) => {
  const { start_date, end_date } = service;
  return [start_date, end_date].map(date => {
    const x = date ? new Date(`${date}T01:00:00`) : new Date("2020-09-30T01:00:00");
    return {
      y: index,
      x,
      service
    }
  })
}

const ratingDateRanges = (service: Service, index: number) => {
  const { rating_start_date, rating_end_date } = service;
  return [rating_start_date, rating_end_date].map(date => {
    const x = date ? new Date(`${date}T01:00:00`) : new Date("2020-09-30T01:00:00");
    return {
      ...service,
      y: index,
      x,
    }
  })
}

const TypicalityLabel = (props: any): JSX.Element | null => {
  if (props.index === "0") {
    const icon = typicality(props.datum.schedule_typicality)
    return (
      <g>
        <text x={props.x} y={props.y} dy={4} fontSize={10} >
          <tspan>{icon}</tspan>
        </text>
      </g>
    );
  }
  return null;
};

const dateRanges = (services: Service[]) => {
  return <VictoryChart 
  padding={{ top: 0, left: 20, right: 20, bottom: 30 }} domain={{y: [-1, services.length]}} width={1000} scale={{ x: "time" }} >
    {services.map(ratingDateRanges).map((data, i) => <VictoryLine
      key={i}
      style={{
        data: { stroke: "#e2ecf9", strokeWidth: 10 }
      }}
      data={data}
      labels={({ datum }) => datum.schedule_typicality}
      labelComponent={<TypicalityLabel />}
    />)}
    {services.map(serviceDateRanges).map((data, i) => (
        <VictoryLine
          key={i}
          style={{
            data: { strokeWidth: 3 }
          }}
          data={data}
        />
      ))}

    <VictoryLine
      labels={["Today"]}
      labelComponent={<VictoryLabel renderInPortal y={8-services.length} dx={-2} dy={4} textAnchor="start" />}
      style={{
        data: { stroke: "red", strokeWidth: 1 },
        labels: {
          fill: "red",
          fontSize: 8,
          fontFamily: "Inter"
        }
      }}
      data={[{
        x: today,
        y: -1
      },{
        x: today,
        y: services.length
      }]}
    />

    <VictoryAxis offsetY={30} 
    style={{
      axis: {strokeWidth: 0},
      ticks: {stroke: "black",
      strokeOpacity: 1},
      tickLabels: {fontSize: 10, padding: 2, fontFamily: "Inter"}
    }}
    tickCount={8}
    tickFormat={x => x.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} />
  </VictoryChart>
}

// TODO: does not rerender with new services. Does show on refresh though
const Analysis = (): ReactElement => {
  const routeIDs = useSelector((store: State) => store.routes);
  const routesQuery = routeIDs.sort().join("-");
  const [services] = useLocalStorage(routesQuery, "");

  return services ? (
    <section>
      <small>Summary <span className="badge badge-primary ml-2">{services.length} services</span></small>
      <div>
        {dateRanges(services.map((s: any) => s.attributes))}
      </div>
    </section>
  ) : (
      <div className="alert alert-warning mb-0 small" role="alert">
        Make sure at least one route is selected, or try refreshing the page.
      </div>
    )
}

export default Analysis;