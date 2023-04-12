import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Input, Tooltip, Button } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import { CopyOutlined } from '@ant-design/icons';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { variables, Helper } from '@/utils';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import ButtonCustomers from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';

import TableDetail from '../component/table-detail';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const { query } = useLocation();
  const mounted = useRef(false);

  const {
    loading: { effects },
    details,
    menuLeftHRM,
  } = useSelector(({ menu, loading, hrmRecruitmentRecruitmentListAdd }) => ({
    loading,
    details: hrmRecruitmentRecruitmentListAdd.details,
    menuLeftHRM: menu.menuLeftHRM,
    error: hrmRecruitmentRecruitmentListAdd.error,
  }));

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id
          ? 'hrmRecruitmentRecruitmentListAdd/UPDATE'
          : 'hrmRecruitmentRecruitmentListAdd/ADD',
        payload: {
          id: params.id,
          name: values?.name,
          description: values?.description,
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
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmRecruitmentRecruitmentListAdd/GET_DATA',
        payload: params,
        callback: () => {},
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const date = `${Helper.getDate(
    details?.startDate,
    variables.DATE_FORMAT.DATE,
  )} - ${Helper.getDate(details?.endDate, variables.DATE_FORMAT.DATE)}`;

  return (
    <>
      <Breadcrumbs last="Chi tiết" menu={menuLeftHRM} />
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
                      <FormDetail name={details?.code} label="ID" type={variables.TYPE.TEXT} />
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormDetail
                        name={details?.name}
                        label="Tuyển dụng"
                        type={variables.TYPE.TEXT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail
                        name={date}
                        label="Thời gian tuyển dụng"
                        type={variables.TYPE.TEXT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail
                        name={details?.numberOfRecruitments}
                        label="Số lượng tuyển dụng"
                        type={variables.TYPE.TEXT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail
                        name={details?.division?.name}
                        label="Bộ phận"
                        type={variables.TYPE.TEXT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail
                        name={details?.level?.name}
                        label="Level"
                        type={variables.TYPE.TEXT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail
                        name={details?.recruitmentConfiguration?.name}
                        label="Cấu hình tuyển dụng"
                        type={variables.TYPE.TEXT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail label="Link liên kết" type={variables.TYPE.LABEL} />

                      <Input.Group compact>
                        <Input
                          style={{
                            width: 'calc(100% - 85px)',
                          }}
                          value={`${details?.domain}${details?.link}`}
                        />
                        <Tooltip title="copy link">
                          <Button
                            icon={<CopyOutlined />}
                            onClick={() => {
                              navigator.clipboard.writeText(`${details?.domain}${details?.link}`);
                            }}
                          />
                        </Tooltip>
                      </Input.Group>
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="card p20">
                  <Pane className="d-flex justify-content-between mb5">
                    <Heading type="form-title" className="mb15" style={{ width: 'auto' }}>
                      Thông tin ứng tuyển
                    </Heading>
                    <ButtonCustomers
                      icon="plus"
                      color="transparent-success"
                      onClick={() =>
                        history.push(
                          `/quan-ly-nhan-su/tuyen-dung/danh-sach-tuyen-dung/${params?.id}/tao-moi-nhan-vien?recruitmentManagerId=${params?.id}`,
                        )
                      }
                      permission={`${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_DANHSACHTUYENDUNG}${ACTION.EDIT}`}
                    >
                      Thêm ứng viên
                    </ButtonCustomers>
                  </Pane>
                  <TableDetail type={query} />
                </Pane>
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Đóng
                  </p>
                  {isEmpty(details?.candidate) && (
                    <ButtonCustomers
                      color="success"
                      size="large"
                      onClick={() => history.push('chinh-sua')}
                      permission={`${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_DANHSACHTUYENDUNG}${ACTION.EDIT}`}
                    >
                      Chỉnh sửa
                    </ButtonCustomers>
                  )}
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
