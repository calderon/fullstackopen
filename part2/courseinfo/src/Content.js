import Part from './Part';

const Content = (props) => {
  const parts = props.parts.map((part, index) => (
    <Part key={index}
          name={part.name}
          exercises={part.exercises} />
  ));

  return (
    <>
      {parts}
    </>
  )
}

export default Content;
