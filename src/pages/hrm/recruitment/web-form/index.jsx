import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Upload, message } from 'antd';
import { isEmpty, get, head, last } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams } from 'umi';
import csx from 'classnames';
import stylesForm from '@/assets/styles/Common/common.scss';

import Loading from '@/components/CommonComponent/Loading';
import Pane from '@/components/CommonComponent/Pane';
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import stylesModule from './styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    data,
    details,
  } = useSelector(({ loading, hrmRecruitmentThankConfiguration, hrmRecruitmentWebForm }) => ({
    loading,
    details: hrmRecruitmentThankConfiguration.details,
    data: hrmRecruitmentWebForm.data,
    error: hrmRecruitmentWebForm.error,
  }));
  const [file, setFile] = useState();
  const [checkSubmit, setCheckSubmit] = useState(false);

  const loadingSubmit = effects[`hrmRecruitmentWebForm/ADD`];

  const onFinish = (values) => {
    dispatch({
      type: 'hrmRecruitmentWebForm/ADD',
      payload: {
        name: values?.name,
        location: values?.location,
        phone: values?.phone,
        endPoint: params?.id,
        recruitmentManagerId: data?.id,
        file: !isEmpty(file) ? JSON.stringify(file) : undefined,
        data: values?.recruitmentConfiguraForm?.map((item) => ({
          answer: item?.answer,
        })),
      },
      callback: (response, error) => {
        if (response) {
          setCheckSubmit(true);
        }
        if (error) {
          if (!isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              form.setFields([
                {
                  name: get(item, 'member').toLowerCase(),
                  errors: [get(item, 'message')],
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
      type: 'hrmRecruitmentThankConfiguration/GET_DETAILS',
      payload: {},
      callback: () => {},
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmRecruitmentWebForm/GET_DATA',
        payload: { endPoint: params?.id },
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              recruitmentConfiguraForm: response.recruitmentConfiguration?.question.map((item) => ({
                ...item,
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

  const onUpload = (files) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: files,
      callback: (response) => {
        if (response) {
          setFile([head(response.results)?.fileInfo]);
        }
      },
    });
  };

  const props = {
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name, size } = file;
      const allowTypes = ['pdf'];
      const maxSize = 5 * 2 ** 20;
      if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
        message.error('Chỉ hỗ trợ định dạng .pdf. Dung lượng không được quá 5mb');
        return;
      }
      onUpload(file);
    },
    showUploadList: false,
    fileList: [],
  };

  const onRemoveFile = () => {
    setFile(null);
  };

  return (
    <>
      <div className={checkSubmit ? 'col-lg-4 offset-lg-4' : 'col-lg-6 offset-lg-3'}>
        <Helmet title="Thêm ứng viên" />
        <Pane>
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
            <Loading
              params={{ type: 'container' }}
              loading={effects['hrmRecruitmentWebForm/GET_DATA']}
            >
              {checkSubmit ? (
                <Pane className={stylesModule['wrapper-card-done']}>
                  <div>
                    <img src="/images/hrm/iconDone.svg" alt="ImageUpload" />
                  </div>
                  <h3 className={stylesModule['text-lable']}>Gửi thành công</h3>
                  <p className={stylesModule['text-content']}>{head(details)?.content}</p>
                  <div
                    className={stylesModule['wrapper-btn']}
                    onClick={() => window.close()}
                    role="presentation"
                  >
                    <p className={stylesModule.btn}>Đóng trang web</p>
                  </div>
                </Pane>
              ) : (
                <Pane className={stylesModule['wrapper-card']}>
                  <Pane className={stylesModule['wrapper-header']}>
                    <Pane className={stylesModule['item-logo']}>
                      <div className={stylesModule.logo}>
                        <img src="/images/webForm.png" alt="ImageUpload" />
                      </div>
                      <Pane className="d-flex">
                        <div className={stylesModule['wrapper-item']}>
                          <div className={stylesModule.icon}>
                            <img src="/images/hrm/smartphone.svg" alt="ImageUpload" />
                            <p className={stylesModule.text}>Tổng đài</p>
                          </div>
                          <h4 className={stylesModule.textNumber}> 1800 6663</h4>
                        </div>
                        <div className={stylesModule['wrapper-item']}>
                          <div className={stylesModule.icon}>
                            <img src="/images/hrm/smartphone.svg" alt="ImageUpload" />
                            <p className={stylesModule.text}>Hotline</p>
                          </div>
                          <h4 className={stylesModule.textNumber}>0919 292 088</h4>
                        </div>
                      </Pane>
                    </Pane>
                    <div className={stylesModule['item-text']}>
                      <h3>{data?.name}</h3>
                    </div>
                  </Pane>
                  <Pane className={csx(stylesModule['wrapper-main'], 'card p20 m0')}>
                    <div className="row border-bottom">
                      <div className="col-lg-6">
                        <FormItem
                          name="name"
                          placeholder="Nhập"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                          label="Họ tên ứng viên"
                        />
                      </div>
                      <div className="col-lg-6">
                        <FormItem
                          name="location"
                          placeholder="Nhập"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                          label="Vị trí ứng tuyển"
                        />
                      </div>
                      <div className="col-lg-6">
                        <FormItem
                          name="phone"
                          placeholder="Nhập"
                          type={variables.INPUT}
                          rules={[
                            variables.RULES.EMPTY,
                            variables.RULES.PHONE,
                            variables.RULES.MIN_NUMBER_PHONE,
                          ]}
                          label="Số điện thoại liên lạc"
                        />
                      </div>
                      <div className={csx(stylesModule['container-upload'], 'col-lg-6 pb20')}>
                        <label
                          className={csx(
                            stylesModule['wrapper-lable'],
                            'ant-col ant-form-item-label d-flex',
                          )}
                        >
                          <span className={stylesForm['thead-required']}>CV bản thân</span>
                        </label>
                        <Form.Item
                          name="file"
                          style={{ marginBottom: 0, border: 'none' }}
                          rules={[variables.RULES.EMPTY]}
                        >
                          <Upload {...props} className={stylesModule['upload-file']}>
                            <div className={stylesModule['wrapper-upload']}>
                              <div className={stylesModule['upload-btn']}>
                                <Button loading={effects[`upload/UPLOAD`]} color="white">
                                  <img src="/images/hrm/cloud-computing.svg" alt="ImageUpload" />
                                  <h4 className={stylesModule.text}>Tải lên</h4>
                                </Button>
                              </div>
                              <i className={stylesModule.textNote}>
                                Chỉ hỗ trợ định dạng .pdf. Dung lượng không được quá 5mb
                              </i>
                            </div>
                          </Upload>
                        </Form.Item>
                      </div>
                      <Pane className="col-lg-12">
                        {!isEmpty(file) && (
                          <div className={csx(stylesForm['files-container'], 'mt5')}>
                            {file.map((item) => (
                              <div className={stylesForm.item} key={item.id}>
                                <a
                                  href={`${API_UPLOAD}${item.url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {item?.name}
                                </a>
                                <span
                                  role="presentation"
                                  className="icon-cross"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveFile();
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </Pane>
                    </div>
                    <div className="row pt20">
                      <Form.List name="recruitmentConfiguraForm">
                        {(fields) => (
                          <>
                            {fields.map((fieldItem, index) => {
                              const itemData = data?.recruitmentConfiguration?.question?.find(
                                (item, indexWater) => indexWater === index,
                              );
                              return (
                                <div className="col-lg-12" key={index}>
                                  <FormItem
                                    className={stylesModule.item}
                                    fieldKey={[fieldItem.fieldKey, 'answer']}
                                    name={[fieldItem.name, 'answer']}
                                    type={variables.INPUT}
                                    label={itemData?.name}
                                    rules={[variables.RULES.EMPTY_INPUT]}
                                  />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </Form.List>
                    </div>
                  </Pane>
                  <div className={stylesModule['wrapper-submit']}>
                    <Button
                      className={stylesModule.btn}
                      color="success"
                      htmlType="submit"
                      size="large"
                      loading={loadingSubmit}
                    >
                      Gửi ứng tuyển
                    </Button>
                  </div>
                </Pane>
              )}
              <div className={stylesModule['wrapper-footer']}>
                Copyright 2023 © ❤️ Clover Montessori
              </div>
            </Loading>
          </Form>
        </Pane>
      </div>
    </>
  );
});

export default Index;
