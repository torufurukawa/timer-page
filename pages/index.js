import Head from 'next/head'
import { useState } from 'react'

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
  return <TimerDisplay minutes={minutes} onMinutesChange={(minutes) => {
    setMinutes(minutes)
    setSeconds(minutes * 60)
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
          onMinutesChange(parseInt(currentMin))
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