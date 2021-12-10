import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { isEmpty, get, toString } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
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
const mapStateToProps = ({ menu, loading, typeOfContractsAdd }) => ({
  loading,
  menuData: menu.menuLeftHRM,
  details: typeOfContractsAdd.details,
  error: typeOfContractsAdd.error,
  paramaterValues: typeOfContractsAdd.paramaterValues,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      isUnlimited: false,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'typeOfContractsAdd/GET_DETAILS',
        payload: params,
      });
    }
    dispatch({
      type: 'typeOfContractsAdd/GET_PARAMATER_VALUES',
      payload: {
        ...params,
        type: 'CONTRACT',
      },
    });
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        ...details,
        month: toString(details.month),
        paramValue: details.parameterValues.map((item) => item.id),
      });
      this.onSetUnLimited(details.isUnlimited);
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

  onSetUnLimited = (isUnlimited) => {
    this.setStateData({
      isUnlimited,
    });
  };

  onChangeUnLimited = (e) => {
    this.setStateData({
      isUnlimited: e.target.checked,
    });
    this.formRef.current.setFieldsValue({
      month: 0,
      year: 0,
    });
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
      type: params.id ? 'typeOfContractsAdd/UPDATE' : 'typeOfContractsAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              this.formRef.current.setFields([
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

  render() {
    const {
      error,
      menuData,
      loading: { effects },
      paramaterValues,
      match: { params },
    } = this.props;
    const { isUnlimited } = this.state;
    const loadingSubmit = effects['typeOfContractsAdd/ADD'] || effects['typeOfContractsAdd/UPDATE'];
    const loading =
      effects['typeOfContractsAdd/GET_DETAILS'] ||
      effects['typeOfContractsAdd/GET_PARAMATER_VALUES'] ||
      effects['typeOfContractsAdd/GET_PARAMATER_FORMULAS'];
    return (
      <>
        <Breadcrumbs
          last={params.id ? 'Chỉnh sửa loại hợp đồng' : 'Tạo loại hợp đồng'}
          menu={menuData}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <Loading
            loading={loading}
            isError={error.isError}
            params={{ error, goBack: '/quan-ly-nhan-su/cau-hinh/loai-hop-dong' }}
          >
            <div className={styles['content-form']}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      label="MÃ"
                      name="code"
                      rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="TÊN"
                      name="name"
                      rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      label="PHÂN LOẠI"
                      name="type"
                      data={[
                        {
                          id: 'THU_VIEC',
                          name: 'Thử việc',
                        },
                        {
                          id: 'HOP_DONG',
                          name: 'Hợp đồng',
                        },
                        {
                          id: 'THOI_VU',
                          name: 'Thời vụ',
                        },
                      ]}
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      className="checkbox-small"
                      label="VÔ THỜI HẠN"
                      name="isUnlimited"
                      type={variables.CHECKBOX_FORM}
                      valuePropName="checked"
                      onChange={this.onChangeUnLimited}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="SỐ NĂM"
                      name="year"
                      rules={
                        !isUnlimited
                          ? [variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]
                          : []
                      }
                      type={variables.INPUT}
                      disabled={isUnlimited}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="SỐ THÁNG"
                      name="month"
                      rules={
                        !isUnlimited
                          ? [variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]
                          : []
                      }
                      type={variables.INPUT}
                      disabled={isUnlimited}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={paramaterValues}
                      label="THAM SỐ GIÁ TRỊ"
                      name="paramValue"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT_MUTILPLE}
                    />
                  </div>
                </div>
              </div>
              <div className={classnames('d-flex', 'justify-content-center', 'mt-4')}>
                <Button
                  color="gray"
                  icon="prev"
                  onClick={() => history.goBack()}
                  size="large"
                  className="mr-3"
                  loading={loadingSubmit}
                >
                  HỦY
                </Button>
                <Button
                  color="green"
                  htmlType="submit"
                  icon="save"
                  size="large"
                  loading={loadingSubmit}
                >
                  LƯU
                </Button>
              </div>
            </div>
          </Loading>
        </Form>
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
  paramaterValues: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  menuData: [],
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  paramaterValues: [],
};

export default Index;
