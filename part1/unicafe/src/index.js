import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import './index.css';

import Button from './button';
import Statistics from './statistics';

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good"
              onClick={handleGoodClick}>good</Button>
      <Button text="neutral"
              onClick={handleNeutralClick}>neutral</Button>
      <Button text="bad"
              onClick={handleBadClick}>bad</Button>

      <Statistics good={good}
                  neutral={neutral}
                  bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)