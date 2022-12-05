import { memo, useRef, useState, useEffect } from 'react';
import { Form } from 'antd';
import csx from 'classnames';
import { connect, withRouter, history } from 'umi';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import ImgDetail from '@/components/CommonComponent/imageDetail';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Loading from '@/components/CommonComponent/Loading';

const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
});
const Shuttlers = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const loading = effects[`OPchildrenAdd/GET_DETAILS`];
  const mounted = useRef(false);
  const [detailsArray, setDetailsArray] = useState([null]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPchildrenAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        studentTransporter: !isEmpty(details?.student?.studentTransporter)
          ? details?.student?.studentTransporter
          : [{}],
      });
      if (!isEmpty(details?.student?.studentTransporter)) {
        setDetailsArray(details?.student?.studentTransporter);
      }
    }
  }, [details]);

  return (
    <Form
      layout="vertical"
      ref={formRef}
      initialValues={{
        studentTransporter: [{}],
      }}
    >
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane style={{ padding: 20 }} className="pb-0">
            <Heading type="form-title">Người đưa đón</Heading>
          </Pane>

          <Form.List name="studentTransporter">
            {(fields) => (
              <>
                {fields.map(({ key }, index) => (
                  <Pane
                    key={key}
                    className={csx('pb-0', 'border-bottom', 'position-relative')}
                    style={{ padding: 20 }}
                  >
                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                      Người đưa đón {index + 1}
                    </Heading>

                    <Pane className="row">
                      <Pane className="col-lg-12 mb15">
                        <FormDetail label="Hình ảnh" type="img" />
                        <ImgDetail
                          type="object"
                          fileImage={detailsArray[index]?.fileImage}
                        />
                      </Pane>
                    </Pane>

                    <Pane className="row">
                      <Pane className="col-lg-4">
                        <FormDetail name={detailsArray[index]?.fullName} label="Họ và tên" type="text" />
                      </Pane>
                      <Pane className="col-lg-4">
                        <FormDetail name={detailsArray[index]?.relationship} label="Mối liên hệ" type="text" />
                      </Pane>
                      <Pane className="col-lg-4">
                        <FormDetail name={detailsArray[index]?.identifyNumber} label="Số CMND" type="text" />
                      </Pane>

                      <Pane className="col-lg-4">
                        <FormDetail name={detailsArray[index]?.phone} label="Số điện thoại" type="text" />
                      </Pane>
                    </Pane>
                  </Pane>
                ))}

              </>
            )}
          </Form.List>

          <Pane style={{ padding: 20 }}>
            <Button
              color="success"
              style={{ marginLeft: 'auto' }}
              size="large"
              onClick={() => {
                history.push(`/ho-so-doi-tuong/hoc-sinh/${details?.student?.id}/chinh-sua?type=shuttlers`);
              }}
            >
              Chỉnh sửa
            </Button>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

Shuttlers.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Shuttlers.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(Shuttlers));
