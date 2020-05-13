import React from 'react';
import './App.scss';
import Settings from './components/Settings'
import Services from './components/Services';
import Analysis from './components/Analysis';
import { useSelector } from 'react-redux';
import { State } from './Store';

function App() {
  const routeIDs = useSelector((store: State) => store.routes);
  return (
    <div className="app grid-wrapper">
      <header>
        <h1 className="title"><strong>MBTA</strong> Services Explorer</h1>
        <p className="small">Explore way too many services at once.</p>
      </header>
      <Analysis />
      <section>
        <small>Routes</small>
        <Settings />
      </section>
      <main>
        <small>Services</small>
        {routeIDs.length && <Services routeIDs={routeIDs} />}
      </main>
    </div>
  );
}

export default App;
