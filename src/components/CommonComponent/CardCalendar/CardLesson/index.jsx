import { Tag } from 'antd';
import PropType from 'prop-types';

const colorCode = {
  Bơi: '#81E7AC',
  'Nhảy dây': '#E8BEDF',
  'Circle Time': '#FFFD38',
  'Đón trẻ': '#D6A4FF',
  moomin: '#FFA9AE',
  Physical: '#C7DFB5',
  arkki: '#FDD86F',
  swim: '#85C4FF',
};

const CardLesson = ({ value }) => (
  <Tag
    className="w-100 d-flex align-items-center justify-content-left"
    style={{ background: colorCode[value?.class?.name] }}
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
