import PropsType from "prop-types";

const CardDate = (props) => {
  const {titleDate, date} = props;

  return (
    <div className="d-flex flex-column align-items-center">
      <div>{titleDate}</div>
      <div>{date}</div>
    </div>
  );
};

export default CardDate;

CardDate.propTypes = {
  titleDate: PropsType.any,
  date: PropsType.any,
};

CardDate.defaultProps = {
  titleDate: '',
  date: '',
};