import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useLocation, useHistory } from 'umi';
import csx from 'classnames';
import moment from 'moment';
import { debounce } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import FormItem from '@/components/CommonComponent/FormItem';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';
import ability from '@/utils/ability';

import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import styles from '@/assets/styles/Common/common.scss';
import { Helper, variables } from '@/utils';
import HelperModules from '../utils/Helper';

const Index = memo(() => {
  const [
    loadingReducer,
    paginationReducer,
    data,
  ] = useSelector(({ loading, hrmRecruitmentStorage = {} }) => [
    loading,
    hrmRecruitmentStorage?.paginationReducer,
    hrmRecruitmentStorage?.data,
  ]);
  const loading = loadingReducer?.effects['hrmRecruitmentStorage/GET_DATA'];

  const history = useHistory();
  const { query, pathname } = useLocation();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const filterRef = useRef();

  const [search, setSearch] = useState({
    id: query?.id,
    from_date: query?.from_date ? query?.from_date : null,
    to_date: query?.to_date ? query?.to_date : null,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    key: query?.key,
  });

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev.search,
      page,
      limit,
    }));
  };

  const paginationFunction = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  const loadData = useCallback(() => {
    dispatch({
      type: 'hrmRecruitmentStorage/GET_DATA',
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const debouncedSearch = debounce((value, type) => {
    mountedSet(setSearch, {
      ...search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    });
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
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
      title: 'Ngày ứng tuyển',
      key: 'name',
      className: 'min-width-150',
      width: 150,
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record?.creationTime, variables.DATE_FORMAT.DATE)}
        </Text>
      ),
    },
    {
      title: 'Họ và tên',
      key: 'name',
      className: 'min-width-250',
      width: 250,
      render: (record) => <Text size="normal">{record?.name}</Text>,
    },
    {
      title: 'Vị trí ứng tuyển',
      key: 'location',
      className: 'min-width-250',
      width: 150,
      render: (record) => <Text size="normal">{record?.location}</Text>,
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      className: 'min-width-200',
      width: 150,
      render: (record) => <Text size="normal">{record?.phone}</Text>,
    },
    {
      title: 'Bộ phận',
      key: 'division',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">{record.division?.name}</Text>,
    },
    {
      title: 'Level',
      key: 'level',
      className: 'min-width-100',
      width: 100,
      render: (record) => <Text size="normal">{record.level?.name}</Text>,
    },
    {
      title: 'Trạng thái',
      key: 'number',
      className: 'min-width-150',
      width: 150,
      render: (record) => HelperModules.tagStatusRecruimentUser(record?.status),
    },
  ];

  return (
    <>
      <Helmet title="Lưu trữ" />
      <Pane className={csx(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Text color="dark">Lưu trữ</Text>
        </div>
        <Pane className="card">
          <Pane className={csx(styles['block-table'], styles['block-table-tab'])}>
            <Form
              layout="vertical"
              ref={filterRef}
              className="pt20"
              initialValues={{
                ...search,
                date:
                  search.from_date && search.to_date
                    ? [moment(search.from_date), moment(search.to_date)]
                    : ['', ''],
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="key"
                    onChange={(event) => onChange(event, 'key')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </Pane>
              </Pane>
            </Form>
            <div className={styles['wrapper-table-header']}>
              <Table
                columns={header()}
                dataSource={data}
                loading={loading}
                pagination={paginationFunction(paginationReducer)}
                rowKey={(record) => record.id}
                scroll={{ x: '100%', y: '60vh' }}
                className="table-edit"
                params={{
                  header: header(),
                  type: 'table',
                }}
                onRow={(record) => ({
                  onClick: () => {
                    if (
                      ability.can(
                        `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_LUUTRU}${ACTION.DETAIL}`,
                        `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_LUUTRU}${ACTION.DETAIL}`,
                      )
                    ) {
                      history.push(
                        `${pathname}/${record.id}/chi-tiet?id=${record.id}&type=luu-tru`,
                      );
                    }
                  },
                })}
              />
            </div>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
