import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { connect, withRouter, history } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';

const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
});
const Other = memo(({ dispatch, match: { params }, details }) => {
  const formRef = useRef();

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPchildrenAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  return (
    <Form layout="vertical" ref={formRef}>
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Khác
          </Heading>
          <Pane className="row">
            <Pane className="col">
              <FormDetail name={details?.student?.note} label="Lưu ý về trẻ" type="text" />
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormDetail name={details?.student?.parentWish} label="Mong muốn của phụ huynh" type="text" />
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormDetail name={details?.student?.source} label="Nguồn" type="text" />
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormDetail name={details?.student?.comments} label="Đóng góp của phụ huynh" type="text" />
            </Pane>
          </Pane>
        </Pane>

        <Pane style={{ padding: 20 }}>
          <Button
            color="success"
            style={{ marginLeft: 'auto' }}
            size="large"
            onClick={() => {
              history.push(`/ho-so-doi-tuong/hoc-sinh/${details?.student?.id}/chinh-sua?type=other`);
            }}
            permission="WEB_HSDT_HOCSINH_EDIT"
          >
            Chỉnh sửa
          </Button>
        </Pane>
      </Pane>
    </Form>
  );
});

Other.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

Other.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
};


export default withRouter(connect(mapStateToProps)(Other));
