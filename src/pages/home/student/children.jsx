import { memo, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';

import styles from '../index.scss';

const Index = memo(({ studentId }) => {
  const dispatch = useDispatch();
  const [ { childrensInClass }, loading] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    rangeTime: [
      moment().clone().startOf('week').format(variables.DATE_FORMAT.DATE_AFTER),
      moment().clone().endOf('week').format(variables.DATE_FORMAT.DATE_AFTER)
    ]
  });

  const fetchStudents = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_CHILD_IN_CLASS',
      payload: {
        studentId,
        ...search,
        rangeTime: undefined,
        startDate: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[0],
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }) : null,
        endDate: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
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
    fetchStudents();
  }, [search.rangeTime, studentId]);


  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'Thời gian',
      key: 'time',
      align: 'center',
      className: 'min-width-100',
      width: 200,
      render: (record) => Helper.getDate(record?.date, variables.DATE_FORMAT.DATE_MONTH),
    },
    {
      title: 'Vào lớp',
      key: 'getOnBus',
      align: 'center',
      width: 200,
      className: 'min-width-200',
      render: (record) => (record.status === "HAVE_IN" || record.status === "HAVE_OUT") ? record.checkIn : 'Vắng'
    },
    {
      title: 'Ra về',
      key: 'getOffBus',
      align: 'center',
      width: 200,
      className: 'min-width-200',
      render: (record) => (record.status === "HAVE_IN" || record.status === "HAVE_OUT") ? record.checkOut : 'Vắng'
    },
  ];

  const handleSearch = _.debounce((value) => {
    if (value) {
      setSearch((prevSearch) => ({
        ...prevSearch,
        rangeTime: value,
      }));
    } else {
      setSearch((prevSearch) => ({
        ...prevSearch,
        rangeTime: [
          moment().clone().startOf('week').format(variables.DATE_FORMAT.DATE_AFTER),
          moment().clone().endOf('week').format(variables.DATE_FORMAT.DATE_AFTER)
        ],
      }));
    }
  }, 300);

  return (
    <div className={classnames(styles['container-bus'], 'mt20')}>
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
              name="rangeTime"
              type={variables.RANGE_PICKER}
              onChange={handleSearch}
            />
          </div>
        </div>
      </Form>
      <Table
        bordered
        columns={header()}
        dataSource={childrensInClass}
        loading={loading['studentHomePage/GET_DATA_CHILD_IN_CLASS']}
        pagination={false}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </div>
  );
});

Index.propTypes = {
  studentId: PropTypes.string,
};

Index.defaultProps = {
  studentId: '',
};

export default Index;
