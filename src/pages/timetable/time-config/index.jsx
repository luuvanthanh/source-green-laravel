import React, { useState, useEffect, memo } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import ability from '@/utils/ability';
import { useHistory, useLocation, useParams } from 'umi';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';

const Index = memo(() => {
  const [form] = Form.useForm();
  const { pathname, query } = useLocation();
  const dispatch = useDispatch();
  const { params } = useParams();
  const history = useHistory();

  const [
    { data, pagination },
    loading,
  ] = useSelector(({ loading: { effects }, timeTablesConfig }) => [timeTablesConfig, effects]);

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
  });

  const onLoad = () => {
    dispatch({
      type: 'timeTablesConfig/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  useEffect(() => {
    onLoad();
  }, [search]);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev.search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev.search,
      page,
      limit,
    }));
  };

  const paginationFunction = (pagination) =>
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });

  const onRemove = (id) => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'timeTablesConfig/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) onLoad();
          },
        });
      },
    });
  };

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'index',
        className: 'min-width-70',
        width: 70,
        align: 'center',
        render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Năm học',
        key: 'year',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{`${record.fromYear} - ${record.toYear}`}</Text>,
      },
      {
        title: 'Thời gian học từ',
        key: 'fromDate',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.fromTime}</Text>,
      },
      {
        title: 'Thời gian học đến',
        key: 'toDate',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.toTime}</Text>,
      },
      {
        title: 'Số phút một tiết học',
        key: 'periodDuration',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.periodDuration}</Text>,
      },
      {
        title: 'Ngày áp dụng',
        key: 'fromDate',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">{Helper.getDate(record.fromDate, variables.DATE_FORMAT.DATE)}</Text>
        ),
      },
      {
        title: 'Ngày kết thúc',
        key: 'toDate',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">{Helper.getDate(record.toDate, variables.DATE_FORMAT.DATE)}</Text>
        ),
      },
      {
        key: 'actions',
        width: 150,
        className: 'min-width-150',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <ul className="list-unstyled list-inline">
            {moment(record.toDate).isAfter() && (
              <li className="list-inline-item">
                <Button
                  color="primary"
                  icon="edit"
                  onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
                />
              </li>
            )}

            <li className="list-inline-item">
              <Button
                color="danger"
                icon="remove"
                className="ml-2"
                onClick={() => onRemove(record.id)}
              />
            </li>
          </ul>
        ),
      },
    ];

    return !ability.can('TKB', 'TKB') ? columns.filter((item) => item.key !== 'actions') : columns;
  };

  return (
    <>
      <Helmet title="Cấu hình thời gian" />
      <div className={classnames(styles['content-form'], styles['content-form-children'], 'pb30')}>
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">Cấu hình thời gian</Text>
          <Button
            color="success"
            icon="plus"
            permission="HSDT"
            onClick={() => history.push(`/thoi-khoa-bieu/cau-hinh-thoi-gian/tao-moi`)}
          >
            Tạo mới
          </Button>
        </div>
        <div className={classnames(styles['block-table'])}>
          <Form
            initialValues={{
              ...search,
            }}
            layout="vertical"
            form={form}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="keyWord"
                  onChange={(event) => onChange(event, 'keyWord')}
                  placeholder="Nhập từ khóa tìm kiếm"
                  type={variables.INPUT_SEARCH}
                />
              </div>
            </div>
          </Form>
          <Table
            columns={header(params)}
            dataSource={data}
            loading={loading['timeTablesConfig/GET_DATA']}
            pagination={paginationFunction(pagination)}
            params={{
              header: header(),
              type: 'table',
            }}
            bordered
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </div>
      </div>
    </>
  );
});

export default Index;
