import classNames from 'classnames';
import PropType from 'prop-types';
import Text from '@/components/CommonComponent/Text';
import styles from '../style.module.scss';

const ListDay = ({ value, lastPoint }) => {
  const { timeStart, timeEnd, content } = value;
  return (
    <div className={lastPoint === 0 ? classNames('pb-3', styles.listDay) : 'pb-3'}>
      <div className="d-flex flex-row align-items-start">
        <span className={lastPoint === 0 ? styles.dotList : styles.dotListTwo} />
        <div className="d-flex flex-row pl-3">
          <Text size="normal">{timeStart}</Text>
          <span className="pl-1 pr-2">-</span>
          <Text size="normal">{timeEnd}</Text>
        </div>
      </div>
      <Text size="normal" className="pl-4">
        {content.dayOfWeek ? content?.timetableActivityDetail?.name : content.name}
      </Text>
    </div>
  );
};

export default ListDay;

ListDay.propTypes = {
  value: PropType.object,
  lastPoint: PropType.any,
};
ListDay.defaultProps = {
  value: {},
  lastPoint: '',
};
