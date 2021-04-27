import { memo, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector } from 'dva';
import moment from 'moment';
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
  const [{ pagination, error, data }, loading] = useSelector(({ loading: { effects }, feePolicyTarget }) => [
    feePolicyTarget,
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
      title: 'Mã nhóm',
      key: 'id',
      className: 'min-width-70',
      align: 'center',
      render: (text, record, index) => <Text size="normal">HSC</Text>,
    },
    {
      title: 'Tên nhóm',
      key: 'name',
      className: 'min-width-200',
      render: (text, record, index) => <Text size="normal">Học sinh cũ</Text>,
    },
    {
      title: 'Mô tả',
      key: 'description',
      className: 'min-width-300',
      render: (record) => <Text size="normal">Là học sinh đóng đầy đủ học phí trước ngày 01/08/21</Text>,
    },
    {
      title: 'Tri ân',
      key: 'grateful',
      className: 'min-width-70',
      align: 'center',
      render: (record) => <Checkbox defaultChecked />,
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
            onClick={() => history.push(`/chinh-sach-phi/nhom-doi-tuong/${record?.id}/chi-tiet`)}
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
      <Helmet title="Nhóm đối tượng" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Nhóm đối tượng</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
            onClick={() => history.push(`/chinh-sach-phi/nhom-doi-tuong/tao-moi`)}
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
                rangeTime: [
                  search?.sentDateFrom ? moment(search?.sentDateFrom) : null,
                  search?.sentDateTo ? moment(search?.sentDateTo) : null,
                ],
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="description"
                    type={variables.INPUT_SEARCH}
                    onChange={({ target: { value } }) => changeFilter('description')(value)}
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
