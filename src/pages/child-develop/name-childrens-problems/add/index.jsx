import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import { isEmpty, head } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';

let isMounted = true;
/**
 * Set isMounted
 * @param {boolean} value
 * @returns {boolean} value of isMounted
 */
const setIsMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};
/**
 * Get isMounted
 * @returns {boolean} value of isMounted
 */
const getIsMounted = () => isMounted;
const mapStateToProps = ({ menu, loading, childDevelopNameChildProblemsAdd }) => ({
  loading,
  menuData: menu.menuLeftChildDevelop,
  details: childDevelopNameChildProblemsAdd.details,
  error: childDevelopNameChildProblemsAdd.error,
  paramaterValues: childDevelopNameChildProblemsAdd.paramaterValues,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
    setIsMounted(true);
  }

  cancel = (id) => {
    const { dispatch } = this.props;
    return Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'childDevelopNameChildProblemsAdd/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    });
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'childDevelopNameChildProblemsAdd/GET_DETAILS',
        payload: params,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && params.id) {
      this.formRef.current.setFieldsValue({
        ...details,
      });
    }
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  /**
   * Set state properties
   * @param {object} data the data input
   * @param {function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof setStateData
   */
  setStateData = (state, callback) => {
    if (!getIsMounted()) {
      return;
    }
    this.setState(state, callback);
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const payload = {
      ...values,
      id: params.id,
    };
    dispatch({
      type: params.id ? 'childDevelopNameChildProblemsAdd/UPDATE' : 'childDevelopNameChildProblemsAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              this.formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  render() {
    const {
      error,
      menuData,
      loading: { effects },
      match: { params },
    } = this.props;
    const loadingSubmit = effects['childDevelopNameChildProblemsAdd/ADD'] || effects['childDevelopNameChildProblemsAdd/UPDATE'];
    const loading = effects['childDevelopNameChildProblemsAdd/GET_DETAILS'];
    return (
      <>
        <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuData} />
        <Pane className="col-lg-6 offset-lg-3">
          <Form
            className={styles['layout-form']}
            layout="vertical"
            colon={false}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <div className={styles['content-form']}>
                <Pane className="pl20 pr20 mt20">
                  <Pane className="card">
                    <Pane className="p20">
                      <Heading type="form-title" className="mb20">
                        Thông tin thêm mới
                      </Heading>
                      <Pane className="row mt20">
                        <Pane className="col-lg-12">
                          <FormItem label="Tên kỳ đánh giá" name="name" type={variables.INPUT} rules={[variables.RULES.EMPTY]} />
                        </Pane>
                      </Pane>
                    </Pane>
                    <Pane className="p20 d-flex justify-content-between align-items-center border-top">
                      <p
                        className="btn-delete"
                        role="presentation"

                        onClick={() => history.goBack()}
                      >
                        Hủy
                      </p>
                      <Button
                        className="ml-auto px25"
                        color="success"
                        htmlType="submit"
                        size="large"
                        loading={loadingSubmit}
                      >
                        Lưu
                      </Button>
                    </Pane>
                  </Pane>
                </Pane>
              </div>
            </Loading>
          </Form>
        </Pane>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  menuData: [],
  loading: {},
  dispatch: {},
  error: {},
  details: {},
};

export default Index;
