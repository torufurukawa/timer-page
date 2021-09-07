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
  const [isEditing, setIsEditing] = useState(false)

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
    isEditing={isEditing}
    onClick={() => { setIsEditing(true) }}
    // TODO implement this function
    onChange2={(seconds, isEditing, readyToStart) => {
      console.log(seconds, isEditing, readyToStart)
      setIsEditing(isEditing)
      setSeconds(seconds)
      if (readyToStart === true) {
        // TODO stop a working timer, in onClick()?
        const until = Date.now() / 1000 + seconds
        startTicking(until)
      }
    }}
    onChange={(currentSeconds) => {
      setCurrentSeconds(currentSeconds)
    }}
  />
}

// TODO seconds と onChange だけ渡す
function TimerDisplay({ seconds, onChange, isEditing, onChange2 }) {
  const originalSeconds = seconds
  const [localSeconds, setLocalSeconds] = useState(seconds)
  const displayingSeconds = isEditing ? localSeconds : originalSeconds
  const min = Math.floor(displayingSeconds / 60).toString()
  const sec = (Math.floor(displayingSeconds) % 60).toString().padStart(2, '0')
  console.log('display:', displayingSeconds, min, sec)

  function calcSeconds(min, sec) {
    return parseInt(min) * 60 + parseInt(sec)
  }

  return (
    <input
      className="form-control form-control-lg mt-4 text-center"
      type="text"
      placeholder="00:00"
      value={`${min}:${sec}`}
      readOnly={!isEditing}
      onClick={() => {
        if (!isEditing) {
          onChange2(localSeconds, true, false)
        }
      }}
      onKeyUp={(event) => {
        if (isEditing === false) {
          return
        }
        if (event.code === 'Escape') {
          onChange2(originalSeconds, false, false)
        } else if (event.code.startsWith('Digit')) {
          const number = event.key
          let newMin = min
          if (min === '0') {
            if (['1', '2', '3', '4', '5'].includes(number)) {
              newMin = number
            }
          } else if (min.length === 1) {
            newMin = min.concat(number)
          }
          setLocalSeconds(calcSeconds(newMin, sec))
        } else if (event.code === 'Enter') {
          onChange2(localSeconds, false, true)
        } else if (['Delete', 'Backspace'].includes(event.code)) {
          let newMin = min
          if (min.length === 2) {
            newMin = min[0]
          } else {
            newMin = 0
          }
          setLocalSeconds(calcSeconds(newMin, sec))
        }
      }} />
  )
}
