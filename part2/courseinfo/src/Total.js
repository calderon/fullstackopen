const Total = (props) => {
  const sumExercises = (previous, current) => {
    return previous + current.exercises;
  };

  const total = props.parts.reduce(sumExercises, 0);

  return (
    <strong>total of {total} exercises</strong>
  )
};

export default Total;
