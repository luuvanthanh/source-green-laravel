import PropsType from 'prop-types';
import Text from '@/components/CommonComponent/Text';
import { isEmpty } from 'lodash';
import styles from '../style.module.scss';

const CardTime = (props) => {
  const { value } = props;
  return !isEmpty(value.class.timetableDetailActivityGroupByDayOfWeeks) ? (
    <div className={ styles['time-content']}>
      <div className={styles['time-title']}>
        <div className='d-flex flex-row align-items-center'>
          <Text color='dark' size='normal'>{value?.startTime}</Text>
          <span className='px-1'>:</span>
          <Text color='dark' size='normal'>{value?.endTime}</Text>
        </div>
      </div>
    </div>
  ) : <></>;
};

export default CardTime;

CardTime.propTypes = {
  value: PropsType.any,
};

CardTime.defaultProps = {
  value: '',
};
