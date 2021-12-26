import { Helper, variables } from '@/utils';
import { Button } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import PropType from 'prop-types';
import styles from "../style.module.scss";

const CardDate = ({ times, content, onClick }) => !isEmpty(times) ? (
    <div className="d-flex align-items-center justify-content-left">
      <div className="d-flex flex-row pl-2">
        <span>{Helper.getDate(times.timeStart, variables.DATE_FORMAT.HOUR)}</span>
        <span className='pl-1 pr-1'>-</span>
        <span>{Helper.getDate(times.timeEnd, variables.DATE_FORMAT.HOUR)}</span>
      </div>
    </div>
  ) : 
  <Button className={classNames('w-100 pl-2 d-flex align-items-center justify-content-left', styles.rmPadding)} onClick={onClick}>{content.title}</Button>;

export default CardDate;

CardDate.propTypes = {
  times: PropType.objectOf(PropType.any),
  content: PropType.objectOf(PropType.any),
  onClick: PropType.func,
};
CardDate.defaultProps = {
  times: {},
  content: {},
  onClick: () => {},
};
