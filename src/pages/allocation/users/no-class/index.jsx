import React, { PureComponent } from 'react';
import { connect, NavLink } from 'umi';
import { Form, List, Avatar, Checkbox } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import { UserOutlined } from '@ant-design/icons';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import PropTypes from 'prop-types';
import stylesAllocation from '@/assets/styles/Modules/Allocation/styles.module.scss';
import { Scrollbars } from 'react-custom-scrollbars';

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
const mapStateToProps = ({ allocationUsersNoClass, loading }) => ({
  loading,
  data: allocationUsersNoClass.data,
  pagination: allocationUsersNoClass.pagination,
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
    const loading = effects['allocationUsersNoClass/GET_DATA'];
    return (
      <Form layout="vertical" initialValues={{}} colon={false} ref={this.formRef}>
        <Helmet title="Điều chuyển nhân viên" />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-children'],
          )}
        >
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Nhân viên</Text>
          </div>
          {/* TABS LINK */}
          <div className="d-flex align-items-center mt-3 mb-3">
            <div className={stylesAllocation['tabs-link']}>
              <NavLink
                to="/phan-bo/nhan-vien/danh-sach"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Danh sách
              </NavLink>
              <NavLink
                to="/phan-bo/nhan-vien/dieu-chuyen"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Điều chuyển
              </NavLink>
              <NavLink
                to="/phan-bo/nhan-vien/chua-xep-lop"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Nhân viên chưa sắp xếp
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
                    Danh sách nhân viên
                  </Text>
                </div>
                <Scrollbars autoHeight autoHeightMax={window.innerHeight - 333}>
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
                            <h3 className={stylesAllocation['title']}>Nguyễn Văn Tuấn</h3>
                            <p className={stylesAllocation['norm']}>
                              Hành chính nhân sự - Ghi danh - Nhân viên
                            </p>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Scrollbars>
              </div>
              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Text color="dark" size="normal">
                    Đã chọn 1 nhân viên
                  </Text>
                </div>
              </div>
            </div>
            <div className={stylesAllocation['right-container']}>
              <div className={stylesAllocation['content']}>
                <div className={stylesAllocation['heading']}>
                  <Text color="dark" size="large-medium">
                    Thông tin xếp lớp
                  </Text>
                </div>
                <div className={stylesAllocation['content-form']}>
                  <div className="row mt-3">
                    <div className="col-lg-4">
                      <FormItem
                        label="Cơ sở"
                        name="location"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Bộ phận"
                        name="division"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Chức vụ"
                        name="position"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.INPUT_PASSWORD}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-3">
                    <div className="col-lg-4">
                      <FormItem
                        label="Hình thức làm việc"
                        name="workForm"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Vai trò"
                        name="role_id"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Thời gian điều chuyển"
                        name="date"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.DATE_PICKER}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Button color="success" size="large" className="ml-auto">
                    Xếp lớp
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
