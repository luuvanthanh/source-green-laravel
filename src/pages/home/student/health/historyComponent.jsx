import { memo, useState, useEffect } from 'react';
import { Form, Timeline, Skeleton } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector, useDispatch } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';

import styles from '../../index.scss';

const Index = memo(({ studentId }) => {
  const dispatch = useDispatch();
  const [ { health }, loading] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

  const [search, setSearch] = useState({
    rangeTime: [
      moment().clone().startOf('week').format(variables.DATE_FORMAT.DATE_AFTER),
      moment().clone().endOf('week').format(variables.DATE_FORMAT.DATE_AFTER)
    ]
  });

  const fetchDataHealth = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_HEALTH_HISTORY',
      payload: {
        StudentId: studentId,
        FromDate: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[0],
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }) : null,
        ToDate: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[1],
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }) : null,
      },
    });
  };

  useEffect(() => {
    fetchDataHealth();
  }, [search.rangeTime, studentId]);

  const handleSearch = _.debounce((value) => {
    if (value) {
      setSearch((prevSearch) => ({
        ...prevSearch,
        rangeTime: value
      }));
    }
  }, 300);

  const getPropertiesName = (properties) => {
    if (_.isEmpty(properties)) {
      return '';
    }
    const result = [...properties].map(item => `${item?.criteriaGroupPropertyName.toLocaleLowerCase()} ${ _.map(item?.studentCriteriaEntityPropertyChanges, 'newValue').join(' ')}`);
    return result?.join(', ');
  };

  return (
    <Pane>
      <Form initialValues={{
        ...search,
        rangeTime: [
          search?.rangeTime[0] ? moment(search?.rangeTime[0]) : null,
          search?.rangeTime[1] ? moment(search?.rangeTime[1]) : null,
        ],
      }}>
        <div className="row">
          <div className="col-md-4">
            <FormItem
              className="mb20"
              name="rangeTime"
              type={variables.RANGE_PICKER}
              onChange={handleSearch}
            />
          </div>
        </div>
      </Form>
      <div className={styles['container-timeline']}>
        <Scrollbars autoHeight autoHeightMax={500}>
          <div className="p20">
            {!loading['studentHomePage/GET_DATA_HEALTH_HISTORY'] && _.isEmpty(health.history) && (
              <p className="mb0 p20 border text-center font-weight-bold">{variables.NO_DATA}</p>
            )}
            {loading['studentHomePage/GET_DATA_HEALTH_EVERY_DAY'] ? (
              <>
              <Skeleton avatar paragraph={{ rows: 4 }} active />
              <Skeleton avatar paragraph={{ rows: 4 }} active />
              <Skeleton avatar paragraph={{ rows: 4 }} active />
            </>
            ) : (
              <>
                {health?.history.map((item, index) => (
                  <>
                    <h5 key={index} className="color-success mb20">{Helper.getDate(item?.reportDate, variables.DATE_FORMAT.SHOW_FULL_DATE)}</h5>
                    <Timeline>
                      {item?.history.map((itemChild, indexChild) => (
                        <Timeline.Item color="red" key={indexChild}>
                          <p className="color-blue font-weight-bold mb5">{Helper.getDate(itemChild?.changeTime, variables.DATE_FORMAT.TIME_FULL)}</p>
                          <p className="mb0">{`Giáo viên ${_.get(itemChild, 'studentCritetiaEntityChanges[0].editor.userName')} nhập ${getPropertiesName(itemChild?.studentCritetiaEntityChanges)}`}</p>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </>
                ))}
              </>
            )}
          </div>
        </ Scrollbars>
      </div>
    </Pane>
  );
});

Index.propTypes = {
  studentId: PropTypes.string,
};

Index.defaultProps = {
  studentId: '',
};

export default Index;
