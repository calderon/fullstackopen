const Statistics = (props) => {
  const {good, neutral, bad} = props;

  return (
    <>
      <h2>statistics</h2>
      <p>good {good} </p>
      <p>neutral {neutral} </p>
      <p>bad {bad} </p>
      <p>average {(good - bad) / (good + neutral + bad)}</p>
      <p>positive {(good * 100) / (good + bad + neutral)}%</p>
    </>
  )
};

export default Statistics;
