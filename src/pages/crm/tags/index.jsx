import { memo, useState, useRef, useEffect } from 'react';
import { Form, Select, Tag, Input } from 'antd';
import classnames from 'classnames';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import TableCus from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import styles from '@/assets/styles/Common/common.scss';
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Loading from '@/components/CommonComponent/Loading';
import stylesModule from './styles.module.scss';

const { Option } = Select;

const Index = memo(() => {
  const { colorTags, loading } = useSelector(({ loading, crmTags }) => ({
    loading,
    colorTags: crmTags.colorTags,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const formRef = useRef();
  const [remove, setRemove] = useState([]);

  const [data, setData] = useState([
    {
      name: undefined,
      color_code: undefined,
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
      type: 'crmTags/ADD',
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
      type: 'crmTags/GET_TAGS',
      payload: {},
      callback: (response) => {
        if (response?.parsePayload?.length > 0 ) {
          setData(
            response.parsePayload.map((item) => ({
              ...item,
            })),
          );
        }
      },
    });
  }, [params.id]);

  const onSelectColor = (productId, record) => {
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        color_code: item.test
          ? `${item.test === record.test ? productId : item.color_code} `
          : `${item.id === record.id ? productId : item.color_code}`,
      })),
    );
  };

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
      title: 'Màu',
      key: 'color_code',
      dataIndex: 'color_code',
      lassName: 'min-width-250',
      render: (code, record) => {
        const color = record.color_code;
        return (
          <Select
            className="w-100"
            style={{ color: `${color}` }}
            defaultValue={record.color_code}
            onChange={(val) => onSelectColor(val, record)}
          >
            {colorTags.map((item) => (
              <Option
                value={item?.name || ''}
                key={item.name}
                style={{ backgroundColor: `${item.name}` }}
              >
                {item?.name || ''}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Tên tags',
      key: 'name',
      lassName: 'min-width-100',
      render: (value, record) => (
        <Input.TextArea
          value={value.name}
          autoSize={{ minRows: 1, maxRows: 1 }}
          placeholder="Nhập"
          onChange={(e) => onChangeTitle(e, record)}
        />
      ),
    },
    {
      title: 'Hiển thị',
      dataIndex: 'conversion_unit',
      key: 'conversion_unit',
      lassName: 'min-width-250',
      className: stylesModule['tag-color'],
      render: (value, record) => (
        <div className={stylesModule['tag-color']}>
          <Tag
            defaultValue={value}
            className="w-auto"
            color={record.color_code}
            style={{
              color: 'black',
              fontSize: '14px',
              alignItems: 'center',
              display: 'inline-block',
              width: '50px',
            }}
          >
            {record.name}
          </Tag>
        </div>
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
      <Pane className="pl20 pr20 mt20">
        <Form ref={formRef} onFinish={onFinish} initialValues={{}} layout="vertical">
          <Loading loading={loading['crmTags/GET_DATA'] || loading['crmTags/GET_UNITS']}>
            <Pane className="row">
              <Pane className="offset-lg-12 col-lg-12">
                <Pane
                  className={classnames(
                    'd-flex justify-content-between align-items-center mb20',
                    styles['heading-container'],
                  )}
                >
                  <Text color="dark">Tags</Text>
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
                            Thêm tag
                          </Button>
                        )}
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="d-flex align-items-center justify-content-end mb20">
                  <p
                    className="btn-delete mr10"
                    role="presentation"
                    onClick={() => setData(data.filter((val) => val.key || val.id))}
                  >
                    Hủy thay đổi
                  </p>
                  <Button
                    loading={loading['crmTags/ADD']}
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
