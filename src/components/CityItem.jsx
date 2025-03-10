import styles from "./CityItem.module.css";
import {Link} from "react-router-dom";
import {useCities} from "../contexts/CitiesContext.jsx";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({city}) {
  const {id, cityName, emoji, date, position: {lat, lng}} = city;
  const {currentCity, deleteCity} = useCities();

  function handleDeletion(e) {
    e.preventDefault();
    deleteCity(city.id)
  }

  return (
    <li>
      <Link to={`${id}?lat=${lat}&lng=${lng}`} className={`${styles.cityItem} ${currentCity.id === id ? styles['cityItem--active'] : ''}`}>
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDeletion}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;