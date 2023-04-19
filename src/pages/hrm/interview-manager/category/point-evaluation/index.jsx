import { memo, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Helmet } from 'react-helmet';
import FormItem from '@/components/CommonComponent/FormItem';
import { Form } from 'antd';
import Button from '@/components/CommonComponent/Button';
import { useSelector, useDispatch } from 'dva';
import Loading from '@/components/CommonComponent/Loading';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';
import { size, get } from 'lodash';
import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils/variables';
import stylesModule from './styles.module.scss';

const Index = memo(() => {
  const {
    loading: { effects },
    error,
  } = useSelector(({ menu, loading, hrmInterviewManagerCategoryPointEvaluation }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    error: hrmInterviewManagerCategoryPointEvaluation.error,
  }));
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [remove, setRemove] = useState([]);
  const mounted = useRef(false);
  const [checkEdit, setCheckEdit] = useState(true);
  const [data, setData] = useState([
    {
      pointFrom: undefined,
      pointTo: true,
      classification: undefined,
      id: uuidv4(),
    },
  ]);

  const loadData = () => {
    dispatch({
      type: 'hrmInterviewManagerCategoryPointEvaluation/GET_DATA',
      payload: {},
      callback: (response) => {
        if (response) {
          setData(response);
          setCheckEdit(true);
        }
      },
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadingSubmit = effects[`hrmInterviewManagerCategoryPointEvaluation/ADD`];

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onFinish = () => {
    dispatch({
      type: 'hrmInterviewManagerCategoryPointEvaluation/ADD',
      payload: {
        data: data?.map((i) => ({
          pointFrom: i?.pointFrom,
          pointTo: i?.pointTo,
          classification: i?.classification,
        })),
      },
      callback: (response, error) => {
        if (response) {
          loadData();
        }
        if (error) {
          const { data } = error;
          if (data?.status === 400 && !!size(data?.errors)) {
            data?.errors.forEach((item) => {
              form?.setFields([
                {
                  name: get(item, 'source.pointer'),
                  errors: [get(item, 'detail')],
                },
              ]);
            });
          }
        }
      },
    });
  };

  const onChange = (e, record, key) => {
    if (key === 'classification') {
      setData((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, [key]: e.target.value } : { ...item },
        ),
      );
    } else {
      setData((prev) =>
        prev.map((item) => (item.id === record.id ? { ...item, [key]: e } : { ...item })),
      );
    }
  };

  const header = () => {
    const columns = [
      {
        title: 'Khoảng điểm từ',
        key: 'pointFrom',
        className: 'min-width-150',
        render: (record) => (
          <FormItem
            className={stylesModule.item}
            value={record?.pointFrom || ''}
            type={variables.NUMBER_INPUT}
            disabled={checkEdit}
            rules={[variables.RULES.EMPTY]}
            onChange={(e) => onChange(e, record, 'pointFrom')}
          />
        ),
      },
      {
        title: 'Khoảng điểm đến',
        key: 'pointTo',
        className: 'min-width-150',
        render: (record) => (
          <FormItem
            className={stylesModule.item}
            value={record?.pointTo || ''}
            type={variables.NUMBER_INPUT}
            rules={[variables.RULES.EMPTY]}
            disabled={checkEdit}
            onChange={(e) => onChange(e, record, 'pointTo')}
          />
        ),
      },
      {
        title: 'Xếp loại',
        key: 'classification',
        className: 'min-width-200',
        render: (record) => (
          <FormItem
            className={stylesModule.item}
            value={record?.classification}
            type={variables.INPUT}
            disabled={checkEdit}
            rules={[variables.RULES.EMPTY_INPUT]}
            onChange={(e) => onChange(e, record, 'classification')}
          />
        ),
      },
      ...(!checkEdit
        ? [
            {
              key: 'action',
              width: 120,
              fixed: 'right',
              render: (record) => (
                <div className={styles['list-button']}>
                  <Button color="primary" icon="edit" />
                  <Button
                    onClick={() => {
                      setData(
                        data.filter(
                          (val) =>
                            (val.key || val.id || val.test) !==
                            (record.key || record.id || record.test),
                        ),
                      );
                      setRemove([...remove, record.id]);
                    }}
                    type="button"
                    color="danger"
                    icon="remove"
                    className={stylesModule.remove}
                  />
                </div>
              ),
            },
          ]
        : []),
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Điểm đánh giá" />
      <div className="col-lg-6 offset-lg-3 mt20">
        <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
          <Loading
            isError={error.isError}
            params={{ type: 'container' }}
            loading={effects['hrmInterviewManagerCategoryPointEvaluation/GET_DATA']}
          >
            <Heading type="form-title" className="mb15">
              Điểm đánh giá
            </Heading>
            <div className={stylesModule['wrapper-table']}>
              <Table
                columns={header()}
                dataSource={data}
                pagination={false}
                className="table-edit"
                isEmpty
                params={{
                  header: header(),
                  type: 'table',
                }}
                bordered={false}
                rowKey={(record) => record.id}
                scroll={{ x: '100%' }}
                footer={(item, index) => (
                  <>
                    {!checkEdit && (
                      <Button
                        key={index}
                        onClick={() =>
                          setData([
                            ...data,
                            {
                              id: uuidv4(),
                              pointFrom: undefined,
                              pointTo: undefined,
                              classification: undefined,
                            },
                          ])
                        }
                        color="transparent-success"
                        icon="plus"
                      >
                        Thêm dòng
                      </Button>
                    )}
                  </>
                )}
              />
            </div>
            {!checkEdit ? (
              <div className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                <p className="btn-delete" role="presentation" onClick={() => loadData()}>
                  Hủy
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  size="large"
                  htmlType="submit"
                  loading={loadingSubmit}
                  permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_DIEMDANHGIA}${ACTION.EDIT}`}
                >
                  Lưu
                </Button>
              </div>
            ) : (
              <div className="pt20 pb20 d-flex justify-content-end align-items-center border-top">
                <Button
                  className="ml-auto px25"
                  color="success"
                  size="large"
                  htmlType="submit"
                  loading={loadingSubmit}
                  onClick={() => setCheckEdit(false)}
                  permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_DIEMDANHGIA}${ACTION.EDIT}`}
                >
                  Sửa
                </Button>
              </div>
            )}
          </Loading>
        </Form>
      </div>
    </>
  );
});

export default Index;
