import { memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Form, Skeleton, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';

import styles from '../../index.scss';

const Index = memo(({ studentId, status }) => {
  const dispatch = useDispatch();
  const [ { health }, loading ] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

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
          format: variables.DATE_FORMAT.DATE_AFTER,
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

  const getIcon = (icon) => {
    switch (icon) {
      case 'LƯỢNG NƯỚC UỐNG':
        return '/images/icon/cup.png';
      case 'NGỦ TRƯA':
        return '/images/icon/sleeping.png';
      case 'BỮA UỐNG':
        return '/images/icon/blender.png';
      case 'BỮA NGOÀI GIỜ':
        return '/images/icon/sandwich.png';
      case 'PIPI':
        return '/images/icon/pipi.png';
      case 'PUPU':
        return '/images/icon/pupu.png';
      case 'ĂN SÁNG':
      case 'XẾ SÁNG':
        return '/images/icon/sunrise.png';
      case 'ĂN TRƯA':
      case 'XẾ TRƯA':
        return '/images/icon/sun.png';
      case 'XẾ CHIỀU':
          return '/images/icon/dawn.png';
      case 'TÌNH HUỐNG':
        return '/images/icon/note.png';
      default:
        return '';
    }
  };


  return (
    <div>
      <Form>
        <div className="row">
          <div className="col-md-4">
            <FormItem
              className="mb0"
              name="time"
              type={variables.DATE_PICKER}
              onChange={handleSearch}
            />
          </div>
        </div>
      </Form>
      <div className="row py10">
        {!loading['studentHomePage/GET_DATA_HEALTH_EVERY_DAY'] && _.isEmpty(health.everyDay) && (
          <p className="mb0 p20 border text-center font-weight-bold">{variables.NO_DATA}</p>
        )}
        {loading['studentHomePage/GET_DATA_HEALTH_EVERY_DAY'] ? (
          <>
           <Skeleton avatar paragraph={{ rows: 4 }} active />
           <Skeleton avatar paragraph={{ rows: 4 }} active />
           <Skeleton avatar paragraph={{ rows: 4 }} active />
         </>
        ) : (
          health?.everyDay.map((item, index) => (
            <div className="col-md-6 col-lg-4 my10" key={index}>
              <div className={classnames(styles['item-health'], 'd-flex', 'justify-content-between', `${!item.description ? 'align-items-center' : ''}`)}>
                <div className="d-flex align-items-center">
                  <Avatar
                    src={getIcon(item?.criteriaGroupProperty?.property)}
                    shape="square"
                    size={32}
                    icon={<UserOutlined />}
                  />
                  <p className="mb0 font-weight-bold ml10">{item?.criteriaGroupProperty?.property?.toLowerCase()}</p>
                </div>
                {item.value && (
                  <p className="font-weight-bold mt0 mb0 ml10 color-success">{item.value}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
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
