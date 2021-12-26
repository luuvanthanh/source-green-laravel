import { Helper, variables } from '@/utils';
import PropsType from 'prop-types';
import styles from '../style.module.scss';

const CardTime = (props) => {
  const { value } = props;
  let title = '';
  if (
    Number(Helper.getDate(value, variables.DATE_FORMAT.ONLY_MINUTES)) === 30 ||
    Number(Helper.getDate(value, variables.DATE_FORMAT.ONLY_MINUTES)) === 0
  ) {
    title = Helper.getDate(value, variables.DATE_FORMAT.HOUR);
  }
  return (
    <div className={title ? styles['time-content'] : undefined}>
      <p className={styles['time-title']}>{title}</p>
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
