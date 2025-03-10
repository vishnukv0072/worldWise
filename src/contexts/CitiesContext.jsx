import {createContext, useContext, useEffect, useReducer, useState} from "react";
import {falseFn} from "leaflet/src/core/Util.js";

const BASE_URL = "http://localhost:9000";
const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: ""
}

function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded":
      return {...state, cities: action.payload, isLoading: false}
    case "city/loaded":
      return {...state, currentCity: action.payload, isLoading: false}
    case "city/created":
      return {...state, cities: [...state.cities, action.payload], isLoading: false}
    case "city/deleted":
      return {...state, cities: state.cities.filter(c => c.id !== action.payload), isLoading: false}
    case "loading":
      return {...state, isLoading: true}
    case "rejected":
      return {...state, error: action.payload, isLoading: false}
    default:
      throw new Error("Unknown type");
  }
}

function CitiesProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {cities, isLoading, currentCity} = state;

  useEffect(() => {
    async function fetchCities() {
      dispatch({type: "loading"});
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({type: "cities/loaded", payload: data});
      } catch {
        dispatch({type: "rejeted", payload: "Something went wrong while fetching cities!!"});
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({type: "loading"});
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({type: "city/loaded", payload: data});
    } catch (e) {
      dispatch({type: "rejeted", payload: "Something went wrong while loading the city!!"});
    }
  }

  async function createCity(cityObject) {
    dispatch({type: "loading"});
    try {
      const res = await fetch(`${BASE_URL}/cities/`, {
        body: JSON.stringify(cityObject),
        method: "POST",
        header: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      dispatch({type: "city/created", payload: data})
    } catch (e) {
      dispatch({type: "rejeted", payload: "Something went wrong while creating the city!!"});
    }
  }

  async function deleteCity(id) {
    dispatch({type: "loading"});
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE"
      });
      dispatch({type: "city/deleted", payload: id});
    } catch (e) {
      dispatch({type: "rejeted", payload: "Something went wrong while deleting the city!!"});
    }
  }

  return (
    <CitiesContext.Provider value={{
      cities,
      isLoading,
      currentCity,
      getCity,
      createCity,
      deleteCity
    }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export {CitiesProvider, useCities};