import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect, NavLink } from 'umi';
import { Form, List, Radio } from 'antd';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';

import Text from '@/components/CommonComponent/Text';
import FormItem from '@/components/CommonComponent/FormItem';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import stylesAllocation from '@/assets/styles/Modules/Allocation/styles.module.scss';
import { isEmpty } from 'lodash';

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
const mapStateToProps = ({ loading, user }) => ({
  loading,
  defaultBranch: user.defaultBranch,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      defaultBranch,
      location: { query },
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      branches: [],
      classes: [],
      students: [],
      teachers: [],
      search: {
        key: query?.key,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        branchId: query?.branchId || defaultBranch?.id,
        classId: query?.classId,
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.fetchBranches();
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

  fetchBranches = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'categories/GET_BRANCHES',
      callback: (res) => {
        if (res) {
          this.setStateData({
            branches: res?.parsePayload || [],
          });
        }
      },
    });
    if (search?.branchId) {
      dispatch({
        type: 'categories/GET_CLASSES',
        payload: {
          branch: search?.branchId,
        },
        callback: (res) => {
          if (res) {
            this.setStateData({
              classes: res?.items || [],
            });
          }
        },
      });
    }
  };

  fetchClasses = (branchId) => {
    const { dispatch } = this.props;
    this.formRef?.current?.resetFields(['class']);
    this.setStateData({
      teachers: [],
      students: [],
    });
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: branchId,
      },
      callback: (res) => {
        if (res) {
          this.setStateData({
            classes: res?.items || [],
          });
        }
      },
    });
  };

  changeClass = (classId) => {
    const { dispatch } = this.props;
    const payload = {
      class: classId,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    };

    dispatch({
      type: 'allocationTeacherList/GET_STUDENTS',
      payload: {
        isStoreStaus: 'false',
        ...payload
      },
      callback: (res, error) => {
        if (res) {
          this.setStateData({
            students: res?.items.map((item) => item?.student) || [],
          });
        }
        if (error) {
          this.setStateData({
            students: [],
          });
        }
      },
    });

    dispatch({
      type: 'allocationTeacherList/GET_TEACHERS',
      payload,
      callback: (res, error) => {
        if (res) {
          this.setStateData({
            teachers: res?.items.map((item) => ({ ...item?.employee, isLead: item?.isLead, idCheck: item?.id })) || [],
          });
        }
        if (error) {
          this.setStateData({
            teachers: [],
          });
        }
      },
    });
  };

  onChangeRadioTeacher = (e, id, teachers) => {
    const { dispatch } = this.props;
    this.setStateData({
      teachers: teachers.map((item) => ({ ...item, isLead: id === item?.idCheck })) || [],
    });
    dispatch({
      type: 'allocationTeacherList/ADD_RADIO_TEACHERS',
      payload: { check: e.target.checked, id },
      callback: () => {
      },
    });
  }

  render() {
    const {
      defaultBranch,
      location: { query },
    } = this.props;
    const { students, branches, classes, teachers, defaultBranchs } = this.state;
    return (
      <Form layout="vertical" ref={this.formRef} initialValues={{
        branch: query?.branchId || defaultBranch?.id,
      }}>
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
                to="/phan-bo/giao-vien/chua-xep-lop"
                activeClassName={stylesAllocation.active}
                className={stylesAllocation.link}
              >
                Giáo viên chưa xếp lớp
              </NavLink>
              <NavLink
                to="/phan-bo/giao-vien/danh-sach"
                activeClassName={stylesAllocation.active}
                className={stylesAllocation.link}
              >
                Danh sách giáo viên và trẻ
              </NavLink>
              <NavLink
                to="/phan-bo/giao-vien/dieu-chuyen"
                activeClassName={stylesAllocation.active}
                className={stylesAllocation.link}
              >
                Điều chuyển giáo viên
              </NavLink>
            </div>
          </div>
          {/* TABS LINK */}
          <div className={stylesAllocation['wrapper-container']}>
            <div className={stylesAllocation['search-container']}>
              <div className="row">
                {
                  !defaultBranch?.id && (
                    <div className="col-lg-3">
                      <FormItem
                        allowClear={false}
                        name="branch"
                        type={variables.SELECT}
                        placeholder="Chọn cơ sở"
                        onChange={this.fetchClasses}
                        data={branches}
                      />
                    </div>
                  )
                }
                {
                  defaultBranch?.id && (
                    <div className="col-lg-3">
                      <FormItem
                        allowClear={false}
                        name="branch"
                        type={variables.SELECT}
                        placeholder="Chọn cơ sở"
                        onChange={this.fetchClasses}
                        data={defaultBranchs}
                      />
                    </div>
                  )
                }
                <div className="col-lg-3">
                  <FormItem
                    name="class"
                    onChange={this.changeClass}
                    allowClear={false}
                    placeholder="Chọn lớp"
                    type={variables.SELECT}
                    data={classes}
                  />
                </div>
              </div>
            </div>
            {/* MAIN CONTAINER */}
            <div className={stylesAllocation['main-container']}>
              <div className={stylesAllocation['left-container']}>
                {!isEmpty(students) && (
                  <div className={stylesAllocation.content}>
                    <div className={stylesAllocation['heading-list']}>
                      <Text color="dark" size="large-medium">
                        Danh sách trẻ
                      </Text>
                    </div>
                    <Scrollbars autoHeight autoHeightMax={window.innerHeight - 340}>
                      <List
                        className={stylesAllocation.list}
                        dataSource={students}
                        renderItem={({ id, fullName, age, fileImage }, index) => (
                          <List.Item key={id + index}>
                            <div className={stylesAllocation['group-info']}>
                              <AvatarTable fileImage={Helper.getPathAvatarJson(fileImage)} />
                              <div className={stylesAllocation.info}>
                                <h3 className={stylesAllocation.title}>{fullName}</h3>
                                <p className={stylesAllocation.norm}>{age} tháng tuổi</p>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Scrollbars>
                  </div>
                )}
              </div>
              <div className={stylesAllocation['right-container']}>
                {!isEmpty(teachers) && (
                  <div className={stylesAllocation.content}>
                    <div className={stylesAllocation['heading-list']}>
                      <Text color="dark" size="large-medium">
                        Danh sách giáo viên
                      </Text>
                    </div>
                    <Scrollbars autoHeight autoHeightMax={window.innerHeight - 340}>
                      <Radio.Group value>
                        <List
                          className={stylesAllocation.list}
                          dataSource={teachers}
                          renderItem={({ id, fullName, fileImage, positionLevel, isLead, idCheck }, index) => (
                            <List.Item key={id + index}>
                              <Radio onChange={(e) => this.onChangeRadioTeacher(e, idCheck, teachers)} value={isLead}>
                                <div className={stylesAllocation['group-info']}>
                                  <AvatarTable fileImage={Helper.getPathAvatarJson(fileImage)} />
                                  <div className={stylesAllocation.info}>
                                    <h3 className={stylesAllocation.title}>{fullName}</h3>
                                    <p className={stylesAllocation.norm}>Chức vụ: {positionLevel?.position?.name}</p>
                                  </div>
                                </div>
                              </Radio>
                            </List.Item>
                          )}
                        />
                      </Radio.Group>
                    </Scrollbars>
                  </div>
                )}
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
  dispatch: PropTypes.objectOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
  defaultBranch: {},
  location: {},
};

export default Index;
