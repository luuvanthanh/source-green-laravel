import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useHistory, useLocation } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { debounce } from 'lodash';
import classnames from 'classnames';

import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import Text from '@/components/CommonComponent/Text';
import { Helmet } from 'react-helmet';

import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';
import Table from '@/components/CommonComponent/Table';
import { Helper } from '@/utils';
import variablesModules from './utils/variables';

const General = memo(() => {
  const mounted = useRef(false);
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { query, pathname } = useLocation();
  const [
    { data, pagination },
    loading,
  ] = useSelector(({ loading: { effects }, HRMDecisionDenominator, }) => [
    HRMDecisionDenominator,
    effects,
    HRMDecisionDenominator.data,
  ]);

  const [search, setSearch] = useState({
    key: query?.key,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const loadingData = loading['HRMDecisionDenominatorAdd/GET_DATA'];

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const history = useHistory();

  const onLoad = () => {
    dispatch({
      type: 'HRMDecisionDenominator/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
  };

  useEffect(() => {
    onLoad();
  }, [search]);

  const debouncedSearch = debounce((value, type) => {
    setSearch({
      ...search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    });
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const onRemove = (id) => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'HRMDecisionDenominator/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              onLoad();
            }
          },
        });
      },
    });
  };

  const header = () => {
    const columns = [
      {
        title: 'Thời gian tạo',
        key: 'date',
        className: 'min-width-150',
        width: 150,
        render: (value) => Helper.getDate(value?.creationTime, variables.DATE_FORMAT.DATE_TIME),
      },
      {
        title: 'Loại hợp đồng',
        key: 'code',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal"> {variablesModules?.STATUS[record?.type]}</Text>,
      },
      {
        title: 'Mẫu số hợp đồng',
        key: 'code',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record.numberForm}</Text>,
      },
      {
        title: 'Số hiện tại',
        key: 'code',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record.ordinalNumber}</Text>,
      },
      {
        title: 'Ngày hiệu lực',
        key: 'name',
        className: 'min-width-250',
        width: 250,
        render: (record) => <Text size="normal">{Helper.getDate(record?.startDate, variables.DATE_FORMAT.DATE)} - {Helper.getDate(record?.endDate, variables.DATE_FORMAT.DATE)}</Text>,
      },
      {
        key: 'action',
        width: 125,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
            <Button color="danger" icon="remove" onClick={() => onRemove(record.id)} />
          </div>
        ),
      },
    ];
    return columns;
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev,
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
    });;

  return (
    <>
      <Helmet title="Khai báo mẫu số quyết định" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark" className={styles['title-header']}>
            Khai báo mẫu số quyết định
          </Text>
          <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
            Tạo mới
          </Button>
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="key"
                  onChange={(event) => onChange(event, 'key')}
                  type={variables.INPUT_SEARCH}
                  placeholder="Nhập Tên học sinh để tìm kiếm"
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Chọn tất cả' }, ...variablesModules?.DATA_TYPE]}
                  name="type"
                  onChange={(event) => onChangeSelect(event, 'type')}
                  type={variables.SELECT}
                  placeholder="Chọn loại quyết định"
                  allowClear={false}
                />
              </div>
            </div>
          </Form>
          <Table
            columns={header()}
            dataSource={data}
            loading={loadingData}
            pagination={paginationFunction(pagination)}
            isEmpty
            params={{
              header: header(),
              type: 'table',
            }}
            bordered={false}
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </div>
      </div>
    </>
  );
},
);

export default General;
