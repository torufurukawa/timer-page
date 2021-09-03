import Head from 'next/head'
import { useState, useRef } from 'react'

export default function Page() {
  const [seconds, setSeconds] = useState(0)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container">
        <Timer seconds={seconds} setSeconds={setSeconds} />
      </div>
    </>
  )
}

function Timer({ seconds, setSeconds }) {
  const [minutes, setMinutes] = useState(Math.floor(seconds / 60))
  const [until, setUntil] = useState(Date.now() / 1000)
  const intervalRef = useRef(null)
  console.log('in', seconds)

  function startTicking(until) {
    if (intervalRef.current !== null) {
      return
    }
    intervalRef.current = setInterval(() => {
      const sec = until - (Date.now() / 1000)
      setSeconds(sec)
      setMinutes(sec / 60)

    }, 1000)
  }

  return <TimerDisplay
    minutes={minutes}
    onMinutesChange={(minutes, start = false) => {
      setMinutes(minutes)
      const sec = minutes * 60
      setSeconds(sec)
      console.log(sec)
      console.log('start:', start)
      if (start) {
        const u = Date.now() / 1000 + sec
        setUntil(u)
        startTicking(u)
      }
    }} />
}

function TimerDisplay({ minutes, onMinutesChange }) {
  const min = minutes.toString()
  const [readOnly, setReadOnly] = useState(true)
  const [currentMin, setCurrentMin] = useState(min)

  return (
    <input
      className="form-control form-control-lg mt-4 text-center"
      type="text"
      placeholder="00:00"
      value={`${currentMin}:00`}
      readOnly={readOnly}
      onClick={() => { setReadOnly(false) }}
      onKeyUp={(event) => {
        if (readOnly === true) {
          return
        }
        if (event.code === 'Escape') {
          setCurrentMin(min)
          setReadOnly(true)
        } else if (event.code.startsWith('Digit')) {
          const number = event.key
          if (currentMin === '0') {
            if (['1', '2', '3', '4', '5'].includes(number)) {
              setCurrentMin(number)
            }
          } else if (currentMin.length === 1) {
            setCurrentMin(currentMin.concat(number))
          }
        } else if (event.code === 'Enter') {
          setReadOnly(true)
          onMinutesChange(parseInt(currentMin), true)
        } else if (['Delete', 'Backspace'].includes(event.code)) {
          if (currentMin.length === 2) {
            setCurrentMin(currentMin[0])
          } else {
            setCurrentMin(0)
          }
        }
      }} />
  )
}