import styles from "./CountryList.module.css";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import CountryItem from "./CountryItem.jsx";
import {useCities} from "../contexts/CitiesContext.jsx";

function CountryList() {
  const {cities, isLoading} = useCities();
  if (isLoading) return <Spinner/>
  if (!cities.length) return <Message message="Add your firts city by clicking on the map!!"/>
  const countries = cities.reduce((acc, curr) => (acc.map(obj => obj.country)).includes(curr.country) ? acc : [...acc, {
    country: curr.country,
    emoji: curr.emoji
  }], []);
  return (
    <ul className={styles.countryList}>
      {countries.map(country => <CountryItem country={country} key={country.country}/>)}
    </ul>
  );
}

export default CountryList;