import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { head, isEmpty } from 'lodash';
import classnames from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import styles from './styles.module.scss';

const Index = memo(() => {
  const [
    loading,
    { configs, parents },
  ] = useSelector(({ loading: { effects }, medicalGroupByType }) => [effects, medicalGroupByType]);
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);

  const onFinish = (values) => {
    const payload = values.data.map((item, index) => ({
      id: item.id,
      orderNo: index,
      items: item.items.map((itemChil, indexChil) => ({
        id: itemChil.id,
        orderNo: indexChil,
      })),
    }));
    dispatch({
      type: 'medicalGroupByType/ADD',
      payload,
      callback: (response, error) => {
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
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
      type: 'medicalGroupByType/GET_DATA',
      payload: {
        ...params,
        type: 'MEDICAL',
      },
      callback: (response) => {
        if (response) {
          formRef.current.setFieldsValue({
            data: response.map((item) => ({
              ...(item?.group || {}),
              items: item.items,
            })),
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'medicalGroupByType/GET_CONFIG_TYPES',
      payload: {
        ...params,
        type: 'MEDICAL',
        isParent: 'false',
        invisible: 'false'
      },
    });
    dispatch({
      type: 'medicalGroupByType/GET_PARENT_CONFIG_TYPES',
      payload: {
        ...params,
        isParent: true,
        type: 'MEDICAL',
        invisible: 'false'
      },
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Pane style={{ paddingTop: 20 }}>
      <Helmet title={params.id ? 'Chỉnh sửa' : 'Tạo mới'} />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Pane className="row justify-content-center">
          <Pane className="col-lg-8">
            <Heading type="page-title">Thời gian uống thuốc</Heading>
            <Form
              className="mt20"
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{
                data: [{ items: [{}] }],
              }}
            >
              <div className={styles.card}>
                <div className={styles['card-heading']}>
                  <div className={styles.col}>
                    <p className={styles.norm}>Nhóm buổi</p>
                  </div>
                  <div className={styles.col}>
                    <p className={styles.norm}>Buổi</p>
                  </div>
                </div>
                <div className={styles['card-body']}>
                  <Form.List name="data">
                    {(fields, { add }) => (
                      <div>
                        {fields.map((field) => (
                          <div key={field.key}>
                            <div className={styles['card-item']}>
                              <div className={classnames(styles.col, styles['col-first'])}>
                                <FormItem
                                  data={parents.map((item) => ({
                                    id: item.id,
                                    name: item.description || item.name,
                                  }))}
                                  className="mb0"
                                  name={[field.name, 'id']}
                                  fieldKey={[field.fieldKey, 'id']}
                                  type={variables.SELECT}
                                  rules={[variables.RULES.EMPTY]}
                                />
                              </div>
                              <div className={styles.col}>
                                <Form.List
                                  name={[field.name, 'items']}
                                  fieldKey={[field.fieldKey, 'items']}
                                >
                                  {(fieldsItems, { add, remove }) => (
                                    <div>
                                      {fieldsItems.map((fieldItems) => (
                                        <div className={styles['item-form']} key={fieldItems.key}>
                                          <FormItem
                                            data={configs.map((item) => ({
                                              id: item.id,
                                              name: item.description || item.name,
                                            }))}
                                            className="mb0"
                                            name={[fieldItems.name, 'id']}
                                            fieldKey={[fieldItems.fieldKey, 'id']}
                                            type={variables.SELECT}
                                            rules={[variables.RULES.EMPTY]}
                                          />
                                          <div className={styles['list-button']}>
                                            <button
                                              className={styles['button-circle']}
                                              onClick={() => {
                                                remove(fieldItems.name);
                                              }}
                                              type="button"
                                            >
                                              <span className="icon-remove" />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      <div className={styles['item-form']}>
                                        <Button
                                          color="success"
                                          ghost
                                          icon="plus"
                                          onClick={() => {
                                            add();
                                          }}
                                        >
                                          Thêm buổi
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Form.List>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className={styles['card-footer']}>
                          <Button
                            color="success"
                            ghost
                            icon="plus"
                            onClick={() => {
                              add();
                            }}
                          >
                            Thêm nhóm buổi
                          </Button>
                        </div>
                      </div>
                    )}
                  </Form.List>
                </div>
              </div>

              <Pane className="d-flex justify-content-between align-items-center mt20">
                <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                  Hủy
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={
                    loading['medicalGroupByType/ADD'] ||
                    loading['medicalGroupByType/UPDATE'] ||
                    loading['medicalGroupByType/GET_DATA']
                  }
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
