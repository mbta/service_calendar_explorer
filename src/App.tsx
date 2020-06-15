import React from 'react';
import './App.scss';
import Settings from './components/Settings'
import Services from './components/Services';
import Analysis from './components/Analysis';
import { useSelector } from 'react-redux';
import { State } from './Store';
import { Loading, Error, NoData } from './components/Messages';

function App() {
  const loading = useSelector((store: State) => store.loading)
  const error = useSelector((store: State) => store.error)
  const routes = useSelector((store: State) => store.routes)
  
  return (
    <div className="app grid-wrapper">
      <header>
        <h1 className="title"><strong>MBTA</strong> Services Explorer</h1>
        <p className="small">Explore way too many services at once.</p>
      </header>
      <section>
        <small>Routes</small>
        <Settings />
      </section>
      {loading 
      ? <Loading /> 
      : (error ? <Error error={error} /> : (routes && routes.length ? <>
        <Analysis />
        <main>
          <small>Services</small>
          <Services />
        </main>
      </> : <NoData />))
      }
      
    </div>
  );
}

export default App;
