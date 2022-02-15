import PropsType from 'prop-types';
import Text from '@/components/CommonComponent/Text';

const CardDate = (props) => {
  const { titleDate, date } = props;

  return (
    <div className="d-flex flex-column align-items-center">
      <Text color="dark" size="medium">
        {titleDate}
      </Text>
      <Text color="dark" size="medium">
        {date}
      </Text>
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
