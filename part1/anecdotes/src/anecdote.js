const Anecdote = ({anecdotes, points = {}, index = 0}) => (
  <>
    {anecdotes[index]}.
    <p>has {points[index] || 0} votes </p>
  </>
);

export default Anecdote;
