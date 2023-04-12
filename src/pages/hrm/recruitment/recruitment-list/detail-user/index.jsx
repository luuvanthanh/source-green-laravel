import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get, head } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { history, useLocation } from 'umi';
import Loading from '@/components/CommonComponent/Loading';
import Heading from '@/components/CommonComponent/Heading';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import HelperModules from '../../utils/Helper';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { query } = useLocation();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
  } = useSelector(({ menu, loading, hrmRecruitmentRecruitmentListAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    dataUser: hrmRecruitmentRecruitmentListAdd.dataUser,
  }));
  const [detail, setDetail] = useState();
  const loadingSubmit = effects[`hrmRecruitmentRecruitmentListAdd/ADD_USER_STATUS`];

  const file = detail?.file ? JSON.parse(detail?.file) : [];

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onStatus = (type) => {
    dispatch({
      type: 'hrmRecruitmentRecruitmentListAdd/ADD_USER_STATUS',
      payload: {
        id: query?.id,
        status: type,
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

  const onPass = () => {
    // const text = `Ứng viên ${detail?.name} đã đạt. Bạn có muốn tạo phỏng vấn với ứng viên này không?`;
    // const ok = 'CÓ TẠO PHỎNG VẤN';
    // const cancel = 'KHÔNG TẠO';
    onStatus('PASS');
    // Helper.confirmModal(
    //   {
    //     callback: () => {
    //       dispatch({
    //         type: 'hrmRecruitmentRecruitmentListAdd/ADD_INTERVIEW',
    //         payload: {
    //           id,
    //         },
    //         callback: (response) => {
    //           if (response) {
    //             history.goBack();
    //           }
    //         },
    //       });
    //     },
    //   },
    //   text,
    //   ok,
    //   cancel,
    // );
  };

  useEffect(() => {
    if (query.id) {
      dispatch({
        type: 'hrmRecruitmentRecruitmentListAdd/GET_DATA_USER',
        payload: query,
        callback: (response) => {
          if (response) {
            setDetail(response);
          }
        },
      });
    }
  }, [query.id]);

  return (
    <>
      <Breadcrumbs last="Chi tiết" menu={menuLeftHRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Loại tài sản" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentRecruitmentListAdd/GET_DATA_USER']}
              >
                <Pane className="p20">
                  <Pane className="card p20">
                    <div className="d-flex justify-content-between align-items-center">
                      <Heading type="form-title" className="mb15">
                        Thông tin ứng tuyển
                      </Heading>
                      <div>{HelperModules.tagStatusRecruimentUser(detail?.status)}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <FormDetail
                          name={detail?.name}
                          label="Họ tên ứng viên"
                          type={variables.TYPE.TEXT}
                        />
                      </div>
                      <div className="col-lg-6">
                        <FormDetail
                          name={detail?.location}
                          label="Vị trí ứng tuyển"
                          type={variables.TYPE.TEXT}
                        />
                      </div>
                      <div className="col-lg-6">
                        <FormDetail
                          name={detail?.phone}
                          label="Số điện thoại liên lạc"
                          type={variables.TYPE.TEXT}
                        />
                      </div>
                      <div className="col-lg-6">
                        <FormDetail
                          name={head(file)?.name}
                          link={head(file)?.url}
                          label="CV bản thân"
                          type={variables.TYPE.LINK}
                        />
                      </div>
                    </div>
                    {detail?.questionCandidate?.map((item) => (
                      <div className="row pt20">
                        <div className="col-lg-12">
                          <FormDetail
                            name={item?.answer}
                            label={item?.recruitmentQuestion?.name}
                            type={variables.TYPE.TEXT}
                          />
                        </div>
                      </div>
                    ))}
                  </Pane>
                  <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                    <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                      Đóng
                    </p>
                    {detail?.status === 'UNCONFIMRED' && (
                      <div className="d-flex">
                        <Button
                          className="ml-auto px25"
                          color="light"
                          size="large"
                          loading={loadingSubmit}
                          onClick={() => onStatus('NOT_ACHIEVED')}
                          permission={
                            query?.type === 'luu-tru'
                              ? `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_LUUTRU}${ACTION.APPROVE}`
                              : `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_DANHSACHTUYENDUNG}${ACTION.APPROVE}`
                          }
                        >
                          Không đạt
                        </Button>
                        <Button
                          className="ml-auto px25 ml10"
                          color="success"
                          size="large"
                          loading={loadingSubmit}
                          onClick={() => onPass()}
                          permission={
                            query?.type === 'luu-tru'
                              ? `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_LUUTRU}${ACTION.APPROVE}`
                              : `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_DANHSACHTUYENDUNG}${ACTION.APPROVE}`
                          }
                        >
                          Đạt
                        </Button>
                      </div>
                    )}
                  </Pane>
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
