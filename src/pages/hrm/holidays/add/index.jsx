import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
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
const mapStateToProps = ({ menu, holidaysAdd, loading }) => ({
  loading,
  categories: holidaysAdd.categories,
  details: holidaysAdd.details,
  menuData: menu.menuLeftHRM,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabledDate: true,
    };
    setIsMounted(true);
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'holidaysAdd/GET_DETAILS',
        payload: params,
      });
    }
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        ...details,
        startDate: details.startDate && moment(details.startDate),
        endDate: details.endDate && moment(details.endDate),
        year: details.year && moment(details.year, variables.DATE_FORMAT.YEAR),
      });
    }
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
      type: 'holidaysAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    let payload = {};
    if (params.id) {
      payload = {
        name: moment(values.year).format(variables.DATE_FORMAT.YEAR),
        updateRows: [{ ...values, id: params.id }],
      };
    } else {
      payload = {
        name: moment(values.year).format(variables.DATE_FORMAT.YEAR),
        createRows: [{ ...values }],
      };
    }
    dispatch({
      type: params.id ? 'holidaysAdd/UPDATE' : 'holidaysAdd/ADD',
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

  onChangeYear = (values) => {
    this.formRef?.current?.setFieldsValue({ startDate: null, endDate: null });
    this.setStateData({ disabledDate: !values });
  };

  render() {
    const {
      menuData,
      match: { params },
      loading: { effects },
    } = this.props;
    const { disabledDate } = this.state;
    const loadingSubmit = effects['holidaysAdd/ADD'] || effects['holidaysAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last={params.id ? 'Tạo ngày nghỉ lễ' : 'Tạo ngày nghỉ lễ'} menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <div className={classnames(styles['content-children'], 'mt10')}>
              <Text color="dark" size="large-medium">
                THÔNG TIN CHUNG
              </Text>
              <div className="row">
                <div className="col-lg-6">
                  <FormItem
                    label="Năm"
                    name="year"
                    onChange={this.onChangeYear}
                    type={variables.YEAR_PICKER}
                    allowClear={false}
                    placeholder="Năm"
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="Từ ngày"
                    name="startDate"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    disabled={disabledDate}
                    disabledDate={(current) =>
                      Helper.disabledDateFrom(current, this.formRef, 'endDate', { yearKey: 'year' })
                    }
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="Đến ngày"
                    name="endDate"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    disabled={disabledDate}
                    disabledDate={(current) =>
                      Helper.disabledDateTo(current, this.formRef, 'startDate', { yearKey: 'year' })
                    }
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="Tên ngày lễ"
                    name="name"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
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
                icon="save"
                htmlType="submit"
                size="large"
                loading={loadingSubmit}
              >
                LƯU
              </Button>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  loading: {},
  dispatch: {},
  match: {},
  menuData: [],
  details: {},
};

export default Index;
