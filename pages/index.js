import Head from 'next/head'
import { useRef, useEffect, useState } from 'react';

export default function Page() {
  const [minutes, setMinutes] = useState(24)

  return (
    <div className="h-screen flex pb-32">
      <Head>
        <title>Timer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-auto">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            console.log('submit')
          }}
        >
          <MinutesInput
            value={minutes}
            onChange={setMinutes}
          />
        </form>
      </div>
    </div>
  )
}


const MinutesInput = ({ value, onChange }) => {

  const ref = useRef()
  useEffect(() => {
    ref.current.focus()
  })

  return (
    <input
      type="number"
      min="0"
      max="59"
      value={value}
      className="font-mono text-8xl w-72 text-center outline-none"
      onChange={(event) => {
        onChange(event.target.value)
      }}
      ref={ref}
    />
  )
}
