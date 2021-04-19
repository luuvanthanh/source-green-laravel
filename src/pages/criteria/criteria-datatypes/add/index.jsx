import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { isEmpty, get, omit, head } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
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
const mapStateToProps = ({ menu, loading, criteriaDatatypesAdd }) => ({
  menuData: menu.menuLeftCriteria,
  loading,
  details: criteriaDatatypesAdd.details,
  error: criteriaDatatypesAdd.error,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      type: null,
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
        type: 'criteriaDatatypesAdd/GET_DETAILS',
        payload: params,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      if (details.type === 'select') {
        this.formRef.current.setFieldsValue({
          ...details,
          value: JSON.parse(details.value),
        });
      } else {
        this.formRef.current.setFieldsValue({
          ...details,
        });
      }

      this.setStateData({
        type: details.type,
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

  onChangeType = (type) => {
    this.setStateData(
      {
        type,
      },
      () => {
        this.formRef.current.setFieldsValue({
          value: undefined,
        });
      },
    );
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { type } = this.state;
    let payload = {
      ...values,
      id: get(params, 'id'),
    };
    if (type === 'radioButton' || type === 'select') {
      payload = {
        ...payload,
        value: JSON.stringify(values.value),
      };
    }
    dispatch({
      type: params?.id ? 'criteriaDatatypesAdd/UPDATE' : 'criteriaDatatypesAdd/ADD',
      payload: params?.id ? payload : omit(payload, 'id'),
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
      dataSelect,
      loading: { effects },
    } = this.props;
    const { type } = this.state;
    const loadingSubmit =
      effects['criteriaDatatypesAdd/ADD'] || effects['criteriaDatatypesAdd/UPDATE'];
    const loading = effects['criteriaDatatypesAdd/GET_DETAILS'];
    return (
      <>
        <Breadcrumbs last="Tạo kiểu dữ liệu" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      label="MÃ"
                      name="key"
                      rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={[
                        {
                          id: 'textbox',
                          name: 'textbox',
                        },
                        {
                          id: 'radioButton',
                          name: 'radioButton',
                        },
                        {
                          id: 'select',
                          name: 'select',
                        },
                        {
                          id: 'number',
                          name: 'number',
                        },
                      ]}
                      label="LOẠI"
                      name="type"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                      onChange={this.onChangeType}
                    />
                  </div>
                </div>
                <div className="row">
                  {type === 'textbox' && (
                    <div className="col-lg-6">
                      <FormItem label="GIÁ TRỊ" name="value" type={variables.INPUT} />
                    </div>
                  )}
                  {type === 'select' && (
                    <div className="col-lg-6">
                      <FormItem label="GIÁ TRỊ" name="value" type={variables.SELECT_TAGS} />
                    </div>
                  )}
                  {type === 'radioButton' && (
                    <div className="col-lg-6">
                      <FormItem label="GIÁ TRỊ" name="value" type={variables.SELECT_TAGS} />
                    </div>
                  )}
                  {type === 'number' && (
                    <div className="col-lg-6">
                      <FormItem label="GIÁ TRỊ" name="value" type={variables.INPUT_COUNT} />
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      label="Hiển thị ghi chú"
                      name="isHasNote"
                      type={variables.SWITCH}
                      valuePropName="checked"
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
                  loading={loadingSubmit || loading}
                >
                  HỦY
                </Button>
                <Button
                  color="green"
                  htmlType="submit"
                  icon="save"
                  size="large"
                  loading={loadingSubmit || loading}
                >
                  LƯU
                </Button>
              </div>
            </Loading>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {};

export default Index;
