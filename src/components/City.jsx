import styles from "./City.module.css";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Spinner from "./Spinner.jsx";
import {useCities} from "../contexts/CitiesContext.jsx";
import BackButton from "./BackButton.jsx";

const BASE_URL = "http://localhost:9000";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const {id} = useParams();
  const {currentCity, getCity, isLoading} = useCities();

  useEffect(() => {
    getCity(id)
  }, [id]);

  //Do not place it above the effect, since early return before a hook breaks the fundamental rule of using hook.
  if (isLoading) return <Spinner/>
  const { cityName, emoji, date, notes } = currentCity;
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
