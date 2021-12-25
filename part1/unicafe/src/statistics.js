import Statistic from "./statistic";

const Statistics = (props) => {
  const {good, neutral, bad} = props;

  const all = good + neutral + bad;

  if (good || neutral || bad) {
    return (
      <>
        <h2>statistics</h2>
        <Statistic text="good"
                   value={good} />
        <Statistic text="neutral"
                   value={neutral} />
        <Statistic text="bad"
                   value={bad} />
        <Statistic text="average"
                   value={(good - bad) / all} />
        <Statistic text="positive"
                   value={`${(good * 100) / all}%`} />
      </>
    )
  }

  return (
    <p>No feedback given</p>
  )
};

export default Statistics;
