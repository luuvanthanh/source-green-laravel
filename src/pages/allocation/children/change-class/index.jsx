import React, { PureComponent } from 'react';
import { connect, history, NavLink } from 'umi';
import { Modal, Form, Tabs, List, Avatar, Checkbox } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import { UserOutlined } from '@ant-design/icons';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import stylesAllocation from '@/assets/styles/Modules/Allocation/styles.module.scss';

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
const { confirm } = Modal;
const mapStateToProps = ({ allocationChangeClass, loading }) => ({
  loading,
  data: allocationChangeClass.data,
  pagination: allocationChangeClass.pagination,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      search: {},
    };
    setIsMounted(true);
  }

  componentDidMount() {}

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

  render() {
    const {
      match: { params },
      loading: { effects },
    } = this.props;
    const loading = effects['allocationChangeClass/GET_DATA'];
    return (
      <Form layout="vertical" initialValues={{}} colon={false} ref={this.formRef}>
        <Helmet title="Chuyển lớp" />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-allocationChangeClass'],
          )}
        >
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Học sinh</Text>
          </div>
          {/* TABS LINK */}
          <div className="d-flex align-items-center mt-3 mb-3">
            <div className={stylesAllocation['tabs-link']}>
              <NavLink
                to="/phan-bo/hoc-sinh/tre-chua-xep-lop"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Trẻ chưa xếp lớp
              </NavLink>
              <NavLink
                to="/phan-bo/hoc-sinh/chuyen-lop"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Chuyển lớp
              </NavLink>
            </div>
          </div>
          {/* TABS LINK */}
          {/* MAIN CONTAINER */}
          <div className={stylesAllocation['main-container']}>
            <div className={stylesAllocation['left-container']}>
              <div className={stylesAllocation['content']}>
                <div className={stylesAllocation['heading']}>
                  <Text color="dark" size="large-medium">
                    Danh sách trẻ
                  </Text>
                </div>
                <div className={stylesAllocation['content-form']}>
                  <div className="row mt-3">
                    <div className="col-lg-6">
                      <FormItem
                        label="Cơ sở"
                        name="position"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                    <div className="col-lg-6">
                      <FormItem
                        label="Lớp"
                        name="class"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                  </div>
                  <hr />
                </div>
                <List
                  className={stylesAllocation.list}
                  dataSource={[
                    { id: 1, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 2, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 3, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 4, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 5, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 6, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 7, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 8, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 9, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 10, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 11, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 12, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 13, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                    { id: 14, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  ]}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
                      <Checkbox className={stylesAllocation.checkbox} />
                      <div className={stylesAllocation['group-info']}>
                        <Avatar shape="square" size={40} icon={<UserOutlined />} />
                        <div className={stylesAllocation['info']}>
                          <h3 className={stylesAllocation['title']}>Su beo</h3>
                          <p className={stylesAllocation['norm']}>32 tháng tuổi</p>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Text color="dark" size="normal">
                    Đã chọn 2 bé
                  </Text>
                </div>
              </div>
            </div>
            <div className={stylesAllocation['right-container']}>
              <div className={stylesAllocation['content']}>
                <div className={stylesAllocation['heading']}>
                  <Text color="dark" size="large-medium">
                    Thông tin chuyển lớp
                  </Text>
                </div>
                <div className={stylesAllocation['content-form']}>
                  <div className="row mt-3">
                    <div className="col-lg-6">
                      <FormItem
                        label="Cơ sở"
                        name="position"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                    <div className="col-lg-6">
                      <FormItem
                        label="Lớp"
                        name="class"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <FormItem
                        label="Chọn lớp để xếp"
                        name="radio"
                        type={variables.RADIO}
                        data={[
                          { value: '1', label: 'Lớp preschool 1' },
                          { value: '2', label: 'Lớp preschool 2' },
                          { value: '3', label: 'Lớp preschool 3' },
                        ]}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <FormItem label="Ngày vào lớp" name="date" type={variables.DATE_PICKER} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Button color="success" size="large" className="ml-auto">
                    Chuyển lớp
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* MAIN CONTAINER */}
        </div>
      </Form>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
