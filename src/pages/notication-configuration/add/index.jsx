import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Modal } from 'antd';
import { head, isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../styles.module.scss';


const { confirm } = Modal;
const dataObjectTypes = [
  { id: 'EMPLOYEE', name: 'Nhân viên' },
  { id: 'STUDENT', name: 'Học sinh' },
];

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    details,
    menuLeftNotification,
    dataBrowseObject,

  } = useSelector(({ menu, loading, noticationConfigurationAdd }) => ({
    loading,
    menuLeftNotification: menu.menuLeftNotification,
    details: noticationConfigurationAdd.details,
    dataCreationObject: noticationConfigurationAdd.dataCreationObject,
    dataBrowseObject: noticationConfigurationAdd.dataBrowseObject,
    error: noticationConfigurationAdd.error,
  }));

  const [number, setNumber] = useState(0);
  const loadingSubmit = effects[`noticationConfigurationAdd/UPDATE`] || effects[`noticationConfigurationAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'noticationConfigurationAdd/UPDATE' : 'noticationConfigurationAdd/ADD',
        payload: {
          moduleId: params.id,
          module: {
            name: values.name,
          },
          functionProcess: values.data.map((item) => ({
            objectCreateds: item?.objectCreateds?.map(k => ({
              id: k,
              name: dataBrowseObject?.find(i => i?.id === k)?.name,
            })),
            objectApproveds: [({
              id: item?.objectApproveds,
              name: (dataBrowseObject?.find(i => i?.id === item?.objectApproveds))?.name,
            })],
            businessObjectTypes: item?.businessObjectTypes.filter(k => k?.check)?.map((items => ({ code: items.id, name: items.name }))),
            isRequiredApproving: item?.isRequiredApproving,
          })),
        },
        callback: (response, error) => {
          if (response) {
            if (response) {
              history.goBack();
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
    });
  };

  useEffect(() => {
    dispatch({
      type: 'noticationConfigurationAdd/GET_CREATION_OBJECT',
      payload: {},
    });
    dispatch({
      type: 'noticationConfigurationAdd/GET_BROWSE_OBJECT',
      payload: {},
    });
    dispatch({
      type: 'noticationConfigurationAdd/GET_CRECIPIENTS',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'noticationConfigurationAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              data: response?.functionProcess?.map(item => ({
                objectCreateds: item?.objectCreateds?.map(k => k?.id),
                isRequiredApproving: item?.isRequiredApproving,
                objectApproveds: head(item?.objectApproveds)?.id,
                businessObjectTypes: dataObjectTypes?.length > 0 ? dataObjectTypes?.map(k =>
                ({
                  ...k,
                  check: item?.businessObjectTypes.find((elem) => elem.code === k?.id),
                })) : [],
              })),
            });
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        name: details?.module?.name,
      });
    }
  }, [details]);


  useEffect(() => {
    form.setFieldsValue({
      data: form.getFieldsValue()?.data?.map(i =>
      ({
        ...i,
        businessObjectTypes: isEmpty(i?.businessObjectTypes) ? dataObjectTypes?.map(k =>
        ({
          ...k,
        })) : i?.businessObjectTypes,
      })
      )
    });
  }, [number]);

  const confirmAction = () => {
    confirm({
      centered: true,
      okText: 'Xóa',
      cancelText: 'Không',
      wrapClassName: 'wrapper-modal',
      content: (
        <>
          <div className={stylesModule['wrapper-coincide-title']}>Bạn có chắc chắn muốn xóa quy trình này?</div>
        </>
      ),
      onOk() {
        dispatch({
          type: 'noticationConfiguration/REMOVE',
          payload: {
            id: params?.id,
          },
          callback: (response) => {
            if (response) {
              history.push(`/thong-bao/cau-hinh`);
            }
          },
        });
      },
      onCancel() { },
    });
  };


  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftNotification} />
      <Helmet title="Cấu hình khai báo y tế 123" />
      <Pane className="pl20 pr20">
        <Pane >
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              { businessObjectTypes: dataObjectTypes },
            ],
          }}>
            {/* <Loading
              loading={loading} 
              isError={error.isError}
              params={{ error, goBack: '/su-phat-trien-cua-tre/cau-hinh-kich-ban-danh-gia' }}
            > */}

            <Pane className="offset-lg-12 col-lg-12 pt15" >
              <div className='d-flex justify-content-between'>
                <Heading type="form-title" className="mb15">
                  {!params?.id ? 'Tạo mới' : 'Chỉnh sửa'}
                </Heading>
                <h4 className={stylesModule['btn-delete']} onClick={() => confirmAction()} role="presentation">Xóa cấu hình</h4>
              </div>
              <Pane className="card">
                <Pane className="row p20">
                  <Pane className="col-lg-12">
                    <FormItem
                      label="Tên danh mục "
                      name="name"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Form.List name="data">
                {(fields, { remove, add }) => (
                  <>
                    {fields.map((field, index) => (
                      <Pane className="card">
                        <Pane className="offset-lg-12 col-lg-12 pt15" key={field.key}>


                          <Heading type="form-title" className="mb15">
                            Quy trình {index + 1}
                          </Heading>
                          {fields.length > 0 && (
                            <div className={styles['list-button']}>
                              <button
                                className={styles['button-circle-delete']}
                                style={{ display: 'flex', position: 'absolute', top: 20, right: 20 }}
                                onClick={() => {
                                  remove(index);
                                }}
                                type="button"
                              >
                                Xoá
                              </button>
                            </div>
                          )}
                          <Pane className="pb20">
                            <div className={stylesModule['wrapper-table']}>
                              <div className={stylesModule['card-heading']}>
                                <div className={stylesModule.col}>
                                  <p className={stylesModule.norm}>Đối tượng tạo</p>
                                </div>
                                <div className={stylesModule.col}>
                                  <p className={stylesModule.norm}>Đối tượng duyệt</p>
                                </div>
                                <div className={stylesModule.cols}>
                                  <p className={stylesModule.norm} >Đối tượng nhận</p>
                                </div>
                              </div>
                              <div className={stylesModule['card-item']}>
                                <div className={classnames(stylesModule.col)}>
                                  <FormItem
                                    className={stylesModule.item}
                                    fieldKey={[field.fieldKey, 'objectCreateds']}
                                    name={[field.name, 'objectCreateds']}
                                    data={dataBrowseObject}
                                    type={variables.SELECT_MUTILPLE}
                                  />
                                </div>
                                <div className={classnames(stylesModule.col)}>
                                  <FormItem
                                    className="checkbox-row checkbox-small pb10"
                                    label="Cần duyệt"
                                    fieldKey={[field.fieldKey, 'isRequiredApproving']}
                                    name={[field.name, 'isRequiredApproving']}
                                    type={variables.CHECKBOX_FORM}
                                    valuePropName="checked"
                                  />
                                  <FormItem
                                    className={stylesModule.item}
                                    fieldKey={[field.fieldKey, 'objectApproveds']}
                                    name={[field.name, 'objectApproveds']}
                                    type={variables.SELECT}
                                    data={dataBrowseObject}
                                  />
                                </div>
                                <div className={classnames(stylesModule.col)}>
                                  <Form.List label="Hình thức tiếp cận" name={[field.name, 'businessObjectTypes']} fieldKey={[field.fieldKey, 'businessObjectTypes']}>
                                    {(fieldsMap) => (
                                      <>
                                        {fieldsMap.map((itemMap, indexMap) => {
                                          const data = form?.getFieldsValue();
                                          const itemData = data?.data?.length > 0 && data?.data[index]?.businessObjectTypes?.find((item, indexWater) => indexWater === indexMap);
                                          return (
                                            <FormItem
                                              className="checkbox-row checkbox-small pb10"
                                              label={itemData.name}
                                              fieldKey={[itemMap.fieldKey, 'check']}
                                              name={[itemMap.name, 'check']}
                                              type={variables.CHECKBOX_FORM}
                                              valuePropName="checked"
                                            />
                                          );
                                        }
                                        )}
                                      </>
                                    )}
                                  </Form.List>
                                </div>
                              </div>
                            </div>
                          </Pane>
                        </Pane>
                      </Pane>
                    ))}
                    <Pane className="pl20 pb20 pt20" >
                      <Button
                        color="success"
                        ghost
                        icon="plus"

                        onClick={() => {
                          add();
                          setNumber(number + 1);
                        }}
                      >
                        Thêm quy trình
                      </Button>
                    </Pane>
                  </>
                )}
              </Form.List>


            </Pane>
            <Pane className="d-flex justify-content-between align-items-center mb20">
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
              >
                Lưu
              </Button>
            </Pane>

          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;
