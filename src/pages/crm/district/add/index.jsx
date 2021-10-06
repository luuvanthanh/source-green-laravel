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
import { variables } from '@/utils';
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
const mapStateToProps = ({ menu, loading, crmDistrictsAdd }) => ({
  loading,
  menuData: menu.menuLeftCRM,
  details: crmDistrictsAdd.details,
  error: crmDistrictsAdd.error,
  city: crmDistrictsAdd.city,
  paramaterValues: crmDistrictsAdd.paramaterValues,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
    setIsMounted(true);
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: 'crmDistrictsAdd/GET_CITY',
      payload: params,
    });
    if (params.id) {
      dispatch({
        type: 'crmDistrictsAdd/GET_DETAILS',
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
      type: params.id ? 'crmDistrictsAdd/UPDATE' : 'crmDistrictsAdd/ADD',
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
      city,
      loading: { effects },
      match: { params },
    } = this.props;
    const loadingSubmit = effects['crmDistrictsAdd/ADD'] || effects['crmDistrictsAdd/UPDATE'];
    const loading = effects['crmDistrictsAdd/GET_DETAILS'];
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
                          <FormItem label="Tên quận huyện" name="name" type={variables.INPUT} />
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem
                            options={['id', 'name']}
                            name="city_id"
                            data={city}
                            placeholder="Chọn"
                            type={variables.SELECT}
                            label="Thuộc tỉnh thành"
                          />
                        </Pane>
                      </Pane>
                    </Pane>
                  </Pane>
                  <Pane className="p20 d-flex justify-content-between align-items-center border-top">
                    <p
                      className="btn-delete"
                      role="presentation"
                      loading={loadingSubmit}
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
  city: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  menuData: [],
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  city: [],
};

export default Index;
