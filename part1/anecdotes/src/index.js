import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import Anecdote from './anecdote';

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(6).fill(0))

  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleNextAnecdoteClick = () => {
    const rand = randomBetween(0, props.anecdotes.length - 1);

    setSelected(rand);
  };

  const handleVoteClick = () => {
    const pointsCopy = [...points];
    pointsCopy[selected] += 1;
    
    setPoints(pointsCopy);
  };

  return (
    <div>
      <Anecdote anecdotes={anecdotes}
                points={points}
                index={selected} />
      <div>
        <button onClick={handleNextAnecdoteClick}>next anecdote</button>
        <button onClick={handleVoteClick}>vote</button>
      </div>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)