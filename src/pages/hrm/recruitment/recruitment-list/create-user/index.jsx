import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Upload, message } from 'antd';
import { isEmpty, last, head, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import csx from 'classnames';
import { variables } from '@/utils';
import { history, useLocation } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import stylesForm from '@/assets/styles/Common/common.scss';
import Loading from '@/components/CommonComponent/Loading';

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
      const { name } = file;
      const allowTypes = ['pdf', 'docx', 'xlsx'];
      if (!allowTypes.includes(last(name.split('.')))) {
        message.error('Chỉ hỗ trợ định dạng .pdf, .docx, .xlsx. Dung lượng không được quá 5mb');
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
                    <Pane className="col-lg-6">
                      <label className="ant-col ant-form-item-label d-flex">
                        <span className={stylesForm['thead-required']}>Tài liệu đính kèm</span>
                      </label>
                      <Form.Item
                        name="file"
                        style={{ marginBottom: 0 }}
                        rules={[variables.RULES.EMPTY]}
                      >
                        <Upload {...props}>
                          <div className="d-flex">
                            <ButtonComponent
                              loading={effects[`upload/UPLOAD`]}
                              color="transparent"
                              icon="upload1"
                            >
                              Tải lên
                            </ButtonComponent>
                            <i className={stylesModule['text-upload']}>
                              Chỉ hỗ trợ định dạng .pdf (dung lượng tối đa 5mb)
                            </i>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Pane>
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
