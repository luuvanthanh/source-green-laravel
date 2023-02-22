import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Radio } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const [details, setDetails] = useState(undefined);
  const [type, setType] = useState('CRITERIA');
  const {
    loading: { effects },
    menuLeftCriteria,
  } = useSelector(({ menu, loading, subjectCommentAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: subjectCommentAdd.details,
    error: subjectCommentAdd.error,
  }));

  const loadingSubmit = effects[`subjectCommentAdd/UPDATE`] || effects[`subjectCommentAdd/ADD`];

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'subjectCommentAdd/UPDATE' : 'subjectCommentAdd/ADD',
      payload: {
        id: params.id,
        name: values?.name,
        content: {
          type,
          items: values?.data
        }
      },
      callback: (response, error) => {
        if (response) {
          if (response) {
            history.push(`/chuong-trinh-hoc/the-chat/mon-danh-gia`);
          }
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.current.setFields([
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

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'subjectCommentAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              name: response?.name,
              code: response?.code,
              data: response?.content?.items
            });
            setDetails(response);
            setType(response?.content?.type);
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? details?.code : 'Tạo mới'} menu={menuLeftCriteria} />
      <Helmet title="Môn đánh giá" />
      <Pane className="pl20 pr20">
        <Pane className="col-lg-6 offset-lg-3">
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Loading
              loading={effects['subjectCommentAdd/GET_DATA']}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <FormItem
                      name="code"
                      placeholder=" "
                      type={variables.INPUT}
                      label="ID"
                      disabled
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="name"
                      type={variables.INPUT}
                      label="Môn đánh giá"
                      rules={[variables.RULES.EMPTY_INPUT]}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Tiêu chí đánh giá
                </Heading>

                <Radio.Group
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                  className="pb20"
                >
                  <Radio value='CRITERIA'>Chọn tiêu chí</Radio>
                  <Radio value='INFORMATION'>Nhập thông tin</Radio>
                </Radio.Group>
                {
                  type === 'CRITERIA' && (
                    <Pane >
                      <div className={stylesModule['wrapper-table']}>
                        <div className={stylesModule['card-heading']}>
                          <div className={stylesModule.col}>
                            <p className={stylesModule.norm}>Nội dung</p>
                          </div>
                          <div className={stylesModule.cols}>
                            <p className={stylesModule.norm} />
                          </div>
                        </div>
                        <Form.List name="data">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((fieldItem, index) => (
                                <Pane
                                  key={index}
                                  className="d-flex"
                                >
                                  <div className={stylesModule['card-item']}>
                                    <div className={classnames(stylesModule.col)}>
                                      <FormItem
                                        className={stylesModule.item}
                                        fieldKey={fieldItem.fieldKey}
                                        name={fieldItem.name}
                                        type={variables.INPUT}
                                        placeholder="Nhập"
                                      />
                                    </div>
                                    <div className={classnames(stylesModule.cols)}>
                                      {fields.length > 1 && (
                                        <div className={styles['list-button']}>
                                          <button
                                            className={styles['button-circle']}
                                            onClick={() => {
                                              remove(index);
                                            }}
                                            type="button"
                                          >
                                            <span className="icon-remove" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Pane>
                              ))}
                              <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer " >
                                <span
                                  onClick={() => add()}
                                  role="presentation"
                                  className={stylesModule.add}
                                >
                                  <span className="icon-plus-circle mr5" />
                                  Thêm
                                </span>
                              </Pane>
                            </>
                          )}
                        </Form.List>
                      </div>
                    </Pane>
                  )
                }
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.push('/chuong-trinh-hoc/the-chat/mon-danh-gia')}
                >
                  Hủy
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                >
                  Lưu
                </Button>
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;