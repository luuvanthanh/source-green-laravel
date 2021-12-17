import { memo, useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { Helmet } from 'react-helmet';
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
  const {
    colorTags,
    loading,
  } = useSelector(({ loading, crmChatbotKeywordScript }) => ({
    loading,
    colorTags: crmChatbotKeywordScript.colorTags,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const [formRef] = Form.useForm();
  const [remove, setRemove] = useState([]);

  const [data, setData] = useState([
    {
      id: uuidv4(),
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
      type: 'crmChatbotKeywordScript/ADD',
      payload,
      callback: (response, error) => {
        if (error) {
          if (error?.errors && !isEmpty(error?.errors)) {
            error?.errors.forEach((item) => {
              formRef.setFields([
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
      type: 'crmChatbotKeywordScript/GET_TAGS',
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

  const columns = [
    {
      title: 'Bot trả lời',
      dataIndex: 'name',
      key: 'name',
      lassName: 'min-width-250',
      render: (value, record) => (
        <Select
          defaultValue={value}
          color={record.color_code}
          className='w-100'
          data={colorTags}
          mode="multiple"
        >
          {
            colorTags.map((item, index) =>
              <Option value={item.name} key={index}>{item.name}</Option>
            )
          }
        </Select>
      ),
    },
    {
      title: 'Bot trả lời',
      dataIndex: 'name',
      key: 'conversion_unit',
      lassName: 'min-width-250',
      render: (value, record) => (
        <Select
          defaultValue={value}
          color={record.color_code}
          className='w-100'
          data={colorTags}
        >
          {
            colorTags.map((item, index) =>
              <Option value="jack" key={index}>{item.name}</Option>
            )
          }
        </Select>
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
              setData(data.filter((val) => (val.key || val.id || val.test) !== (record.key || record.id || record.test)));
              setRemove([...remove, record.id]);
            }}
            type="button"
            color="danger" icon="remove"
          />

        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet title="Kịch bản từ khóa " />
      <Pane className="pl20 pr20 mt20">
        <Form ref={formRef} onFinish={onFinish} initialValues={{}} layout="vertical">
          <Loading
            loading={loading['crmChatbotKeywordScript/GET_DATA'] || loading['crmChatbotKeywordScript/GET_UNITS']}
          >
            <Pane className="row">
              <Pane className="offset-lg-12 col-lg-12">
                <Pane
                  className={classnames(
                    'd-flex justify-content-between align-items-center mb20',
                    styles['heading-container'],
                  )}
                >
                  <Text color="dark">Kịch bản từ khóa</Text>
                </Pane>
                <Pane className="card">
                  <Pane >
                    <Pane className={classnames('vertical', styles['table-vertical'])}>
                      <div className={stylesModule['wrapper-table']}>
                        <TableCus
                          rowKey={(record) => record.id}
                          className="table-edit"
                          bordered
                          columns={columns}
                          dataSource={colorTags}
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
                      </div>
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="d-flex align-items-center justify-content-end mb20">
                  <p
                    className="btn-delete mr10"
                    role="presentation"
                    onClick={() => setData(data.filter((val) => (val.key || val.id)))}
                  >
                    Hủy thay đổi
                  </p>
                  <Button
                    loading={
                      loading['crmChatbotKeywordScript/ADD']
                    }
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
