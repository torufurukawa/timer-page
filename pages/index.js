import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'

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
  const [isEditing, setIsEditing] = useState(false)

  // const intervalRef = useRef(null)
  // const [currentSeconds, setCurrentSeconds] = useState(seconds)
  // console.log('in', seconds)
  // function startTicking(until) {
  //   if (intervalRef.current !== null) {
  //     return
  //   }
  //   intervalRef.current = setInterval(() => {
  //     const sec = until - (Date.now() / 1000)
  //     setSeconds(sec)
  //     setCurrentSeconds(sec)
  //   }, 1000)
  // }

  return (
    isEditing ?
      <TimeController
        seconds={seconds}
        onChange={(seconds, start) => {
          setSeconds(seconds)
          setIsEditing(false)
        }} />
      :
      <TimeIndicator seconds={seconds} onClick={() => { setIsEditing(true) }} />
  )
}

function TimeIndicator({ seconds, onClick }) {
  const min = Math.floor(seconds / 60).toString()
  const sec = (Math.floor(seconds) % 60).toString().padStart(2, '0')

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
  const min = Math.floor(seconds / 60).toString()
  const sec = (Math.floor(seconds) % 60).toString().padStart(2, '0')
  const placeholder = `${min}:${sec}`

  // digits and representing text
  const [digits, setDigits] = useState('')
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
