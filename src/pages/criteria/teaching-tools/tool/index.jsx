import { memo, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector } from 'dva';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import { variables } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';


const Index = memo(() => {
  // const dispatch = useDispatch();
  const [{ pagination, error, data }, loading] = useSelector(({ loading: { effects }, feePolicyClass }) => [
    feePolicyClass,
    effects,
  ]);

  const history = useHistory();
  const { query } = useLocation();

  const filterRef = useRef();

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    search: query?.search,
  });

  const columns = [
    {
      title: 'Mã ID',
      key: 'id',
      className: 'min-width-70',
      render: (text, record, index) => <Text size="normal">GC01</Text>,
    },
    {
      title: 'Giáo cụ',
      key: 'name',
      className: 'min-width-200',
      render: (text, record, index) => <Text size="normal">Trò chơi thả khối lăng trụ chữ nhật vào hộp có lỗ </Text>,
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
            onClick={() => history.push(`/chuong-trinh-hoc/cau-hinh/giao-cu/${record?.id}/chi-tiet`)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const paginationProps = useMemo(
    () => ({
      size: 'default',
      total: pagination?.total || 0,
      pageSize: variables.PAGINATION.PAGE_SIZE,
      defaultCurrent: Number(search.page),
      current: Number(search.page),
      hideOnSinglePage: (pagination?.total || 0) <= 10,
      showSizeChanger: false,
      pageSizeOptions: false,
      onChange: (page, limit) => {
        setSearch((prev) => ({
          ...prev,
          page,
          limit,
        }));
      },
    }),
    [pagination],
  );

  const changeFilter = debounce(
    (name) => (value) => {
      setSearch((prevSearch) => ({
        ...prevSearch,
        [name]: value,
      }));
    },
    300,
  );

  return (
    <>
      <Helmet title="Danh sách giáo cụ" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh sách giáo cụ</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
            onClick={() => history.push('/chuong-trinh-hoc/cau-hinh/giao-cu/them-moi')}
          >
            Tạo mới
          </Button>
        </Pane>

        <Pane className="card">
          <Pane className="p20">
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
                    name="search"
                    onChange={({ target: { value } }) => changeFilter('search')(value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
              </Pane>
            </Form>

            <Table
              columns={columns}
              dataSource={data}
              loading={loading['media/GET_DATA']}
              isError={error.isError}
              pagination={paginationProps}
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
