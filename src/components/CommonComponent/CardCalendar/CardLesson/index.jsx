import { Button } from 'antd';
import PropType from 'prop-types';

const colorCode = {
  earlyHours: '#81E7AC',
  circleTime: '#E8BEDF',
  teachingAids: '#FFFD38',
  elng: '#D6A4FF',
  moomin: '#FFA9AE',
  Physical: '#C7DFB5',
  arkki: '#FDD86F',
  swim: '#85C4FF',
};

const CardLesson = ({ value }) => (
  <Button
    className="w-100 d-flex align-items-center justify-content-left"
    style={{ background: colorCode[value.group] }}
  >
    {value.title}
  </Button>
);

export default CardLesson;

CardLesson.propTypes = {
  value: PropType.any,
};

CardLesson.defaultProps = {
  value: {},
};