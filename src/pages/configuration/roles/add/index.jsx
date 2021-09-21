import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { isEmpty, head } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import PropTypes from 'prop-types';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

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
const mapStateToProps = ({ configurationRolesAdd, loading, menu }) => ({
  loading,
  error: configurationRolesAdd.error,
  details: configurationRolesAdd.details,
  codes: configurationRolesAdd.codes,
  menuConfiguration: menu.menuConfiguration,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
    setIsMounted(true);
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

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: 'configurationRolesAdd/GET_CODES',
      payload: { ...params },
    });
    if (params.id) {
      dispatch({
        type: 'configurationRolesAdd/GET_DETAILS',
        payload: { ...params },
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

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const payload = {
      ...values,
      ...params,
    };
    dispatch({
      type: params?.id ? 'configurationRolesAdd/UPDATE' : 'configurationRolesAdd/ADD',
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
      codes,
      loading: { effects },
      menuConfiguration,
      match: { params },
    } = this.props;
    const loading = effects['configurationRolesAdd/GET_DETAILS'];
    const loadingSubmit =
      effects['configurationRolesAdd/ADD'] || effects['configurationRolesAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last={params.id ? 'Sửa vai trò' : 'Tạo vai trò'} menu={menuConfiguration} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          onFinish={this.onFinish}
          initialValues={{ isShowAllBranch: false }}
          ref={this.formRef}
        >
          <div className="pl20 pr20">
            <div className="row">
              <div className="col-lg-6 offset-lg-3">
                <Loading
                  loading={loading}
                  isError={error.isError}
                  params={{ error, goBack: '/cau-hinh/vai-tro' }}
                >
                  <div className={styles['content-form']}>
                    <div className={classnames(styles['content-children'], 'mt10')}>
                      <Text color="dark" size="large-medium">
                        Thông tin vai trò
                      </Text>
                      <div className="row mt-3">
                        <div className="col-lg-6">
                          <FormItem
                            label="Tên vai trò"
                            name="name"
                            rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                            type={variables.INPUT}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormItem
                            data={codes.map((item) => ({ id: item, name: item }))}
                            label="Mã vai trò"
                            name="code"
                            type={variables.SELECT}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <FormItem
                            data={[
                              { value: true, label: 'Xem toàn bộ' },
                              { value: false, label: 'Xem theo cơ sở' },
                            ]}
                            name="isShowAllBranch"
                            type={variables.RADIO}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={classnames(
                        'd-flex',
                        'justify-content-center',
                        'justify-content-between',
                        'mt-4',
                      )}
                    >
                      <p
                        className="btn-delete"
                        role="presentation"
                        onClick={() => history.goBack()}
                      >
                        Hủy
                      </p>
                      <Button
                        color="green"
                        icon="save"
                        htmlType="submit"
                        size="large"
                        loading={loadingSubmit || loading}
                      >
                        LƯU
                      </Button>
                    </div>
                  </div>
                </Loading>
              </div>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  menuConfiguration: PropTypes.arrayOf(PropTypes.any),
  codes: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  menuConfiguration: [],
  codes: [],
};

export default Index;
