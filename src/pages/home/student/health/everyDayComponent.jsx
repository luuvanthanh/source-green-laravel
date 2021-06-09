import { memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Form, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import FormItem from '@/components/CommonComponent/FormItem';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
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
        ReportDate: !_.isEmpty(search.date) ? Helper.getDateTime({
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
    }
  }, 300);

  const getIcon = (icon) => {
    switch (icon) {
      case 'LƯỢNG NƯỚC UỐNG':
        return '/images/icon/cup.svg';
      case 'NGỦ TRƯA':
        return '/images/icon/sleeping.svg';
      case 'BỮA UỐNG':
        return '/images/icon/blender.svg';
      case 'BỮA NGOÀI GIỜ':
        return '/images/icon/sandwich.svg';
      case 'PIPI':
        return '/images/icon/pipi.svg';
      case 'PUPU':
        return '/images/icon/pupu.svg';
      case 'ĂN SÁNG':
      case 'XẾ SÁNG':
        return '/images/icon/sunrise.svg';
      case 'ĂN TRƯA':
      case 'XẾ TRƯA':
        return '/images/icon/sun.svg';
      case 'XẾ CHIỀU':
          return '/images/icon/dawn.svg';
      case 'TÌNH HUỐNG':
        return '/images/icon/note.svg';
      default:
        return '';
    }
  };

  const getName = (name) => {
    if (!name) {
      return '';
    };
    return String(name).charAt(0).toUpperCase() + String(name).slice(1).toLocaleLowerCase();
  };

  return (
    <div>
      <Form initialValues={{
        ...search,
        date: search?.date ? moment(search?.date) : null,
      }}>
        <div className="row">
          <div className="col-md-4">
            <FormItem
              className="mb0"
              name="date"
              type={variables.DATE_PICKER}
              onChange={handleSearch}
            />
          </div>
        </div>
      </Form>
      <div className="row py10">
        {!loading['studentHomePage/GET_DATA_HEALTH_EVERY_DAY'] && _.isEmpty(health.everyDay) && (
          <div className="col-12">
            <p className="mb0 p20 border text-center font-weight-bold w-100">{variables.NO_DATA}</p>
          </div>
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
                  <AvatarTable
                    fileImage={getIcon(item?.criteriaGroupProperty?.property)}
                    srcLocal
                    size={32}
                  />
                  <div>
                    <p className="mb0 font-weight-bold ml10">{getName(item?.criteriaGroupProperty?.property)}</p>
                    {item?.note && (
                      <p className="mb0 ml10 font-size-13">{item?.note || ''}</p>
                    )}
                  </div>
                </div>
                {item.value && (
                  <p className="font-weight-bold mt0 mb0 ml10 color-success">{item.value || ''}</p>
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
