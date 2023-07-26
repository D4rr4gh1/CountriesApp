import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({latlng}) => {
    const [weatherInfo, setWeatherInfo] = useState(null)
    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=${process.env.REACT_APP_API_KEY}`)
        .then(response => setWeatherInfo(response.data))}, [latlng])
    
        if(weatherInfo){
            const iconUrl =`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`
            return(
                <div>
                    <p>Temperature: {((weatherInfo.main.temp)-273.15).toFixed(2)} Celcius</p>
                    <img src={iconUrl} width='100' height='100' alt='Weather Icon'></img>
                    <p>Wind: {weatherInfo.wind.speed} m/s</p>
                </div>
            )
        }
}

const Display = ({toShowArray, setMatches}) => {

    const displayInfo = country => {
        const langArray = Object.values(country.languages)
        return(
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area}</p>
                <h2>Languages: </h2>
                {langArray.map(country => <li>{country}</li>)}
                <img src={country.flags.png} width='150' height='100' alt={`${country.name.common} flag`}></img>
                <h2>Weather in {country.capital}</h2>
                <Weather latlng={country.latlng}/>
            </div>
        )
    }
    
    if(toShowArray.length > 10)
    {
        return(
            <div>
                <p>Too many matches, narrow the search</p>
            </div>
        )
    }

    if(toShowArray.length < 10 && toShowArray.length > 1)
    {
        return(
            <div>
                <ul>
                    {toShowArray.map(country => <li className='listItem'>
                        {country.name.common}
                        <button className='showButton' onClick={() => setMatches([country])}>Show</button>
                        </li>)}
                </ul>
            </div>
        )
    }
 
    if(toShowArray.length === 1){
        return(displayInfo(toShowArray[0]))
    }
}
const App = () => {

    const [countryList, setCountryList] = useState([])
    const [countryName, setCountryName] = useState('')
    const [matches, setMatches] = useState([])

    useEffect(() => {
        axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => {
            const countryArray = response.data.map(country => country)
            setCountryList(countryArray)
            setMatches(countryArray)
        })
    }, [])


    const countrySearch = (event) => {
        setCountryName(event.target.value)
        const filteredList = countryList.filter(country => country.name.common.toUpperCase().includes(event.target.value.toUpperCase()))
        setMatches(filteredList)
    }


    if(!countryList){
        return null
    }

    return (
        <div className='mainCard'>
            <form>
                Find Countries <br></br>
                <input className='searchBox' value={countryName} onChange={countrySearch}></input>
            </form>

            <h1>Countries</h1>
            <Display toShowArray={matches} setMatches={setMatches}/>
        </div>
    )
}

export default App