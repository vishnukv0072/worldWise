// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import {useEffect, useState} from "react";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import Button from "./Button.jsx";
import BackButton from "./BackButton.jsx";
import useUrlPosition from "../hooks/useUrlPosition.js";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import DatePicker from "react-datepicker";
import {useCities} from "../contexts/CitiesContext.jsx";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const {lat, lng} = useUrlPosition();
  const {createCity, isLoading} = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCity() {
      try {
        setIsLoadingGeoCoding(true);
        setError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if(!data.countryCode) throw new Error("");
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (e) {
        setError("Please select a valid point.");
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }

    if(lat && lng) fetchCity();
  }, [lat, lng]);

   async function handleSubmit(e) {
    e.preventDefault();
    if (!date || !cityName) return;
    const cityObject = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng
      }
    }
     createCity(cityObject);
    //otherwise the redirection happens immediately
    await navigate("/app/cities");
  }

  if (isLoadingGeoCoding) return <Spinner/>
  if (!lat && !lng) return <Message message="Start by clicking somewhere on the map." />
  if (error) return <Message message={error} />
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
         <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker selected={date} onChange={(date) => setDate(date)} dateFormat="dd-MM-yyyy" id="date"/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton/>
      </div>
    </form>
  );
}

export default Form;
