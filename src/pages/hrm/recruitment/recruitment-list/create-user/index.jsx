import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Upload, message } from 'antd';
import { isEmpty, last, head, get, size } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import csx from 'classnames';
import { variables } from '@/utils';
import { history, useLocation } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import stylesForm from '@/assets/styles/Common/common.scss';
import Loading from '@/components/CommonComponent/Loading';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';

import ButtonComponent from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const { query } = useLocation();

  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
  } = useSelector(({ menu, loading, hrmRecruitmentRecruitmentListAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    error: hrmRecruitmentRecruitmentListAdd.error,
  }));

  const loadingSubmit = effects[`hrmRecruitmentRecruitmentListAdd/ADD_DATA_USER`];

  const onFinish = (values) => {
    dispatch({
      type: 'hrmRecruitmentRecruitmentListAdd/ADD_DATA_USER',
      payload: {
        ...values,
        recruitmentManagerId: query?.recruitmentManagerId,
        file: !isEmpty(file) ? JSON.stringify(file) : undefined,
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
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
      <Helmet title="Tạo ứng viên" />
      <Breadcrumbs last="Tạo mới" menu={menuLeftHRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Tạo ứng viên" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentRecruitmentListAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin ứng viên
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem
                        name="name"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Họ tên ứng viên"
                      />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem
                        name="location"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Vị trí ứng tuyển"
                      />
                    </Pane>
                    <Pane className="col-lg-6">
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
                    </Pane>
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
                              <ButtonComponent loading={effects[`upload/UPLOAD`]} color="white">
                                <img src="/images/hrm/cloud-computing.svg" alt="ImageUpload" />
                                <h4 className={stylesModule.text}>Tải lên</h4>
                              </ButtonComponent>
                            </div>
                            <i className={stylesModule.textNote}>
                              Chỉ hỗ trợ định dạng .pdf. Dung lượng không được quá 5mb
                            </i>
                          </div>
                        </Upload>
                      </Form.Item>
                    </div>
                    {!isEmpty(file) && (
                      <Pane className="col-lg-12 border-top border-bottom">
                        <div className={csx(stylesForm['files-container'], 'mt5')}>
                          {file.map((item) => (
                            <div className={stylesForm.item} key={item.id}>
                              <a href={`${API_UPLOAD}${item.url}`} target="_blank" rel="noreferrer">
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
                      </Pane>
                    )}
                  </Pane>
                </Pane>
                <Pane className="pb20 d-flex justify-content-between align-items-center">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <ButtonComponent
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loadingSubmit}
                    permission={`${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_DANHSACHTUYENDUNG}${ACTION.EDIT}`}
                  >
                    Lưu
                  </ButtonComponent>
                </Pane>
              </Loading>
            </Form>
          </Pane>
        </Pane>
      </div>
    </>
  );
});

export default Index;
