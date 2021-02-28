import Head from 'next/head'
import { useRef, useEffect, useState } from 'react';

export default function Page() {
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(minToMsec(25))
  const [min, sec] = msecToMinSec(remaining)

  return (
    <div className="h-screen flex pb-32">
      <Head>
        <title>{min}:{sec.toString().padStart(2, '0')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-auto">
        {running ?
          <Display remaining={remaining} />
          :
          <Form
            remaining={remaining}
            setRemaining={setRemaining}
            onComplete={(remaining) => {
              const until = (new Date()).getTime() + remaining
              setRunning(true)
              startCountDown(until, setRemaining)
            }}
          />
        }
      </div>
    </div>
  )
}

// Components

const Display = ({ remaining }) => {
  const [min, sec] = msecToMinSec(remaining)
  return (
    <div className="font-mono text-8xl w-72 text-center outline-none">
      {min}:{sec.toString().padStart(2, '0')}
    </div>
  )
}

const Form = ({ setRemaining, remaining, onComplete }) => {
  const minutes = msecToMin(remaining)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onComplete(remaining)
      }}
    >
      <AutoFocusInput
        type="number"
        min="0"
        max="59"
        value={minutes}
        className="font-mono text-8xl w-72 text-center outline-none"
        onChange={(event) => {
          setRemaining(minToMsec(event.target.value))
        }}
      />
    </form>
  )
}

const AutoFocusInput = ({ ref_, ...props }) => {
  const ref = useRef()
  useEffect(() => {
    ref.current.focus()
  })

  return (
    <input
      ref={ref}
      onFocus={(event) => {
        const position = event.target.value.length
        event.target.selectionEnd = position
        event.target.selectionStart = position
      }}
      {...props} />)
}

// Timer

const startCountDown = (until, setRemaining) => {
  const timerId = setInterval(() => {
    const now = (new Date()).getTime()
    const remaining = Math.max(until - now, 0)
    setRemaining(remaining)
    if (remaining == 0) {
      clearInterval(timerId)
    }
  }, 500)
}

// utilities

const msecToMinSec = (msec) => {
  const min = Math.floor(msec / 1000 / 60)
  const sec = (Math.floor(msec / 1000) % 60)
  return [min, sec]
}

const minToMsec = (min) => {
  return min * 60 * 1000

}

const msecToMin = (msec) => {
  return msec / (60 * 1000)
}