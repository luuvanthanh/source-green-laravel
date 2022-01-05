import { Tag } from 'antd';
import classNames from 'classnames';
import PropType from 'prop-types';
import styles from '../style.module.scss';

const CardLesson = ({ value }) => (
  <Tag
    className={classNames('d-flex align-items-center justify-content-left', styles['tag-content'])}
    color={value?.class?.colorCode}
  >
    {value?.class?.name}
  </Tag>
);

export default CardLesson;

CardLesson.propTypes = {
  value: PropType.any,
};

CardLesson.defaultProps = {
  value: {},
};
