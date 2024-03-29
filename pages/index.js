import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'

const icons = {
  'none': 'icon-gray.png',
  'tick': 'icon-green.png',
  'complete': 'icon-red.png'
}

export default function Page() {
  const [seconds, setSeconds] = useState(0)
  const [min, sec] = seconds2minsec(seconds)
  const [denote, setDenote] = useState('none')
  const favicon = icons[denote]

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${min}:${sec}`}</title>
        <link rel="icon" href={favicon} />
      </Head>
      <div className="container">
        <Timer seconds={seconds} setSeconds={setSeconds} setDenote={setDenote} />
      </div>
    </>
  )
}

function Timer({ seconds, setSeconds, setDenote }) {
  const [isEditing, setIsEditing] = useState(false)
  const intervalRef = useRef(null)
  let audio
  if (typeof (Audio) != 'undefined') {
    audio = new Audio('chime.mp3')
  }

  // ticker utililties
  function startTicking(until) {
    startInterval(until)
    setDenote('tick')
  }
  function stopTicking() {
    stopInterval()
    setDenote('complete')
  }
  function pauseTicking() {
    stopInterval()
    setDenote('none')
  }

  // interval utilities
  function startInterval(until) {
    if (intervalRef.current !== null) {
      return
    }
    intervalRef.current = setInterval(() => {
      let sec = (until - Date.now()) / 1000
      if (sec <= 0) {
        stopTicking()
        audio.play()
        sec = 0
      }
      setSeconds(sec)
    }, 500)
  }
  function stopInterval() {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  // component
  return (
    isEditing ?
      <TimeController
        seconds={seconds}
        onChange={(seconds, start) => {
          setSeconds(seconds)
          setIsEditing(false)
          if (start === true) {
            const until = Date.now() + seconds * 1000
            startTicking(until)
          }
        }} />
      :
      <TimeIndicator
        seconds={seconds}
        onClick={() => {
          setIsEditing(true)
          pauseTicking('none')
        }}
      />
  )
}

function TimeIndicator({ seconds, onClick }) {
  const [min, sec] = seconds2minsec(seconds)

  return (
    <input
      className="form-control form-control-lg mt-4 text-center"
      type="text"
      placeholder="00:00"
      value={`${min}:${sec}`}
      readOnly
      onClick={onClick}
    />
  )
}

function TimeController({ seconds, onChange }) {
  // placeholder
  const [min, sec] = seconds2minsec(seconds)
  const placeholder = `${min}:${sec}`

  // digits and representing text
  let initialDigits = parseInt(`${min}${sec}`).toString()
  if (initialDigits === '0') {
    initialDigits = ''
  }
  const [digits, setDigits] = useState(initialDigits)
  let text = digits
  if (digits.length >= 3) {
    const index = digits.length - 2
    text = digits.slice(0, index) + ':' + digits.slice(index)
  }

  const ref = useRef(null)

  // instantiate component first
  const input = <input
    className="form-control form-control-lg mt-4 text-center"
    type="text"
    placeholder={placeholder}
    readOnly={true}
    value={text}
    ref={ref}
    onKeyUp={(event) => {
      if (event.code.startsWith('Digit')) {
        const newDigits = `${digits}${event.key}`
        if (newDigits.length <= 4) {
          setDigits(newDigits)
        }
      } else if (event.code === 'Escape') {
        onChange(seconds, false)
      } else if (event.code === 'Enter') {
        const normalizedDigits = digits.padStart(4, '0')
        const min = parseInt(normalizedDigits.substring(0, 2))
        const sec = parseInt(normalizedDigits.substring(2, 4))
        const newSeconds = min * 60 + sec
        onChange(newSeconds, true)
      } else if (['Delete', 'Backspace'].includes(event.code)) {
        setDigits(digits.substring(0, digits.length - 1))
      }
    }} />

  // focus, then return
  useEffect(() => { ref.current.focus() }, [])
  return input
}

// Utilities

function seconds2minsec(seconds) {
  const min = Math.floor(seconds / 60).toString()
  const sec = (Math.floor(seconds) % 60).toString().padStart(2, '0')
  return [min, sec]
}

