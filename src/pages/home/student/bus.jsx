import { memo, useEffect, useState } from 'react';
import { Form, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';

import styles from '../index.scss';
import variablesModules  from '../variables';

const { TabPane } = Tabs;

const Index = memo(({ studentId }) => {
  const dispatch = useDispatch();
  const [ { bus }, loading] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

  const [tab, setTab] = useState(variablesModules.TABS_BUS[0].id);
  const [search, setSearch] = useState({
    rangeTime: [
      moment().clone().startOf('week').format(variables.DATE_FORMAT.DATE_AFTER),
      moment().clone().endOf('week').format(variables.DATE_FORMAT.DATE_AFTER)
    ]
  });

  const fetchDataBus = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_BUS',
      payload: {
        id: studentId,
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
        status: tab
      },
    });
  };

  useEffect(() => {
    fetchDataBus();
  }, [search.rangeTime, studentId, tab]);


  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'Thời gian',
      key: 'time',
      align: 'center',
      className: 'min-width-100',
      render: (record) => Helper.getDate(record?.date, variables.DATE_FORMAT.DATE_MONTH)
    },
    {
      title: 'Lên xe',
      key: 'getOnBus',
      align: 'center',
      className: 'min-width-100',
      render: (record) => {
        const obj = {
          children: Helper.getDate(
            record?.busPlaceLog?.[`${tab === variablesModules.TABS_BUS[0].id ? 'homewardGetIn' : 'schoolwardGetIn'}`],
            variables.DATE_FORMAT.TIME_FULL
          ),
          props: {
            colSpan: (record?.status === 'NO_GET_IN_BUS' || record?.status === 'NO_BUS_ROUTE') ? 3 : 1
          }
        };
        if (record?.status === 'NO_GET_IN_BUS' || record?.status === 'NO_BUS_ROUTE' || record?.absentStudent) {
          obj.children =  variablesModules[record?.status] || '';
        }
        return obj;
      }
    },
    {
      title: 'Xuống xe',
      key: 'getOffBus',
      align: 'center',
      className: 'min-width-100',
      render: (record) => {
        const obj = {
          children:  Helper.getDate(
            record?.busPlaceLog?.[`${tab === variablesModules.TABS_BUS[0].id ? 'homewardGetOff' : 'schoolwardGetOff'}`],
            variables.DATE_FORMAT.TIME_FULL
          ),
          props: {
            colSpan: (record?.status === 'NO_GET_IN_BUS' || record?.status === 'NO_BUS_ROUTE') ? 0 : 1
          }
        };
        if (record?.absentStudent) {
          obj.children =  variablesModules[record?.status] || '';
        }
        return obj;
      }
    },
    {
      title: 'Bảo mẫu',
      key: 'shuttler',
      width: 200,
      className: 'min-width-200',
      render: (record) => {
        const obj = {
          children: record?.nanny?.fullName || '',
          props: {
            colSpan: (record?.status === 'NO_GET_IN_BUS' || record?.status === 'NO_BUS_ROUTE') ? 0 : 1
          }
        };
        return obj;
      }
    },
  ];

  const handleSearch = _.debounce((value) => {
    if (value) {
      return setSearch((prevSearch) => ({
        ...prevSearch,
        rangeTime: value,
      }));
    }
    return setSearch((prevSearch) => ({
      ...prevSearch,
      rangeTime: [
        moment().clone().startOf('week').format(variables.DATE_FORMAT.DATE_AFTER),
        moment().clone().endOf('week').format(variables.DATE_FORMAT.DATE_AFTER)
      ]
    }));
  }, 300);

  const changeTab = (tab) => {
    setTab(tab);
  };

  return (
    <div className={styles['container-bus']}>
      <Tabs onChange={changeTab} activeKey={tab}>
        {variablesModules.TABS_BUS.map(({ id, name }) => (
          <TabPane tab={name} key={id} />
        ))}
      </Tabs>
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
        dataSource={bus}
        loading={loading['studentHomePage/GET_DATA_BUS']}
        pagination={false}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={() => uuidv4()}
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
