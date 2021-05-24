import { memo, useEffect, useState } from 'react';
import { Form, Typography, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import moment from 'moment';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';

import styles from '../index.scss';
import variablesModules  from '../variables';

const { Paragraph } = Typography;
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
      moment().clone().startOf('month').format(variables.DATE_FORMAT.DATE_AFTER),
      moment().clone().endOf('month').format(variables.DATE_FORMAT.DATE_AFTER)
    ]
  });

  const fetchDataBus = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_BUS',
      payload: {
        id: studentId,
        from:  Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[0],
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }),
        to:  Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[1],
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }),
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
  const header = () => {
    return [
      {
        title: 'Thời gian',
        key: 'time',
        align: 'center',
        className: 'min-width-100',
        render: (record) => Helper.getDate(record?.creationTime, variables.DATE_FORMAT.DATE_MONTH)
      },
      {
        title: 'Lên xe',
        key: 'getOnBus',
        align: 'center',
        className: 'min-width-100',
        render: (record) => Helper.getDate(
          record[`${tab === variablesModules.TABS_BUS[0].id ? 'homewardGetIn' : 'schoolwardGetOff'}`],
          variables.DATE_FORMAT.TIME_FULL
        )
      },
      {
        title: 'Xuống xe',
        key: 'getOffBus',
        align: 'center',
        className: 'min-width-100',
        render: (record) => Helper.getDate(
          record[`${tab === variablesModules.TABS_BUS[0] ? 'schoolwardGetIn' : 'homewardGetOff'}`],
          variables.DATE_FORMAT.TIME_FULL
        )
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
  };

  const handleSearch = _.debounce((value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      rangeTime: value,
    }));
  }, 300);

  const changeTab = (tab) => {
    setTab(tab);
  }

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
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </div>
  );
});

export default Index;
