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
  const intervalRef = useRef(null)
  const [currentSeconds, setCurrentSeconds] = useState(seconds)
  console.log('in', seconds)

  function startTicking(until) {
    if (intervalRef.current !== null) {
      return
    }
    intervalRef.current = setInterval(() => {
      const sec = until - (Date.now() / 1000)
      setSeconds(sec)
      setCurrentSeconds(sec)
    }, 1000)
  }

  return <TimerDisplay
    seconds={currentSeconds}
    onChange={(currentSeconds) => {
      setCurrentSeconds(currentSeconds)
    }}
    onCancel={() => {
      setCurrentSeconds(seconds)
      setSeconds(seconds)
    }}
    onSubmit={() => {
      setSeconds(currentSeconds)
      const u = Date.now() / 1000 + currentSeconds
      startTicking(u)
    }} />
}

function TimerDisplay({ seconds, onChange, onCancel, onSubmit }) {
  const min = Math.floor(seconds / 60).toString()
  const sec = (Math.floor(seconds) % 60).toString().padStart(2, '0')
  console.log('display:', seconds, min, sec)
  const [readOnly, setReadOnly] = useState(true)

  function calcSeconds(min, sec) {
    return parseInt(min) * 60 + parseInt(sec)
  }

  return (
    <input
      className="form-control form-control-lg mt-4 text-center"
      type="text"
      placeholder="00:00"
      value={`${min}:${sec}`}
      readOnly={readOnly}
      onClick={() => { setReadOnly(false) }}
      onKeyUp={(event) => {
        if (readOnly === true) {
          return
        }
        if (event.code === 'Escape') {
          setReadOnly(true)
          onCancel()
        } else if (event.code.startsWith('Digit')) {
          const number = event.key
          let newMin
          if (min === '0') {
            if (['1', '2', '3', '4', '5'].includes(number)) {
              newMin = number
            }
          } else if (min.length === 1) {
            newMin = min.concat(number)
          }
          onChange(calcSeconds(newMin, sec))
        } else if (event.code === 'Enter') {
          setReadOnly(true)
          onSubmit()
        } else if (['Delete', 'Backspace'].includes(event.code)) {
          if (min.length === 2) {
            setMin(min[0])
          } else {
            setMin(0)
          }
          onChange(calcSeconds(newMin, sec))
        }
      }} />
  )
}