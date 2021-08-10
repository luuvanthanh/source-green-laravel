import { memo, useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs, Typography } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useLocation, useHistory } from 'umi';
import csx from 'classnames';
import moment from 'moment';
import { debounce, isEmpty } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '@/assets/styles/Common/common.scss';
import { Helper, variables } from '@/utils';
import variablesModules from '../utils/variables';

import RouteModal from './route';

const { Paragraph } = Typography;
const { TabPane } = Tabs;

const Index = memo(() => {
  const [
    loadingReducer,
    paginationReducer,
    busHistory,
    data,
  ] = useSelector(({ loading, busHistory = {} }) => [
    loading,
    busHistory?.pagination,
    busHistory?.busRoutes,
    busHistory?.data,
  ]);
  const loading = loadingReducer?.effects['busHistory/GET_DATA'];

  const history = useHistory();
  const { query, pathname } = useLocation();
  const dispatch = useDispatch();

  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const filterRef = useRef();

  const [visibleRoute, setVisibleRoute] = useState(false);
  const [route, setRoute] = useState({});
  const [search, setSearch] = useState({
    id: query?.id,
    date: query?.date || moment(),
    status: query?.status || variablesModules.STATUS_TABS.SCHOOLWARD,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const showRoute = (record) => {
    mountedSet(setVisibleRoute, true);
    mountedSet(setRoute, record);
  };

  const hiddenRoute = () => {
    mountedSet(setVisibleRoute, false);
    mountedSet(setRoute, {});
  };

  const header = () => [
    {
      title: 'STT',
      key: 'index',
      className: 'min-width-60',
      width: 60,
      align: 'center',
      render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
    },
    {
      title: 'Trẻ',
      key: 'student',
      width: 200,
      className: 'min-width-200',
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record?.student?.fileImage)}
          fullName={record?.student?.fullName}
        />
      ),
    },
    {
      title: 'Địa điểm',
      key: 'location',
      width: 200,
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record?.busPlace?.address}</Text>,
    },
    {
      title: 'Lên xe',
      key: 'start',
      width: 120,
      className: 'min-width-120',
      render: (record) => {
        const { absentStudents } = record?.student;
        const absent = !isEmpty(absentStudents)
          ? absentStudents.find(
              (item) =>
                Helper.getDate(item.startDate, variables.DATE_FORMAT.DATE_AFTER) === query?.date,
            )
          : {};
        if (absent?.id) {
          return <Text size="normal">Đã xin nghỉ phép</Text>;
        }
        if (search.status === variablesModules.STATUS_TABS.HOMEAWARD) {
          return (
            <Text size="normal">
              {Helper.getDate(record.busPlaceLog?.homewardGetIn, variables.DATE_FORMAT.TIME_FULL)}
            </Text>
          );
        }
        return (
          <Text size="normal">
            {Helper.getDate(record.busPlaceLog?.schoolwardGetIn, variables.DATE_FORMAT.TIME_FULL)}
          </Text>
        );
      },
    },
    {
      title: 'Xuống xe',
      key: 'end',
      width: 120,
      className: 'min-width-120',
      render: (record) => {
        const { absentStudents } = record?.student;
        const absent = !isEmpty(absentStudents)
          ? absentStudents.find(
              (item) =>
                Helper.getDate(item.startDate, variables.DATE_FORMAT.DATE_AFTER) === query?.date,
            )
          : {};
        if (absent?.id) {
          return <Text size="normal">Đã xin nghỉ phép</Text>;
        }
        if (search.status === variablesModules.STATUS_TABS.HOMEAWARD) {
          return (
            <Text size="normal">
              {Helper.getDate(record.busPlaceLog?.homewardGetOff, variables.DATE_FORMAT.TIME_FULL)}
            </Text>
          );
        }
        return (
          <Text size="normal">
            {Helper.getDate(record.busPlaceLog?.schoolwardGetOff, variables.DATE_FORMAT.TIME_FULL)}
          </Text>
        );
      },
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
    {
      key: 'action',
      className: 'min-width-130',
      width: 130,
      align: 'center',
      fixed: 'right',
      render: (record) => (
        <div className={styles['list-button']}>
          <Button color="success" ghost onClick={() => showRoute(record)}>
            Xem lộ trình
          </Button>
        </div>
      ),
    },
  ];

  const pagination = useMemo(
    () => ({
      size: 'default',
      total: paginationReducer?.total || 0,
      pageSize: variables.PAGINATION.PAGE_SIZE,
      defaultCurrent: Number(search.page),
      current: Number(search.page),
      hideOnSinglePage: (paginationReducer?.total || 0) <= 10,
      showSizeChanger: false,
      pageSizeOptions: false,
      onChange: (page, limit) => {
        setSearch((prev) => ({
          ...prev,
          page,
          limit,
        }));
        // callback
      },
    }),
    [paginationReducer],
  );

  const loadData = useCallback(() => {
    dispatch({
      type: 'busHistory/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        date: search.date && Helper.getDate(search.date, variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  }, [search]);

  const formUpdate = (value, values) => {
    if (values.id && values.date) {
      mountedSet(setSearch, { ...search, ...values });
    }
  };

  useEffect(() => {
    dispatch({
      type: 'busHistory/GET_BUS_ROUTES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const debouncedSearchStatus = debounce((value) => {
    mountedSet(setSearch, {
      ...search,
      status: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    });
  }, 300);

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  const onChangeSelectStatus = (e) => {
    debouncedSearchStatus(e);
  };

  return (
    <>
      <Helmet title="Lịch sử điểm danh" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Lịch sử điểm danh</Heading>
        </Pane>

        <Pane className="card">
          <Pane className={csx(styles['block-table'], styles['block-table-tab'])}>
            <Tabs
              defaultActiveKey={search?.status || variablesModules.STATUS_TABS.SCHOOLWARD}
              onChange={onChangeSelectStatus}
            >
              {variablesModules.TABS.map(({ id, name }) => (
                <TabPane tab={name} key={id} />
              ))}
            </Tabs>

            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{ ...search, date: search.date && moment(search.date) }}
              onValuesChange={formUpdate}
            >
              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    name="id"
                    type={variables.SELECT}
                    data={busHistory.map((item) => ({
                      id: item?.busRoute?.id,
                      name: item?.busRoute?.name,
                    }))}
                    placeholder="Chọn lộ trình"
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem name="date" type={variables.DATE_PICKER} />
                </Pane>
              </Pane>
            </Form>

            <Table
              columns={header()}
              dataSource={data}
              loading={loading}
              pagination={pagination}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
              className="table-edit"
              isEmpty
            />
          </Pane>
        </Pane>
      </Pane>
      {visibleRoute && (
        <RouteModal
          {...search}
          visible={visibleRoute}
          route={route}
          routes={data}
          onCancel={hiddenRoute}
        />
      )}
    </>
  );
});

export default Index;
