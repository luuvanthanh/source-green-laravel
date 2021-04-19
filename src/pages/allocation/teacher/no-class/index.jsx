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
const { confirm } = Modal;
const mapStateToProps = ({ allocationTeacherNoClass, loading }) => ({
  loading,
  data: allocationTeacherNoClass.data,
  pagination: allocationTeacherNoClass.pagination,
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
    const loading = effects['allocationTeacherNoClass/GET_DATA'];
    return (
      <Form layout="vertical" initialValues={{}} colon={false} ref={this.formRef}>
        <Helmet title="Điều chuyển giáo viên" />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-allocationTeacherNoClass'],
          )}
        >
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Giáo viên</Text>
          </div>
          {/* TABS LINK */}
          <div className="d-flex align-items-center mt-3 mb-3">
            <div className={stylesAllocation['tabs-link']}>
              <NavLink
                to="/phan-bo/giao-vien/chua-xep-lop"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Giáo viên chưa xếp lớp
              </NavLink>
              <NavLink
                to="/phan-bo/giao-vien/danh-sach"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Danh sách giáo viên và trẻ
              </NavLink>
              <NavLink
                to="/phan-bo/giao-vien/dieu-chuyen"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Điều chuyển giáo viên
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
                    Danh sách giáo viên chưa xếp lớp
                  </Text>
                </div>
                <Scrollbars autoHeight autoHeightMax={window.innerHeight - 444}>
                  <List
                    className={stylesAllocation.list}
                    dataSource={[
                      { id: 1, name: 'Nguyễn Văn Tuyết', age: 'Giáo viên chủ nhiệm' },
                      { id: 2, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                      { id: 3, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                      { id: 8, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                      { id: 9, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                      { id: 10, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                      { id: 11, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                      { id: 12, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                      { id: 13, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                      { id: 14, name: 'Trần Văn Phú', age: 'Giáo viên chủ nhiệm' },
                    ]}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <Checkbox className={stylesAllocation.checkbox} />
                        <div className={stylesAllocation['group-info']}>
                          <Avatar shape="square" size={40} icon={<UserOutlined />} />
                          <div className={stylesAllocation['info']}>
                            <h3 className={stylesAllocation['title']}>Lê Xuân Thanh</h3>
                            <p className={stylesAllocation['norm']}>Giáo viên</p>
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
                    Đã chọn 1 giáo viên
                  </Text>
                  <Button color="success" size="large" className="ml-auto">
                    Xếp lớp
                  </Button>
                </div>
              </div>
            </div>
            <div className={stylesAllocation['right-container']}>
              <div className={stylesAllocation['content']}>
                <div className={stylesAllocation['heading']}>
                  <Text color="dark" size="large-medium">
                    Danh sách cơ sở/lớp
                  </Text>
                </div>
                <div className={stylesAllocation['content-form']}>
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
