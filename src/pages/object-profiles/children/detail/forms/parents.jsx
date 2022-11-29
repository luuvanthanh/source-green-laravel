import { memo, useRef, useState, useEffect } from 'react';
import { Form } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { connect, history, withRouter } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Loading from '@/components/CommonComponent/Loading';

import { Helper } from '@/utils';


const infomationTypes = {
  create: 'CREATE',
  select: 'SELECT',
};


const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
  parents: OPchildrenAdd.parents,
});
const Parents = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, parents }) => {
    const formRef = useRef();
    const loading = effects[`OPchildrenAdd/GET_DETAILS`] || effects[`OPchildrenAdd/GET_EMPLOYEES`];
    const mounted = useRef(false);

    const mountedSet = (action, value) => {
      if (mounted.current) {
        action(value);
      }
    };

    const [formType, setFormType] = useState({
      farther: infomationTypes.create,
      mother: infomationTypes.create,
    });

    useEffect(() => {
      formRef.current.setFieldsValue({
        farther: {
          sex: 'MALE',
        },
        mother: {
          sex: 'FEMALE',
        },
      });
    }, []);

    const detailForm = (key, sex) => {
      switch (formType[key]) {
        case infomationTypes.create:
          return (
            <FormDetail
              name={details[`${key}`] ? `${details[`${key}Id`]}` : 'Chưa có thông tin phụ huynh'}
              label="Tên phụ huynh"
              type={details[`${key}`] ? "select" : "input"}
              data={Helper.convertSelectParent(parents)?.filter(i => i?.sex === sex)} />
          );
        case infomationTypes.select:
          return (
            <>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <FormDetail name={`${details[`${key}Id`]}`} label="Tên phụ huynh" type="select" data={Helper.convertSelectParent(parents)?.filter(i => i?.sex === sex)} />
                </Pane>
                {details[`${key}Id`] && (
                  <Pane className="col-lg-4">
                    <Form.Item label={<span />}>
                      <Button
                        color="success"
                        onClick={() =>
                          history.push(`/ho-so-doi-tuong/phu-huynh/${details[`${key}Id`]}/chi-tiet`)
                        }
                      >
                        Chi tiết
                      </Button>
                    </Form.Item>
                  </Pane>
                )}
              </Pane>
            </>
          );
        default:
          return null;
      }
    };

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
        dispatch({
          type: 'OPchildrenAdd/GET_PARENTS',
          payload: params,
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          fartherId: details.fartherId,
          motherId: details.motherId,
        });
        mountedSet(setFormType, {
          mother: details?.motherId ? infomationTypes.select : infomationTypes.create,
          farther: details?.fartherId ? infomationTypes.select : infomationTypes.create,
        });
      }
    }, [details]);

    return (
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{
          farther: {
            type: infomationTypes.create,
          },
          mother: {
            type: infomationTypes.create,
          },
        }}
      >
        <Pane className="card">
          <Loading
            loading={loading}
            isError={error.isError}
            params={{ error, goBack: '/ho-so-doi-tuong/hoc-sinh' }}
          >
            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Phụ huynh
              </Heading>
              <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                Thông tin cha
              </Heading>
              {!details?.farther}
              {detailForm('farther', 'MALE')}
            </Pane>

            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                Thông tin mẹ
              </Heading>

              {!details?.mother}
              {detailForm('mother', 'FEMALE')}
            </Pane>

            <Pane style={{ padding: 20 }}>
              <Button
                color="success"
                style={{ marginLeft: 'auto' }}
                size="large"
                onClick={() => {
                  history.push(`/ho-so-doi-tuong/hoc-sinh/${details?.student?.id}/chinh-sua?type=parents`);
                }}
                htmlType="submit"
              >
                Chỉnh sửa
              </Button>
            </Pane>
          </Loading>
        </Pane>
      </Form >
    );
  },
);

Parents.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  parents: PropTypes.arrayOf(PropTypes.any),
};

Parents.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  parents: [],
};

export default withRouter(connect(mapStateToProps)(Parents));
