import { Helper, variables } from '@/utils';
import classNames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import PropType from 'prop-types';
import { Button } from 'antd';
import moment from 'moment';
import styles from '../style.module.scss';

const CardMonth = ({ date, month, data, Collapse, name }) => {
  const handle = (data, isShow, title) => {
    Collapse(data, isShow, title);
  };
  return (
    <div
      className={classNames(
        'w-100 d-flex flex-column justify-content-between',
        styles['card-month'],
      )}
    >
      {Helper.getDate(date, variables.DATE_FORMAT.MONTH) ===
      Helper.getDate(month, variables.DATE_FORMAT.MONTH) ? (
        <Text color="dark" size="normal">
          {Helper.getDate(date, variables.DATE_FORMAT.ONLY_DATE)}
        </Text>
      ) : (
        <span style={{ color: '#bfbfbf' }}>
          {Helper.getDate(date, variables.DATE_FORMAT.ONLY_DATE)}
        </span>
      )}

      <div className="d-flex flex-column">
        {data?.map(
          (item, idx) =>
            idx < 2 && (
              <Button
                className={classNames('w-100 d-flex flex-row align-items-center', styles.rmPadding)}
                key={idx}
              >
                <span className={styles.dotStyle} style={{background: item?.class.colorCode}} />
                <Text className="p-1" color="dark" size="normal">
                  {item.startTime}
                </Text>
                <span> - </span>
                <Text className="p-1" color="dark" size="normal">
                  {item.endTime}
                </Text>
                <span>:</span>
                <Text className="p-1" color="dark" size="normal">
                  {item?.class?.name}
                </Text>
              </Button>
            ),
        )}
        {data?.length > 2 && (
          <Button
            className={classNames('w-100 d-flex flex-row align-items-center', styles.rmPadding)}
            onClick={() => handle(data, true, `${name}, ${moment(date).format('[ngày] DD [tháng] MM [năm] YYYY')}`)}
          >{`+ ${data?.length - 2} hoạt động khác`}</Button>
        )}
      </div>
    </div>
  );
};

export default CardMonth;

CardMonth.propTypes = {
  date: PropType.objectOf(PropType.any),
  month: PropType.any,
  name: PropType.any,
  data: PropType.arrayOf(PropType.any),
  Collapse: PropType.func
};

CardMonth.defaultProps = {
  date: {},
  month: '',
  name: '',
  data: [],
  Collapse: () => {}
};
