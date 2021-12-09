import { memo, useState, useRef, useEffect } from 'react';
import { Form, Input } from 'antd';
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


const Index = memo(() => {
  const {
    loading,
  } = useSelector(({ loading, childDevelopReviewQuestion }) => ({
    loading,
    colorTags: childDevelopReviewQuestion.colorTags,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const formRef = useRef();
  const [remove, setRemove] = useState([]);

  const [data, setData] = useState([
    {
      id: "",
      question: "",
    },
  ]);

  const onFinish = () => {
    const items = data.map((item) => ({
      ...item,
      question: item.question,
    }));
    const payload = {
      create_rows: items.filter((item) => !item.id),
      update_rows: items.filter((item) => item.id),
      delete_rows: remove,
    };
    dispatch({
      type: 'childDevelopReviewQuestion/ADD',
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
      type: 'childDevelopReviewQuestion/GET_TAGS',
      payload: {},
      callback: (response) => {
        if (response && response.parsePayload.length > 0) {
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
      prev.map((item) => (
        item.test === record.test && item.id === record.id ? { ...item, question: e.target.value } : { ...item }
      ),
      ));
  };

  const columns = [
    {
      title: 'Danh sách câu hỏi',
      key: 'question',
      lassName: 'min-width-100',
      render: (value, record) => (
        <Input.TextArea
          value={value.question}
          autoSize={{ minRows: 1, maxRows: 1 }}
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
      <Pane className="pl20 pr20 mt20">
        <Form ref={formRef} onFinish={onFinish} initialValues={{}} layout="vertical">
          {/* <Loading
            loading={loading['childDevelopReviewQuestion/GET_DATA'] || loading['childDevelopReviewQuestion/GET_UNITS']}
          > */}
          <Pane className="row">
            <Pane className="offset-lg-12 col-lg-12">
              <Pane
                className={classnames(
                  'd-flex justify-content-between align-items-center mb20',
                  styles['heading-container'],
                )}
              >
                <Text color="dark">Câu hỏi đánh giá cho phụ huynh</Text>
              </Pane>
              <Pane className="card">
                <Pane >
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
                <p
                  className="btn-delete mr10"
                  role="presentation"
                  onClick={() => setData(data.filter((val) => (val.key || val.id)))}
                >
                  Hủy thay đổi
                </p>
                <Button
                  loading={
                    loading['childDevelopReviewQuestion/ADD']
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
          {/* </Loading> */}
        </Form>
      </Pane>
    </>
  );
});

export default Index;
