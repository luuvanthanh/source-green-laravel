import { Helper, variables } from '@/utils';
import classNames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import PropType from 'prop-types';
import { Button, List } from 'antd';
import { useState } from 'react';
import styles from '../style.module.scss';

const CardMonth = ({ date, month, data, handleClick }) => {
  const [show, setShow] = useState(false);
  const clickButton = (value, type) => {
    handleClick(value, type);
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
                onClick={() => clickButton(item, 'dayGridMonth')}
                key={idx}
              >
                <span className={styles.dotStyle} />
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
            onClick={() => setShow(true)}
          >{`+ ${data?.length - 2} hoạt động khác`}</Button>
        )}
      </div>
      <div className={styles.list} style={{ display: show ? 'block' : 'none' }}>
        <List
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Button
                className="w-100 d-flex align-items-center justify-content-left"
                onClick={() => clickButton(item, 'dayGridMonth')}
              >
                <span className={classNames('mr-2', styles.dotStyle)} />
                <span>{item.startTime}</span>
                <span className="pl-2 pr-2">-</span>
                <span>{item.endTime}</span>
                <span className="pl-3">{item?.class?.name}</span>
              </Button>
            </List.Item>
          )}
        />
        <Button className={styles.btnClose} onClick={() => setShow(false)}>
          X
        </Button>
      </div>
    </div>
  );
};

export default CardMonth;

CardMonth.propTypes = {
  date: PropType.objectOf(PropType.any),
  month: PropType.any,
  handleClick: PropType.func,
  data: PropType.arrayOf(PropType.any),
};

CardMonth.defaultProps = {
  date: {},
  month: '',
  handleClick: () => {},
  data: [],
};
