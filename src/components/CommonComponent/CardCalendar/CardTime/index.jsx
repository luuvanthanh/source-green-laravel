import PropsType from 'prop-types';
import styles from '../style.module.scss';

const CardTime = (props) => {
  const { value } = props;
  return (
    <div className={value ? styles['time-content'] : undefined}>
      <p className={styles['time-title']}>{value}</p>
    </div>
  );
};

export default CardTime;

CardTime.propTypes = {
  value: PropsType.any,
};

CardTime.defaultProps = {
  value: '',
};
