import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { head, isEmpty, get } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from '../styles.module.scss';

const General = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [{ menuLeftMedical }, {
    details,
  }, effects] = useSelector(({ menu, medicalListTroubleAdd, loading: { effects } }) => [menu, medicalListTroubleAdd, effects]);
  const mounted = useRef(false);
  const loadingSubmit = effects['medicalListTroubleAdd/ADD'] || effects['medicalListTroubleAdd/UPDATE'];


  const params = useParams();

  const history = useHistory();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      data: [""]
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'medicalListTroubleAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              data: response.symptoms.map((item) => ({
                ...item,
              })),
            });
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        ...details,
        ...head(details.positionLevel) || {},
      });
    }
  }, [details]);

  const onFinish = (values) => {
    const items = values.data.map((item) => ({
      ...item,
    }));
    dispatch({
      type: params.id ? 'medicalListTroubleAdd/UPDATE' : 'medicalListTroubleAdd/ADD',
      payload: {
        ...details,
        ...params,
        name: values?.name,
        symptoms: items,
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.setFields([
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
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftMedical} />
      <Pane className="p20">
        <Form
          layout="vertical"
          form={form}
          initialValues={{}}
          onFinish={onFinish}
        >
          <Pane>
            <Pane className="card">
              <Pane className="p20">
                <Heading type="form-title" className="mb20">
                  Thông tin thêm mới
                </Heading>
                <Pane className="row mt20">
                  <Pane className="col-lg-3">
                    <FormItem label="Mã sự cố" name="code" type={variables.INPUT} disabled placeholder={" "} />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormItem label="Tên sự cố" name="name" type={variables.INPUT} rules={[variables.RULES.EMPTY_INPUT]} />
                  </Pane>
                  <Pane className="col-lg-12">
                    <Heading type="form-title" className="mb20">
                      Triệu chứng
                    </Heading>

                    <Pane >
                      <div className={stylesModule['wrapper-table']}>
                        <div className={stylesModule['card-heading']}>
                          <div className={stylesModule.col}>
                            <p className={stylesModule.norm}>Vị trí vết thương</p>
                          </div>
                          <div className={stylesModule.col}>
                            <p className={stylesModule.norm}>Tên triệu chứng</p>
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
                                        fieldKey={[fieldItem.fieldKey, 'position']}
                                        name={[fieldItem.name, 'position']}
                                        type={variables.INPUT}
                                        rules={[variables.RULES.EMPTY_INPUT]}
                                      />
                                    </div>
                                    <div className={classnames(stylesModule.col)}>
                                      <FormItem
                                        className={stylesModule.item}
                                        fieldKey={[fieldItem.fieldKey, 'symptomName']}
                                        name={[fieldItem.name, 'symptomName']}
                                        type={variables.INPUT}
                                        rules={[variables.RULES.EMPTY_INPUT]}
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
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p
                    className="btn-delete"
                    role="presentation"
                    loading={loadingSubmit}
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
                  >
                    Lưu
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Form>
      </Pane>
    </>
  );
},
);

General.propTypes = {
};

General.defaultProps = {
};

export default General;
