import { memo, useRef, useEffect } from 'react';
import { Breadcrumb, Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { Link, connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };

const mapStateToProps = ({ loading, crmMarketingDataAdd }) => ({
  loading,
  details: crmMarketingDataAdd.details,
  detailsPost: crmMarketingDataAdd.detailsPost,
  error: crmMarketingDataAdd.error,
  program: crmMarketingDataAdd.program,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, program }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const loadingSubmit = effects[`crmMarketingDataAdd/ADD_PROGRAM`];
    useEffect(() => {
      dispatch({
        type: 'crmMarketingDataAdd/GET_PROGRAM',
        payload: params,
      });
    }, [params.id]);

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'crmMarketingDataAdd/ADD_PROGRAM',
        payload: {
          ...details,
          ...values,
          data_marketing_id: params.id,
        },
        callback: (response, error) => {
          if (response) {
            history.goBack();
          }
          if (error) {
            if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
              error.data.errors.forEach((item) => {
                formRef.current.setFields([
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

    return (
      <>
        <Pane className="p20">
          <Breadcrumb separator=">" className={stylesModule['wrapper-breadcrumb']}>
            <Breadcrumb.Item>
              <Link to="/crm/tiep-thi/du-lieu" className={stylesModule.details}>
                Data marketing
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link
                to={`/crm/tiep-thi/du-lieu/${params.id}/chi-tiet?type=program`}
                className={stylesModule.details}
              >
                Chi tiết
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className={stylesModule.detailsEnd}>
              {params.detailId ? `${details?.name}` : 'Thêm bài viết'}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Pane>
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Pane className="col-lg-6 offset-lg-3">
            <Pane className="card">
              <Loading isError={error.isError} params={{ error }}>
                <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Thông tin thêm mới
                  </Heading>
                  <Pane className="row" {...marginProps}>
                    <Pane className="col-lg-12">
                      <FormItem
                        options={['id', 'name']}
                        name="marketing_program_id"
                        data={program}
                        placeholder="Chọn"
                        type={variables.SELECT}
                        label="Tên chương trình"
                      />
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="p20 d-flex justify-content-between align-items-center ">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                    Lưu
                  </Button>
                </Pane>
              </Loading>
            </Pane>
          </Pane>
        </Form>
      </>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  program: PropTypes.arrayOf(PropTypes.any),
  district: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  branches: [],
  classes: [],
  program: [],
  district: [],
};

export default withRouter(connect(mapStateToProps)(General));
