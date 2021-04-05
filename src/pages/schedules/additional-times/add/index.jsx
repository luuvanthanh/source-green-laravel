import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
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
const mapStateToProps = ({ menu, additionalTimesAdd, loading }) => ({
  loading,
  categories: additionalTimesAdd.categories,
  menuLeftSchedules: menu.menuLeftSchedules,
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

  componentDidMount() {
    this.loadCategories();
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
      type: 'additionalTimesAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'additionalTimesAdd/UPDATE',
        payload: {
          user_id: values.user_id,
          data: [
            {
              days: values.days,
              hours: values.hours,
              reason: values.reason,
              end_date: moment(values.month).startOf('month'),
              start_date: moment(values.month).endOf('month'),
            },
          ],
          id: params.id,
        },
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
    } else {
      dispatch({
        type: 'additionalTimesAdd/ADD',
        payload: {
          user_id: values.user_id,
          data: [
            {
              days: values.days,
              hours: values.hours,
              reason: values.reason,
              end_date: moment(values.month).startOf('month'),
              start_date: moment(values.month).endOf('month'),
            },
          ],
        },
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
    }
  };

  render() {
    const {
      categories,
      menuLeftSchedules,
      loading: { effects },
    } = this.props;
    const loadingSubmit = effects['additionalTimesAdd/GET_DATA'];
    return (
      <>
        <Breadcrumbs last="Tạo công thêm" menu={menuLeftSchedules} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <div className="d-flex justify-content-between">
              <Text color="dark">TẠO CÔNG THÊM</Text>
            </div>
            <div className={styles['content-children']}>
              <Text color="dark" size="large-medium">
                THÔNG TIN CHUNG
              </Text>
              <div className="row mt-3">
                <div className="col-lg-6">
                  <FormItem
                    data={
                      categories?.users.map((item) => ({
                        id: item.id,
                        name: item.full_name,
                      })) || []
                    }
                    label="NHÂN VIÊN"
                    name="user_id"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="THÁNG"
                    name="month"
                    type={variables.MONTH_PICKER}
                    picker="month"
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <FormItem label="SỐ NGÀY CÔNG" name="days" type={variables.INPUT_COUNT} />
                </div>
                <div className="col-lg-6">
                  <FormItem label="SỐ GIỜ CÔNG" name="hours" type={variables.INPUT_COUNT} />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    label="LÝ DO"
                    name="reason"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.TEXTAREA}
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

Index.propTypes = {};

export default Index;
