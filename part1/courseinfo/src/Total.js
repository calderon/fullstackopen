const Total = (props) => {
  const sumExercises = (previous, current) => {
    return previous + current.exercises;
  };

  const total = props.parts.reduce(sumExercises, 0);

  return (
    <p>Number of exercises {total}</p>
  )
};

export default Total;
