import React, { useCallback } from 'react';
import { Route } from './Settings';
import { useDispatch } from 'react-redux';

const abbreviate = (name: string): string => {
  let abbr = name.replace(/(line|trolley|pilot|ferry|event service)/ig, '');

  if (["red","mattapan","orange","blue"].includes(abbr.toLowerCase().trim())) {
    return abbr.charAt(0);
  }

  if (abbr.split(" ")[0].toLowerCase() === "green") {
    return abbr.split(" ")[2]
  }

  return abbr.trim().substr(0,4);
}

const RouteButton = ({ route, checked }: { route: Route, checked: boolean }) => {
  const {
    color,
    text_color,
    type,
    short_name,
    long_name
  } = route.attributes;
  const style = { 
    backgroundColor: `#${color}`, 
    color: `#${text_color}` 
  }
  const name = type === 3 ?  short_name : long_name;
  const dispatch = useDispatch();
  const changeRoute = useCallback(() => {
    const type = checked ? "EXCLUDE_ROUTE" : "INCLUDE_ROUTE";
    dispatch({ type, payload: { route: route.id }})
  }, [checked])

  return (
    <label className="badge badge-pill btn btn__route" style={style} onClick={changeRoute}>
      <input type="checkbox" name={route.id} id={route.id} checked={checked} readOnly />
      {abbreviate(name)}
      {checked && " ⓧ"}
    </label>
  )
}

export default RouteButton;