import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { isEmpty } from 'lodash';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import ImgDetail from '@/components/CommonComponent/imageDetail';
import Loading from '@/components/CommonComponent/Loading';
import variablesModules from '../../../utils/variables';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const marginProps = { style: { marginBottom: 12 } };

const styleListStudent = {
  style:
  {
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: '22px',
    color: '#3b5cad',
  }
};
const mapStateToProps = ({ loading, OPParentsAdd }) => ({
  loading,
  details: OPParentsAdd.details,
  error: OPParentsAdd.error,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const mounted = useRef(false);

  const loadingUpdateStatus =
    effects[`OPParentsAdd/UPDATE_STATUS`];

  const loading = effects[`OPParentsAdd/GET_DETAILS`];

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const updateStatus = () => {
    dispatch({
      type: 'OPParentsAdd/UPDATE_STATUS',
      payload: {
        status:
          details?.status === variablesModules.STATUS.STORE
            ? variablesModules.STATUS.REGIST
            : variablesModules.STATUS.STORE,
        id: params.id,
      },
      callback: (response) => {
        if (response) {
          history.push(
            `/ho-so-doi-tuong/phu-huynh`,
          );
          dispatch({
            type: 'OPParentsAdd/GET_DETAILS',
            payload: params,
          });
        }
      },
    });
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Form layout="vertical" ref={formRef} initialValues={{}}>
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin cơ bản
            </Heading>
            <Pane className="row">
              <Pane className="col-lg-12 mb15">
                <FormDetail label="Hình ảnh" type="img" />
                <ImgDetail
                  fileImage={details?.fileImage}
                />
              </Pane>
            </Pane>
            <Pane className="row border-bottom" {...marginProps}>
              <Pane className="col-lg-4">
                <FormDetail name={details?.fullName} label="Tên khách hàng" type="text" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.dayOfBirth} label="Ngày sinh" type="day" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.sex} label="Giới tính" type="select" data={genders} />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.email} label="Email" type="text" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.phone} label="Số điện thoại" type="text" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.anotherPhone} label="Số điện thoại khác" type="text" />
              </Pane>
            </Pane>
            <Pane className="row border-bottom" {...marginProps}>
              <Pane className="col-lg-3">
                {
                  isEmpty(details?.students) ?
                    <div className='pt10 pb10'>
                      <FormDetail label="Phụ huynh chưa có học sinh" type="label" />
                    </div>
                    :
                    <>
                      <FormDetail label="Danh sách học sinh" type="label" />
                      <ul>
                        {details?.students?.map(i => (
                          <li {...styleListStudent} role="presentation" onClick={() => history?.push(`/ho-so-doi-tuong/hoc-sinh/${i?.id}/chinh-sua`)}>{i?.fullName}</li>
                        ))}
                      </ul>
                    </>
                }
              </Pane>
            </Pane>
            <Pane className="row border-bottom" {...marginProps}>
              <Pane className="col-lg-12">
                <FormDetail name={details?.address} label="Địa chỉ" type="text" />
              </Pane>
            </Pane>

            <Pane className="row">
              <Pane className="col-lg-4">
                <FormDetail name={details?.jobTile} label="Nghề nghiệp" type="text" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.faceBook} label="Địa chỉ facebook" type="text" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.zalo} label="Địa chỉ zalo" type="text" />
              </Pane>

              <Pane className="col-lg-4">
                <FormDetail name={details?.instagram} label="Địa chỉ Instagram" type="text" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.referent} label="Khách hàng liên quan" type="text" />
              </Pane>


              <Pane className="col-lg-12">
                <FormDetail name={details?.remark} label="Ghi chú" type="text" />
              </Pane>

              <Pane className="col-lg-12">
                <FormDetail name={details?.hobby} label="Tính cách, sở thích" type="text" />
              </Pane>

              <Pane className="col-lg-4">
                <FormDetail name={details?.bank} label="Ngân hàng" type="text" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.bankNumber} label="Số tài khoản" type="text" />
              </Pane>
              <Pane className="col-lg-4">
                <FormDetail name={details?.ownerBank} label="Người hưởng thụ" type="text" />
              </Pane>

            </Pane>
          </Pane>

          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            {params.id && (
              <Button
                color="success"
                size="large"
                htmlType="button"
                className="mr-3"
                onClick={updateStatus}
                loading={loadingUpdateStatus}
                permission={details?.status === variablesModules.STATUS.STORE ? "WEB_HSDT_HOSODALUUTRU_PHUHUYNH_EDIT" : "WEB_HSDT_PHUHUYNH_EDIT"}
              >
                {details?.status === variablesModules.STATUS.STORE ? 'Khôi phục' : 'Lưu trữ hồ sơ'}
              </Button>
            )}
            {
              details?.status !== variablesModules.STATUS.STORE && (
                <Button color="success" size="large" onClick={() => {
                  history.push(`/ho-so-doi-tuong/phu-huynh/${details?.id}/chinh-sua`);
                }}
                  permission="WEB_HSDT_PHUHUYNH_EDIT"
                >
                  Chỉnh sửa
                </Button>
              )
            }
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(General));
