import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Typography } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import moment from 'moment';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import { variables, Helper } from '@/utils';

const { Paragraph } = Typography;

const Index = memo(() => {

  const dispatch = useDispatch();
  const [{ pagination, error, data }, loading] = useSelector(({ loading: { effects }, physicalHistory }) => [
    physicalHistory,
    effects,
  ]);

  const mounted = useRef(false);
  const history = useHistory();
  const { query, pathname } = useLocation();
  const filterRef = useRef();
  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    key: query?.key,
    from: query?.from || '',
    to: query?.to || '',
  });

  const columns = [
    {
      title: 'Thời gian',
      key: 'creationTime',
      className: 'min-width-200',
      with: 200,
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE_TIME)}
        </Text>
      ),
    },
    {
      title: 'Nguyễn Ngọc Bích',
      key: 'branch',
      className: 'min-width-200',
      with: 200,
      render: (record) => (
        <Text size="normal">{record?.studentMaster?.student?.class?.branch?.name}</Text>
      ),
    },
    {
      title: 'Nội dung',
      key: 'status',
      className: 'min-width-400',
      render: (record) => (
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
          {record.content}
        </Paragraph>
      ),
    },
  ];

  /**
 * Function set pagination
 * @param {integer} page page of pagination
 * @param {integer} size size of pagination
 */
  const changePagination = ({ page, limit }) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      page,
      limit,
    }));
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const paginationTable = (pagination) => Helper.paginationNet({
    pagination,
    query,
    callback: (response) => {
      changePagination(response);
    },
  });

  const changeFilter = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeFilterDate = debounce((values) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      from: values ? values[0].format(variables.DATE_FORMAT.DATE_AFTER) : null,
      to: values ? values[1].format(variables.DATE_FORMAT.DATE_AFTER) : null,
    }));
  }, 300);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({
      type: 'physicalHistory/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  }, [search]);

  return (
    <>
      <Helmet title="Lịch sử" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Lịch sử</Heading>
        </Pane>

        <Pane className="card">
          <Pane className="p20">
            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{
                ...search,
                rangeTime: [
                  search?.from ? moment(search?.from) : null,
                  search?.to ? moment(search?.to) : null,
                ],
                branchId: search.branchId || null,
                classId: search.classId || null,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="key"
                    type={variables.INPUT_SEARCH}
                    onChange={({ target: { value } }) => changeFilter('key', value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="rangeTime"
                    type={variables.RANGE_PICKER}
                    onChange={changeFilterDate}
                  />
                </Pane>
              </Pane>
            </Form>

            <Table
              bordered
              columns={columns}
              dataSource={data}
              loading={loading['physicalHistory/GET_DATA']}
              isError={error.isError}
              pagination={paginationTable(pagination)}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
