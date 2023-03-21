import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { Helmet } from 'react-helmet';
import { isEmpty, get } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from '../styles.module.scss';

const General = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [{ menuLeftPhysicalItem }, effects] = useSelector(({ menu, loading: { effects } }) => [menu, effects]);
  const mounted = useRef(false);
  const loadingSubmit = effects['sampleCommentAdd/ADD'] || effects['sampleCommentAdd/UPDATE'];

  const loading = effects['sampleCommentAdd/GET_DATA'];
  const params = useParams();
  const [details, setDetails] = useState(undefined);

  const history = useHistory();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'sampleCommentAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              name: response?.name,
              code: response?.code,
              data: response?.content?.items
            });
            setDetails(response);
          }
        },
      });
    }
  }, [params.id]);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'sampleCommentAdd/UPDATE' : 'sampleCommentAdd/ADD',
      payload: {
        id: params.id,
        name: values?.name,
        content: {
          items: values?.data
        }
      },
      callback: (response, error) => {
        if (response) {
          if (response) {
            history.push(`/the-chat/nhan-xet-mau`);
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

  return (
    <>
      <Breadcrumbs last={params.id ? details?.code : 'Tạo mới'} menu={menuLeftPhysicalItem} />
      <Helmet title="Sample comments" />
      <Pane className="p20">
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Pane>
            <Loading
              loading={loading}
              params={{ type: 'container' }}
            >
              <Pane className="card">
                <Pane className="p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin chung
                  </Heading>
                  <Pane className="row mt20">
                    <Pane className="col-lg-6">
                      <FormItem label="ID" name="code" type={variables.INPUT} disabled placeholder={" "} />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem label="Loại nhận xét" name="name" type={variables.INPUT} rules={[variables.RULES.EMPTY_INPUT]} />
                    </Pane>
                    <Pane className="col-lg-12">
                      <Heading type="form-title" className="mb20">
                        Nhận xét mẫu
                      </Heading>

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
                    </Pane>
                  </Pane>
                  <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
                    <p
                      className="btn-delete"
                      role="presentation"

                      onClick={() => history.goBack()}
                    >
                      Hủy
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                      loading={loadingSubmit}
                      permission={params?.id ? "WEB_THECHAT_QUANLYNHANXET_EDIT" : "WEB_THECHAT_QUANLYNHANXET_CREATE"}
                    >
                      Lưu
                    </Button>
                  </Pane>
                </Pane>
              </Pane>
            </Loading>
          </Pane>
        </Form>
      </Pane>
    </>
  );
},
);

export default General;
