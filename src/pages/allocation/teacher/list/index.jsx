import React, { PureComponent } from 'react';
import { connect, history, NavLink } from 'umi';
import { Modal, Form, Tabs, List, Avatar, Checkbox } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { debounce } from 'lodash';
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
const mapStateToProps = ({ allocationTeacherList, loading }) => ({
  loading,
  data: allocationTeacherList.data,
  pagination: allocationTeacherList.pagination,
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
      visible: false,
      search: {
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      objects: {},
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
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

  /**
   * Function load data
   */
  onLoad = () => {
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'allocationTeacherList/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(`${pathname}?${Helper.convertParamSearchConvert(search, variables.QUERY_STRING)}`);
  };

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearch = debounce((value, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [`${type}`]: value,
        },
      }),
      () => this.onLoad(),
    );
  }, 300);

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChange = (e, type) => {
    this.debouncedSearch(e.target.value, type);
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
  };

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
    const loading = effects['allocationTeacherList/GET_DATA'];
    return (
      <Form layout="vertical" initialValues={{}} colon={false} ref={this.formRef}>
        <Helmet title="Danh sách" />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-allocationTeacherList'],
          )}
        >
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Giáo viên</Text>
          </div>
          {/* TABS LINK */}
          <div className="d-flex align-items-center mt-3 mb-3">
            <div className={stylesAllocation['tabs-link']}>
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
          <div className={stylesAllocation['wrapper-container']}>
            <div className={stylesAllocation['search-container']}>
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="position"
                    rules={[variables.RULES.EMPTY]}
                    onChange={(event) => this.onChangeSelect(event, 'startDate')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="class"
                    rules={[variables.RULES.EMPTY]}
                    onChange={(event) => this.onChangeSelect(event, 'class')}
                    type={variables.SELECT}
                  />
                </div>
              </div>
            </div>
            {/* MAIN CONTAINER */}
            <div className={stylesAllocation['main-container']}>
              <div className={stylesAllocation['left-container']}>
                <div className={stylesAllocation['content']}>
                  <div className={stylesAllocation['heading']}>
                    <Text color="dark" size="large-medium">
                      Danh sách trẻ chưa xếp lớp
                    </Text>
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
              </div>
              <div className={stylesAllocation['right-container']}>
                <div className={stylesAllocation['content']}>
                  <div className={stylesAllocation['heading']}>
                    <Text color="dark" size="large-medium">
                      Danh sách cơ sở/lớp
                    </Text>
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
                </div>
              </div>
            </div>
            {/* MAIN CONTAINER */}
          </div>
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
