import { Button } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import PropType from 'prop-types';
import styles from '../style.module.scss';

const CardDate = ({ times, content }) =>
  !isEmpty(times) ? (
    <div className="d-flex align-items-center justify-content-left">
      <div className="d-flex flex-row pl-2">
        <span>{times.timeStart}</span>
        <span className="px-10">-</span>
        <span>{times.timeEnd}</span>
      </div>
    </div>
  ) : (
    <Button
      className={classNames(
        'w-100 pl-2 d-flex align-items-center justify-content-left',
        styles.rmPadding,
      )}
    >
      {content.dayOfWeek ? content?.timetableActivityDetail?.name : content.name}
    </Button>
  );

export default CardDate;

CardDate.propTypes = {
  times: PropType.objectOf(PropType.any),
  content: PropType.objectOf(PropType.any),
};
CardDate.defaultProps = {
  times: {},
  content: {},
};
