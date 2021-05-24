import { memo, useState, useEffect } from 'react';
import { Form, Timeline } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';

import styles from '../../index.scss';

const Index = memo(({ studentId, status }) => {
  const dispatch = useDispatch();
  // const [ { health }, loading] = useSelector(({ loading: { effects }, studentHomePage }) => [
  //   studentHomePage,
  //   effects,
  // ]);

  const [search, setSearch] = useState({
    date: moment().clone().startOf('week').format(variables.DATE_FORMAT.DATE_AFTER)
  });

  const fetchDataHealth = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_HEALTH_EVERY_DAY',
      payload: {
        id: studentId,
        status,
        ...search,
        date: !_.isEmpty(search.date) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.date,
          }),
          isUTC: false,
        }) : null,
      },
    });
  };

  useEffect(() => {
    fetchDataHealth();
  }, [search.date, studentId, status]);

  const handleSearch = _.debounce((value) => {
    if (value) {
      setSearch((prevSearch) => ({
        ...prevSearch,
        date: value
      }));
    } else {
      setSearch((prevSearch) => ({
        ...prevSearch,
        date: moment().clone().startOf('week').format(variables.DATE_FORMAT.DATE_AFTER)
      }));
    }
  }, 300);

  return (
    <Pane>
      <Form>
        <div className="row">
          <div className="col-md-4">
            <FormItem
              className="mb20"
              name="time"
              type={variables.RANGE_PICKER}
              onChange={handleSearch}
            />
          </div>
        </div>
      </Form>
      <div className={styles['container-timeline']}>
        <Scrollbars autoHeight autoHeightMax={500}>
          <div className="p20">
            <h5 className="color-success mb20">Thứ 2 - 15/05/2021</h5>
                <Timeline>
                  <Timeline.Item color="red">
                    <p className="color-blue font-weight-bold mb5">15:13:12</p>
                    <p className="mb0">Vào lớp</p>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <p className="color-blue font-weight-bold mb5">14:23:54</p>
                    <p className="mb0">Giáo viên Nguyễn Thị Linh nhập pipi 1 lần, pupu 2 lần, lượng nước uống 3 lần</p>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <p className="color-blue font-weight-bold mb5">14:23:54</p>
                    <p className="mb0">Giáo viên Nguyễn Thị Linh nhập ăn xế: Tốt</p>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <p className="color-blue font-weight-bold mb5">11:30:12</p>
                    <p className="mb0">Giáo viên Ngô Thu Phương nhập ghi chú pupu: Đi phân lỏng</p>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <p className="color-blue font-weight-bold mb5">10:43:21</p>
                    <p className="mb0">Giáo viên Ngô Thu Phương nhập pupu 1 lần</p>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <p className="color-blue font-weight-bold mb5">09:00:15</p>
                    <p className="mb0">Giáo viên Nguyễn Thị Linh nhập lượng nước uống 1 bình</p>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <p className="color-blue font-weight-bold mb5">08:32:23</p>
                    <p className="mb0">08:32:23</p>
                  </Timeline.Item>
                </Timeline>
          </div>
        </ Scrollbars>
      </div>
    </Pane>
  );
});

Index.propTypes = {
  studentId: PropTypes.string,
  status: PropTypes.string,
};

Index.defaultProps = {
  studentId: '',
  status: ''
};

export default Index;
