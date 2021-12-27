import { Helper, variables } from '@/utils';
import classNames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import moment from 'moment';
import PropType from 'prop-types';
import { Button, List } from 'antd';
import { useState } from 'react';
import styles from '../style.module.scss';

const CardMonth = ({ date, month, data, onClick }) => {
  const start = moment(date).add(7, 'hours').add(30, 'minutes');
  const startModal = moment(date).add(7, 'hours').add(30, 'minutes');
  const [show, setShow] = useState(false);
  return (
    <div
      className={classNames('w-100 d-flex flex-column justify-content-between', styles['card-month'])}
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
        <Button
          className={classNames('w-100 d-flex flex-row align-items-center', styles.rmPadding)}
          onClick={onClick}
        >
          <span className={styles.dotStyle} />
          <Text className="p-1" color="dark" size="normal">
            {Helper.getDate(start.add(0, 'minute').clone(), variables.DATE_FORMAT.HOUR)}
          </Text>
          <span>-</span>
          <Text className="p-1" color="dark" size="normal">
            {Helper.getDate(
              start.add(data[0].timeLearn, 'minutes').clone(),
              variables.DATE_FORMAT.HOUR,
            )}
          </Text>
          <span>:</span>
          <Text className="p-1" color="dark" size="normal">
            {data[0].title}
          </Text>
        </Button>
        <Button
          className={classNames('w-100 d-flex flex-row align-items-center', styles.rmPadding)}
          onClick={onClick}
        >
          <span className={styles.dotStyle} />
          <Text className="p-1" color="dark" size="normal">
            {Helper.getDate(start.add(0, 'minute').clone(), variables.DATE_FORMAT.HOUR)}
          </Text>
          <span> - </span>
          <Text className="p-1" color="dark" size="normal">
            {Helper.getDate(
              start.add(data[1].timeLearn, 'minutes').clone(),
              variables.DATE_FORMAT.HOUR,
            )}
          </Text>
          <span>:</span>
          <Text className="p-1" color="dark" size="normal">
            {data[1].title}
          </Text>
        </Button>
        <Button
          className={classNames('w-100 d-flex flex-row align-items-center', styles.rmPadding)}
          onClick={() => setShow(true)}
        >{`+ ${data.length} hoạt động khác`}</Button>
      </div>
      <div className={styles.list} style={{display: show ? 'block' : 'none'}}>
        <List
          bordered
          dataSource={data}
          renderItem={(item) => (
              <List.Item>
              <Button className='w-100 d-flex align-items-center justify-content-left' >
                <span className={classNames('mr-2', styles.dotStyle)} />
                <span>{Helper.getDate(startModal.add(0, 'minute').clone(), variables.DATE_FORMAT.HOUR)}</span>
                <span className='pl-2 pr-2'>-</span>
                <span>{Helper.getDate(startModal.add(item.timeLearn, 'minutes').clone(), variables.DATE_FORMAT.HOUR)}</span>
                <span className='pl-3'>{item.title}</span>
              </Button>
            </List.Item>
            )}
        />
        <Button className={styles.btnClose} onClick={() => setShow(false)}>X</Button>
      </div>
    </div>
  );
};

export default CardMonth;

CardMonth.propTypes = {
  date: PropType.any,
  month: PropType.any,
  onClick: PropType.func,
  data: PropType.arrayOf(PropType.any),
};

CardMonth.defaultProps = {
  date: '',
  month: '',
  onClick: () => {},
  data: [],
};
