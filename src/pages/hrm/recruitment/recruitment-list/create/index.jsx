import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Input, Tooltip, Button } from 'antd';
import { isEmpty, get, head, last, size } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import moment from 'moment';
import { variables, Helper } from '@/utils';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import ButtonComponent from '@/components/CommonComponent/Button';
import { CopyOutlined } from '@ant-design/icons';
import FormItem from '@/components/CommonComponent/FormItem';
import detail from '@/pages/hrm/report/history-employee/detail';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    dataLevel,
    divisions,
    dataConfiguration,
    menuLeftHRM,
  } = useSelector(
    ({
      menu,
      loading,
      hrmRecruitmentRecruitmentListAdd,
      hrmRecruitmentRecruitmentConfigurationAdd,
      hrmRecruitmentRecruitmentConfiguration,
    }) => ({
      loading,
      menuLeftHRM: menu.menuLeftHRM,
      divisions: hrmRecruitmentRecruitmentConfigurationAdd.divisions,
      dataLevel: hrmRecruitmentRecruitmentConfigurationAdd.dataLevel,
      dataConfiguration: hrmRecruitmentRecruitmentConfiguration.data,
      error: hrmRecruitmentRecruitmentListAdd.error,
    }),
  );

  const loadingSubmit =
    effects[`hrmRecruitmentRecruitmentListAdd/UPDATE`] ||
    effects[`hrmRecruitmentRecruitmentListAdd/ADD`];

  const loadingAddLink = effects[`hrmRecruitmentRecruitmentListAdd/GET_LINK_RECRUITMENT`];

  const [dataLink, setDataLink] = useState();

  const onFinish = (values) => {
    dispatch({
      type: params.id
        ? 'hrmRecruitmentRecruitmentListAdd/UPDATE'
        : 'hrmRecruitmentRecruitmentListAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        startDate:
          head(values.date) && Helper.getDate(head(values.date), variables.DATE_FORMAT.DATE_AFTER),
        endDate:
          last(values.date) && Helper.getDate(last(values.date), variables.DATE_FORMAT.DATE_AFTER),
        date: undefined,
        link: head(dataLink)?.endPoint,
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
    if (params.id) {
      dispatch({
        type: 'hrmRecruitmentRecruitmentListAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              ...response,
              date: response?.startDate &&
                response?.endDate && [moment(response?.startDate), moment(response?.endDate)],
            });
            setDataLink([
              {
                domain: response?.domain,
                endPoint: response?.link,
              },
            ]);
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onGetLink = () => {
    dispatch({
      type: 'hrmRecruitmentRecruitmentListAdd/GET_LINK_RECRUITMENT',
      payload: params,
      callback: (response) => {
        if (response) {
          setDataLink(response);
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'hrmRecruitmentRecruitmentConfigurationAdd/GET_RECRUIMENT_LEVELS',
      payload: {},
    });
    dispatch({
      type: 'hrmRecruitmentRecruitmentConfigurationAdd/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'hrmRecruitmentRecruitmentConfiguration/GET_DATA',
      payload: {
        limit: variables.PAGINATION.SIZEMAX,
        page: variables.PAGINATION.PAGE,
      },
    });
  }, []);

  return (
    <>
      <Helmet title="Danh sách tuyển dụng" />
      <Breadcrumbs last={params.id ? 'Sửa' : 'Tạo mới'} menu={menuLeftHRM} />
      <div>
        <Helmet title="Danh sách tuyển dụng" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentRecruitmentListAdd/GET_DATA']}
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
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormItem
                        name="name"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Tuyển dụng"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="date"
                        placeholder="Nhập"
                        type={variables.RANGE_PICKER}
                        rules={[variables.RULES.EMPTY]}
                        label="Thời gian tuyển dụng"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="numberOfRecruitments"
                        placeholder="Nhập"
                        type={variables.INPUT_COUNT}
                        rules={[variables.RULES.EMPTY]}
                        label="Số lượng tuyển dụng"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="divisionId"
                        data={divisions}
                        placeholder="Nhập"
                        type={variables.SELECT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Bộ phận"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="recruitmentLevelId"
                        placeholder="Nhập"
                        data={dataLevel}
                        type={variables.SELECT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Level"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="recruitmentConfigurationId"
                        placeholder="Nhập"
                        data={dataConfiguration}
                        type={variables.SELECT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Cấu hình tuyển dụng"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <div className="ant-col ant-form-item-label">
                        <label>
                          <span>Link liên kết</span>
                        </label>
                      </div>
                      <div className="w100">
                        <Input.Group compact>
                          <Button
                            loading={loadingAddLink}
                            type="primary"
                            onClick={() => onGetLink()}
                          >
                            {!loadingAddLink && 'Tạo'}
                          </Button>
                          <Input
                            style={{
                              width: 'calc(100% - 85px)',
                            }}
                            value={
                              head(dataLink)?.endPoint
                                ? `${head(dataLink)?.domain}${head(dataLink)?.endPoint}`
                                : ''
                            }
                          />
                          {!loadingAddLink && !isEmpty(dataLink) && (
                            <Tooltip title="copy link">
                              <Button
                                icon={<CopyOutlined />}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${head(dataLink)?.domain}${head(dataLink)?.endPoint}`,
                                  );
                                }}
                              />
                            </Tooltip>
                          )}
                        </Input.Group>
                      </div>
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  {detail?.numberOfCandidates <= 0 ||
                    (isEmpty(detail?.numberOfCandidates) && (
                      <ButtonComponent
                        color="success"
                        htmlType="submit"
                        size="large"
                        loading={loadingSubmit}
                        permission={
                          params?.id
                            ? `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_DANHSACHTUYENDUNG}${ACTION.EDIT}`
                            : `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_DANHSACHTUYENDUNG}${ACTION.CREATE}`
                        }
                      >
                        Lưu
                      </ButtonComponent>
                    ))}
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
