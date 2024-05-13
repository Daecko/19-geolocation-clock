import * as React from 'react'
import './App.css'
import dayMusic from "./music/day-time.mp3"
import noonMusic from "./music/outside.mp3"
import nightMusic from "./music/night-time.mp3"
function App() {
  const [timeData,setTimeData] = React.useState(null);
  const [dayTime,setDayTime] = React.useState("day");
  const [music,setMusic] = React.useState(dayMusic);
  const DAY_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const MONTH = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  React.useEffect(()=>{
    const apicall = async () => {
      try {
        const res = await fetch("https://worldtimeapi.org/api/ip")
        const data = await res.json()
        setTimeData(data)
        const currentHour = new Date(data.datetime).getHours();
        if(currentHour>6 && currentHour<12){
          setDayTime("day")
          setMusic(new Audio(dayMusic))
        } else if (currentHour>12 && currentHour<18){
          setDayTime("afternoon")
          setMusic(new Audio(noonMusic))
        } else {
          setDayTime("night")
          setMusic(new Audio(nightMusic))
        }
      } catch (error) {
        console.error(error)
      }
      console.log("api called")
    }
    //hacer llamado a la api
    apicall()
    //Intervalo para llamar la api cada minuto
    const interval = setInterval(apicall, 60000)
    //Limpiar intervalo despues de desmontar el componente
    return () => clearInterval(interval)
  },[]) // [] solo una ejecución tras montar el componente

  /* timeData formatting into date */
  const formatDate = (timeData) => {
    const date = new Date(timeData.datetime);
    const dateString = `${DAY_WEEK[timeData.day_of_week]} ${date.getDate()} ${MONTH[date.getMonth()]} ${date.getFullYear()}`;
    return dateString;
  }
  /* Use ISO8601-valid string  */
  const formatTime = (dateTime) => {
    return dateTime.slice(11,16)
  }
  return (
    <>
      <section className={`mainCont ${dayTime}`}>
        <p className='timeData'>
          Date: <span>{timeData ? formatDate(timeData) : "Loading"}</span> <br/>
          Time: <span>{timeData ? formatTime(timeData.datetime) : "Loading"}</span>
        </p>
        <button onClick={()=>music.play()}>Enjoy some music</button>
      </section>
    </>
  )
}

export default App
