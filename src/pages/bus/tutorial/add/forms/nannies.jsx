import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, head } from 'lodash';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import { Scrollbars } from 'react-custom-scrollbars';
import variablesModules from '../../../utils/variables';

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
const mapStateToProps = ({ tutorialAddV2, loading, menu }) => ({
  loading,
  error: tutorialAddV2.error,
  details: tutorialAddV2.details,
  employees: tutorialAddV2.employees,
  menuData: menu.menuLeftSchedules,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      dayOfWeeks: [],
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadCategories();
    const { details } = this.props;
    if (!isEmpty(details?.busRouteNannies)) {
      let dayOfWeeks = [];
      details?.busRouteNannies?.forEach((item) => {
        if (item?.dayOfWeeks) {
          dayOfWeeks = [...dayOfWeeks, ...item?.dayOfWeeks];
        }
      });
      this.setStateData({ dayOfWeeks });
      this.formRef?.current?.setFieldsValue({
        busRouteNannies: details?.busRouteNannies,
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

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tutorialAddV2/GET_EMPLOYEES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      details,
      match: { params },
    } = this.props;
    dispatch({
      type: 'tutorialAddV2/UPDATE',
      payload: {
        ...details,
        ...values,
        id: params?.id,
      },
      callback: (response, error) => {
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

  onChangeTime = () => {
    const data = this.formRef.current.getFieldsValue();
    let dayOfWeeks = [];
    data?.busRouteNannies?.forEach((item) => {
      if (item?.dayOfWeeks) {
        dayOfWeeks = [...dayOfWeeks, ...item?.dayOfWeeks];
      }
    });
    this.setStateData({ dayOfWeeks });
  }

  render() {
    const {
      error,
      employees,
      loading: { effects },
    } = this.props;
    const { dayOfWeeks } = this.state;
    const loading = effects['tutorialAddV2/GET_DETAILS'] || effects['tutorialAddV2/GET_EMPLOYEES'];
    const loadingSubmit = effects['tutorialAddV2/ADD'] || effects['tutorialAddV2/UPDATE'];
    return (
      <Form
        layout="vertical"
        ref={this.formRef}
        onFinish={this.onFinish}
      >
        <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
          <div className="card">
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title">Thông tin bảo mẫu</Heading>
              <Form.List name="busRouteNannies">
                {(fields, { add, remove }) => (
                  <div>
                    <Scrollbars
                      autoHeight
                      autoHeightMax={window.innerHeight - 350}
                      renderTrackHorizontal={(props) => (
                        <div {...props} className="track-horizontal" style={{ display: 'none' }} />
                      )}
                      renderThumbHorizontal={(props) => (
                        <div {...props} className="thumb-horizontal" style={{ display: 'none' }} />
                      )}
                    >
                      <div id="scroll-container">
                        {fields.map((field, index) => (
                          <div key={index}>
                            <div className="d-flex justify-content-between align-items-center pr10">
                              <Heading type="form-block-title">BẢO MẪU {index + 1}</Heading>
                              {fields?.length > 1 && (
                                <button
                                  type="button"
                                  className={styles['button-remove']}
                                  onClick={() => remove(field.name)}
                                >
                                  <span className="icon-remove" />
                                </button>
                              )}
                            </div>
                            <div className="row">
                              <div className="col-lg-12">
                                <FormItem
                                  data={variablesModules.DAYS}
                                  label="Thời gian"
                                  onChange={this.onChangeTime}
                                  fieldKey={[field.fieldKey, 'dayOfWeeks']}
                                  name={[field.name, 'dayOfWeeks']}
                                  type={variables.SELECT_MUTILPLE}
                                  rules={[variables.RULES.EMPTY]}
                                  disabledOptions={dayOfWeeks}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12">
                                <FormItem
                                  data={Helper.convertSelectUsers(employees)}
                                  label="Bảo mẫu"
                                  fieldKey={[field.fieldKey, 'nannyId']}
                                  name={[field.name, 'nannyId']}
                                  type={variables.SELECT}
                                  rules={[variables.RULES.EMPTY]}
                                />
                              </div>
                            </div>
                            <hr />
                          </div>
                        ))}
                      </div>
                    </Scrollbars>
                    <p
                      className={styles['button-plus']}
                      role="presentation"
                      onClick={async () => {
                        await add();
                        if (document.getElementById('scroll-container')) {
                          document.getElementById('scroll-container').scrollIntoView({
                            behavior: 'smooth',
                            block: 'end',
                            inline: 'nearest',
                          });
                        }
                      }}
                    >
                      <span className="icon-plus-circle" /> THÊM BẢO MẪU
                    </p>
                  </div>
                )}
              </Form.List>
            </div>

            <div className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                Lưu
              </Button>
            </div>
          </div>
        </Loading>
      </Form>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  employees: [],
};

export default withRouter(Index);
