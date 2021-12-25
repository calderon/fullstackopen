const Statistic = ({ text, value }) => {
  return (
    <tr>
      <th>{text}</th>
      <td>{value}</td>
    </tr>
  )
};

export default Statistic;