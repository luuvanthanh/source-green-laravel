import { memo, useEffect, useState } from 'react';
import { Form, Typography } from 'antd';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';

import styles from '../index.scss';

const { Paragraph } = Typography;

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


  const fetchDataBus = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_CHILD_IN_CLASS',
      payload: {
        id: studentId,
        ...search,
        from: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[0],
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }) : null,
        to: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
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
    fetchDataBus();
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
      render: () => '16/05',
    },
    {
      title: 'Vào lớp',
      key: 'getOnBus',
      align: 'center',
      width: 200,
      className: 'min-width-200',
      render: (value, row, index) => {
        const obj = {
          children: index === 1 ? 'Không đăng ký xe Bus' : value,
          props: {
            colSpan: index === 1 ? 2 : 1
          }
        };
        return obj;
      }
    },
    {
      title: 'Ra về',
      key: 'getOffBus',
      align: 'center',
      width: 200,
      className: 'min-width-200',
      render: (value, row, index) => {
        const obj = {
          children: '07:21:17',
          props: {
            colSpan: index === 1 ? 0 : 1
          }
        };
        return obj;
      }
    },
    {
      title: 'Bảo mẫu',
      key: 'shuttler',
      width: 200,
      className: 'min-width-200',
      render: (record) => (
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
          {record?.busPlace?.busRoute?.busRouteNannies
            ?.map((item) => item?.nanny?.fullName)
            .join(',')}
        </Paragraph>
      ),
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
