import { memo, useMemo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Image } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [
    { pagination, error, data },
    loading,
  ] = useSelector(({ loading: { effects }, criteriaTool }) => [criteriaTool, effects]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const filterRef = useRef();
  const mounted = useRef(false);

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
  });

  const columns = [
    {
      title: 'Mã ID',
      key: 'id',
      className: 'min-width-70',
      render: (text, record, index) =>
        `GC${Helper.serialOrder(search?.page, index, search?.limit)}`,
    },
    {
      title: 'Hình ảnh',
      key: 'image',
      className: 'min-width-100',
      width: 170,
      render: (record) => (
        <div className="d-flex align-items-center">
          <Image.PreviewGroup>
            <div className="group-image">
              <Image
                width={50}
                height={50}
                src={`${API_UPLOAD}${record?.fileUrl}`}
                fallback="/default-upload.png"
              />
            </div>
          </Image.PreviewGroup>
        </div>
      ),
    },
    {
      title: 'Giáo cụ',
      key: 'name',
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.name} </Text>,
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
            onClick={() => history.push(`${pathname}/${record?.id}/chi-tiet`)}
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

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };

  useEffect(() => {
    dispatch({
      type: 'criteriaTool/GET_DATA',
      payload: { ...search },
    });
  }, [search]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

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
            onClick={() => history.push(`${pathname}/them-moi`)}
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
                    name="keyWord"
                    onChange={({ target: { value } }) => changeFilter('keyWord')(value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
              </Pane>
            </Form>

            <Table
              columns={columns}
              dataSource={data}
              loading={loading['criteriaTool/GET_DATA']}
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
