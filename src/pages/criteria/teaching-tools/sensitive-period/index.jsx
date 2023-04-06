import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import classnames from 'classnames';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import Text from '@/components/CommonComponent/Text';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [
    { pagination, error, data },
    loading,
  ] = useSelector(({ loading: { effects }, sensitivePeriod }) => [sensitivePeriod, effects]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const filterRef = useRef();
  const mounted = useRef(false);

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
  });

  const header = () => {
    const columns = [
      {
        title: 'Mã ID',
        key: 'id',
        className: 'min-width-70',
        render: (record) => record.code,
      },
      {
        title: 'Tên thời kỳ nhạy cảm',
        key: 'name',
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record.name} </Text>,
      },
      {
        title: 'Ghi chú',
        key: 'description',
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record.note} </Text>,
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              ghost
              permission={`${FLATFORM.WEB}${permissions.CTH_HOCTAPGIAOCU_TKNC}${ACTION.EDIT}`}
              onClick={() => history.push(`${pathname}/${record?.id}/chi-tiet`)}
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };

  useEffect(() => {
    dispatch({
      type: 'sensitivePeriod/GET_DATA',
      payload: { ...search },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
  }, [search]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev,
      page,
      limit,
    }));
  };

  const paginations = (pagination) =>
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });

  return (
    <>
      <Helmet title="Thời kỳ nhạy cảm" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Thời kỳ nhạy cảm</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
            permission={`${FLATFORM.WEB}${permissions.CTH_HOCTAPGIAOCU_TKNC}${ACTION.CREATE}`}
            onClick={() => history.push(`${pathname}/them-moi`)}
          >
            Tạo mới
          </Button>
        </Pane>

        <Pane className={classnames(styles['block-table'])}>
          <Form
            layout="vertical"
            ref={filterRef}
            initialValues={{
              ...search,
            }}
          >
            <Pane className="row">
              <Pane className="col-lg-3">
                <FormItem
                  type={variables.INPUT_SEARCH}
                  name="keyWord"
                  onChange={({ target: { value } }) => changeFilter('keyWord')(value)}
                  placeholder="Nhập tên thời kỳ nhạy cảm để tìm kiếm"
                />
              </Pane>
            </Pane>
          </Form>

          <Table
            columns={header()}
            dataSource={data}
            pagination={paginations(pagination)}
            loading={loading['sensitivePeriod/GET_DATA']}
            isError={error.isError}
            params={{
              header: header(),
              type: 'table',
            }}
            bordered
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
