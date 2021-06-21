import React, { PureComponent } from 'react';
import { connect, NavLink } from 'umi';
import { Form, List, Checkbox, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesAllocation from '@/assets/styles/Modules/Allocation/styles.module.scss';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { variables, Helper } from '@/utils';

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
const mapStateToProps = ({ allocationTeacherTransfers, loading }) => ({
  loading,
  data: allocationTeacherTransfers.data,
  pagination: allocationTeacherTransfers.pagination,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
      selectedTeachers: [],
      loadingTeacher: false,
      classes: [],
      submitLoading: false,
      classId: '',
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
  };

  fetchClasses = (branchId) => {
    const { dispatch } = this.props;
    this.formRef?.current?.resetFields(['classChangeId', 'class']);
    this.setStateData({
      teachers: [],
      classId: '',
      selectedTeachers: [],
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
    this.setStateData({ classId });
    this.fetchTeachers(classId);
  };

  fetchTeachers = (classId) => {
    this.setStateData({ loadingTeacher: true });
    const { dispatch } = this.props;
    const payload = {
      class: classId,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    };
    dispatch({
      type: 'allocationTeacherTransfers/GET_TEACHERS',
      payload,
      callback: (res, error) => {
        if (res) {
          this.setStateData({
            teachers: res?.items || [],
            loadingTeacher: false,
          });
        }
        if (error) {
          this.setStateData({
            teachers: [],
            loadingTeacher: false,
          });
        }
      },
    });
  };

  finishForm = ({ classChangeId }) => {
    this.setStateData({ submitLoading: true });
    const { selectedTeachers, classId } = this.state;
    const { dispatch } = this.props;
    const requestData = {
      id: classChangeId,
      data: selectedTeachers,
    };
    dispatch({
      type: 'allocationTeacherTransfers/UPDATE',
      payload: requestData,
      callback: async () => {
        this.fetchTeachers(classId);
        this.setStateData({ submitLoading: false, selectedTeachers: [] });
        this.formRef?.current?.resetFields(['classChangeId']);
      },
    });
  };

  toggleCheckbox = (id) => (e) => {
    const { checked } = e.target;
    this.setStateData(({ selectedTeachers }) => ({
      selectedTeachers: checked
        ? [...selectedTeachers, id]
        : selectedTeachers.filter((selected) => selected !== id),
    }));
  };

  render() {
    const {
      classes,
      branches,
      teachers,
      selectedTeachers,
      classId,
      loadingTeacher,
      submitLoading,
    } = this.state;
    const classChange =
      !_.isEmpty(classes) && classId ? classes.filter((item) => item.id !== classId) : [];

    return (
      <Form layout="vertical" colon={false} ref={this.formRef} onFinish={this.finishForm}>
        <Helmet title="Điều chuyển giáo viên" />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-allocationTeacherTransfers'],
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
          {/* MAIN CONTAINER */}
          <div className={stylesAllocation['main-container']}>
            <div className={stylesAllocation['left-container']}>
              <div className={stylesAllocation.content}>
                <div className={stylesAllocation.heading}>
                  <Text color="dark" size="large-medium">
                    Danh sách giáo viên
                  </Text>
                  <div className="row">
                    <div className="col-lg-4 mt-3">
                      <FormItem
                        className="mb-0"
                        label="Cơ sở"
                        allowClear={false}
                        name="branch"
                        type={variables.SELECT}
                        placeholder="Chọn cơ sở"
                        onChange={this.fetchClasses}
                        data={branches}
                      />
                    </div>
                    <div className="col-lg-4 mt-3">
                      <FormItem
                        className="mb-0"
                        label="Lớp"
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
                {loadingTeacher ? (
                  <div className="text-center p20">
                    <Spin />
                  </div>
                ) : (
                  <Scrollbars autoHeight autoHeightMax={window.innerHeight - 444}>
                    <List
                      className={stylesAllocation.list}
                      dataSource={teachers}
                      renderItem={({ employee }, index) => (
                        <List.Item key={index}>
                          <Checkbox
                            className={stylesAllocation.checkbox}
                            onChange={this.toggleCheckbox(employee?.id)}
                            checked={
                              !_.isEmpty(selectedTeachers)
                                ? selectedTeachers.includes(employee?.id)
                                : false
                            }
                          />
                          <div className={stylesAllocation['group-info']}>
                            <AvatarTable
                              fileImage={Helper.getPathAvatarJson(employee?.fileImage)}
                            />
                            <div className={stylesAllocation.info}>
                              <h3 className={stylesAllocation.title}>{employee?.fullName || ''}</h3>
                              <p className={stylesAllocation.norm}>
                                {employee?.position?.name || ''}
                              </p>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Scrollbars>
                )}
              </div>
              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Text color="dark" size="normal">
                    Đã chọn {selectedTeachers.length} giáo viên
                  </Text>
                </div>
              </div>
            </div>
            <div className={stylesAllocation['right-container']}>
              <div className={stylesAllocation.content}>
                <div className={stylesAllocation.heading}>
                  <Text color="dark" size="large-medium">
                    Thông tin điều chuyển
                  </Text>
                </div>
                <div className={stylesAllocation['content-form']}>
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <FormItem
                        className="title-green"
                        label="Chọn lớp để điều chuyển"
                        name="classChangeId"
                        type={variables.RADIO}
                        rules={[variables.RULES.EMPTY]}
                        data={
                          !_.isEmpty(classChange)
                            ? classChange.map(({ id, name }) => ({ value: id, label: name }))
                            : []
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Button
                    disabled={!selectedTeachers.length}
                    loading={submitLoading}
                    color="success"
                    size="large"
                    className="ml-auto"
                    htmlType="submit"
                  >
                    Điểu chuyển
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
  dispatch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
};

export default Index;
