import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { isEmpty, last, head, get, size } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { Form, Upload, message } from 'antd';
import stylesForm from '@/assets/styles/Common/common.scss';
import { useParams, history } from 'umi';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import moment from 'moment';
import csx from 'classnames';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { Helper, variables } from '@/utils';

import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
    divisions,
    dataConfigurationInterview,
    employees,
    details,
  } = useSelector(
    ({
      menu,
      loading,
      hrmRecruitmentInterviewListAdd,
      hrmInterviewManagerCategoryInterviewConfiguration,
      categories,
    }) => ({
      loading,
      menuLeftHRM: menu.menuLeftHRM,
      divisions: categories.divisions,
      employees: categories.employees,
      details: hrmRecruitmentInterviewListAdd.details,
      dataConfigurationInterview: hrmInterviewManagerCategoryInterviewConfiguration?.data,
      error: hrmRecruitmentInterviewListAdd.error,
    }),
  );

  const loadingSubmit =
    effects[`hrmRecruitmentInterviewListAdd/UPDATE`] ||
    effects[`hrmRecruitmentInterviewListAdd/ADD`];

  const onFinish = (values) => {
    dispatch({
      type: params.id
        ? 'hrmRecruitmentInterviewListAdd/UPDATE'
        : 'hrmRecruitmentInterviewListAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        status: details?.status,
        file: !isEmpty(file) ? JSON.stringify(file) : undefined,
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.date,
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
        time: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.time,
          }),
          format: variables.DATE_FORMAT.HOUR,
          isUTC: false,
        }),
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
    dispatch({
      type: 'categories/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'categories/GET_EMPLOYEES',
      payload: {},
    });
    dispatch({
      type: 'hrmInterviewManagerCategoryInterviewConfiguration/GET_DATA',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmRecruitmentInterviewListAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              ...response,
              date: response?.date && moment(response?.date),
              time: response?.time && moment(response?.time, variables.DATE_FORMAT.HOUR),
              employeeId: response?.interviewListEmployee?.map((item) => item?.id),
            });
            setFile(JSON.parse(response.file));
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
      <Helmet title="Tạo mới phỏng vấn" />
      <Breadcrumbs last={params.id ? 'Sửa' : 'Tạo mới'} menu={menuLeftHRM} />
      <div>
        <Helmet title="Tạo mới phỏng vấn" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={
                  effects['hrmRecruitmentInterviewListAdd/GET_DATA'] ||
                  (params?.id && effects['categories/GET_EMPLOYEES'])
                }
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin chung
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-3">
                      <FormItem
                        name="code"
                        placeholder=" "
                        type={variables.INPUT}
                        label="ID"
                        disabled
                      />
                    </Pane>
                    <Pane className="col-lg-9">
                      <FormItem
                        name="interviewName"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Phỏng vấn"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="candidateName"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Tên ứng viên"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="location"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Vị trí ứng tuyển"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="divisionId"
                        placeholder="Chọn bộ phận"
                        type={variables.SELECT}
                        data={divisions}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Bộ phận"
                      />
                    </Pane>
                    <div className={csx(stylesForm['container-upload'], 'col-lg-3 pb20')}>
                      <label
                        className={csx(
                          stylesForm['wrapper-lable'],
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
                        <Upload {...props} className={stylesForm['upload-file']}>
                          <div className={stylesForm['wrapper-upload']}>
                            <div className={stylesForm['upload-btn']}>
                              <Button loading={effects[`upload/UPLOAD`]} color="white">
                                <img src="/images/hrm/cloud-computing.svg" alt="ImageUpload" />
                                <h4 className={stylesForm.text}>Tải lên</h4>
                              </Button>
                            </div>
                            <i className={stylesForm.textNote}>
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
                    <Pane className="col-lg-3">
                      <FormItem
                        name="interviewConfigurationId"
                        placeholder="Nhập"
                        data={dataConfigurationInterview}
                        type={variables.SELECT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Cấu hình áp dụng"
                      />
                    </Pane>
                    <Pane className="col-lg-9">
                      <FormItem
                        name="employeeId"
                        options={['id', 'fullName']}
                        placeholder="Chọn người phụ trách"
                        type={variables.SELECT_MUTILPLE}
                        data={employees}
                        rules={[variables.RULES.EMPTY]}
                        loading={effects['hrmInterviewManagerCategoryInterviewAdd/GET_EMPLOYEES']}
                        label="Người phụ trách phỏng vấn"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <Pane className="row ">
                        <Pane className="col-lg-6">
                          <FormItem
                            name="date"
                            type={variables.DATE_PICKER}
                            rules={[variables.RULES.EMPTY]}
                            label="Thời gian"
                          />
                        </Pane>
                        <Pane className="col-lg-6">
                          <FormItem
                            name="time"
                            rules={[variables.RULES.EMPTY]}
                            type={variables.TIME_PICKER}
                            label=" "
                          />
                        </Pane>
                      </Pane>
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="address"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Địa điểm"
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loadingSubmit}
                    permission={
                      params?.id
                        ? `${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHSACHPHONGVAN}${ACTION.EDIT}`
                        : `${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHSACHPHONGVAN}${ACTION.CREATE}`
                    }
                  >
                    Lưu
                  </Button>
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
