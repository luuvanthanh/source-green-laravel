import { memo, useState, useRef, useEffect } from 'react';
import { Form, Input } from 'antd';
import classnames from 'classnames';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import TableCus from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import { Helmet } from 'react-helmet';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Loading from '@/components/CommonComponent/Loading';
// import stylesModule from './styles.module.scss';


const Index = memo(() => {
  const { loading } = useSelector(({ loading }) => ({
    loading,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const formRef = useRef();
  const [remove, setRemove] = useState([]);

  const [data, setData] = useState([
    {
      id: uuidv4(),
      category: { name: undefined },
      product_id: undefined,
      conversion_unit: undefined,
      conversion_price: undefined,
    },
  ]);

  const onFinish = () => {
    const items = data.map((item) => ({
      ...item,
      tag_id: item.id,
    }));
    const payload = {
      create_rows: items.filter((item) => !item.id),
      update_rows: items.filter((item) => item.id),
      delete_rows: remove,
    };
    dispatch({
      type: 'classConfiguration/ADD',
      payload,
      callback: (response, error) => {
        if (error) {
          if (error?.errors && !isEmpty(error?.errors)) {
            error?.errors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: item?.source?.pointer,
                  errors: [item.detail],
                },
              ]);
            });
          }
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'classConfiguration/GET_TAGS',
      payload: {},
      callback: (response) => {
        if (response) {
          setData(
            response.parsePayload.map((item) => ({
              ...item,
            })),
          );
        }
      },
    });
  }, [params.id]);

  const onChangeTitle = (e, record) => {
    setData((prev) =>
      prev.map((item) =>
        item.test === record.test && item.id === record.id
          ? { ...item, name: e.target.value }
          : { ...item },
      ),
    );
  };

  const columns = [
    {
      title: 'Hình ảnh  ',
      key: 'name',
      width: 100,
      lassName: 'min-width-100',
      render: (value, record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record.file_image)}
        />
      ),
    },
    {
      title: 'Tên',
      key: 'name',
      lassName: 'min-width-300',
      width: 300,
      render: (value, record) => (
        <Input.TextArea
          value={value.name}
          autoSize={{ minRows: 2, maxRows: 3 }}
          placeholder="Nhập"
          onChange={(e) => onChangeTitle(e, record)}
        />
      ),
    },
    {
      title: 'Nội dung',
      key: 'name',
      lassName: 'min-width-100',
      render: (value, record) => (
        <Input.TextArea
          value={value.name}
          autoSize={{ minRows: 2, maxRows: 3 }}
          placeholder="Nhập"
          onChange={(e) => onChangeTitle(e, record)}
        />
      ),
    },
    {
      key: 'action',
      className: 'min-width-100',
      width: 100,
      fixed: 'right',
      render: (record) => (
        <div className={styles['list-button']}>
          <Button
            onClick={() => {
              setData(
                data.filter(
                  (val) =>
                    (val.key || val.id || val.test) !== (record.key || record.id || record.test),
                ),
              );
              setRemove([...remove, record.id]);
            }}
            type="button"
            color="danger"
            icon="remove"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet title="Cấu hình quy trình lớp học" />
      <Pane className="pl20 pr20 mt20">
        <Form ref={formRef} onFinish={onFinish} initialValues={{}} layout="vertical">
          <Loading loading={loading['classConfiguration/GET_DATA'] || loading['classConfiguration/GET_UNITS']}>
            <Pane className="row">
              <Pane className="offset-lg-12 col-lg-12">
                <Pane
                  className={classnames(
                    'd-flex justify-content-between align-items-center mb20',
                    styles['heading-container'],
                  )}
                >
                  <Text color="dark">Cấu hình quy trình lớp học</Text>
                </Pane>
                <Pane className="card">
                  <Pane>
                    <Pane className={classnames('vertical', styles['table-vertical'])}>
                      <TableCus
                        rowKey={(record) => record.id}
                        className="table-edit"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        scroll={{ x: '100%' }}
                        footer={(item, index) => (
                          <Button
                            key={index}
                            onClick={() =>
                              setData([
                                ...data,
                                {
                                  key: '',
                                  test: uuidv4(),
                                },
                              ])
                            }
                            color="transparent-success"
                            icon="plus"
                          >
                            Thêm
                          </Button>
                        )}
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="d-flex align-items-center justify-content-end mb20">
                  <Button
                    loading={loading['classConfiguration/ADD']}
                    className="px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                  >
                    Lưu
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Loading>
        </Form>
      </Pane>
    </>
  );
});

export default Index;
