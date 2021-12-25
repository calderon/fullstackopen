const Statistics = (props) => {
  const {good, neutral, bad} = props;

  const all = good + neutral + bad;

  if (good || neutral || bad) {
    return (
      <>
        <h2>statistics</h2>
        <p>good {good} </p>
        <p>neutral {neutral} </p>
        <p>bad {bad} </p>
        <p>average {(good - bad) / all}</p>
        <p>positive {(good * 100) / all}%</p>
      </>
    )
  }

  return (
    <p>No feedback given</p>
  )
};

export default Statistics;
