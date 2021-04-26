import { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect, NavLink } from 'umi';
import { Form, List, Checkbox, Spin, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as _ from 'lodash';

import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
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

const mapStateToProps = ({ loading }) => ({
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      categories: {
        teachers: [],
        branches: [],
        classes: [],
      },
      selectedTeachers: [],
      loadingTeacher: false,
      hasMore: true,
      loadingLoadMore: false,
      searchTeachers: {
        totalCount: 0,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
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

  toggleCheckbox = (id) => (e) => {
    const { checked } = e.target;
    this.setStateData(({ selectedTeachers }) => ({
      selectedTeachers: checked
        ? [...selectedTeachers, id]
        : selectedTeachers.filter((selected) => selected !== id),
    }));
  };

  selectBranch = async (value) => {
    await this.setStateData((prev) => ({
      categories: {
        ...prev?.categories,
        classes: [],
        teachers: [],
      },
      searchTeachers: {
        totalCount: 0,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
      },
      selectedTeachers: [],
      hasMore: true,
      loadingLoadMore: false,
    }));
    this.formRef?.current?.resetFields(['classId']);
    this.fetchClasses(value);
    this.fetchTeachers(value);
  };

  fetchTeachers = () => {
    this.setStateData({ loadingTeacher: true });
    const { dispatch } = this.props;
    const { searchTeachers } = this.state;
    dispatch({
      type: 'categories/GET_TEACHERS',
      payload: {
        ...searchTeachers,
        include: Helper.convertIncludes(['positionLevel']),
      },
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              teachers: res?.parsePayload || [],
            },
            loadingTeacher: false,
            searchTeachers: {
              ...searchTeachers,
              totalCount: res.pagination.total,
            },
          }));
        }
      },
    });
  };

  fetchBranches = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categories/GET_BRANCHES',
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              branches: res?.items || [],
            },
          }));
        }
      },
    });
  };

  fetchClasses = (branchId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: branchId,
      },
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              classes: res?.items || []
            },
            hasMore: res?.items?.length <= variables.PAGINATION.PAGE_SIZE ? false : true
          }))
        }
      },
    });
  };

  finishForm = ({ classId, startDate }) => {
    const { selectedTeachers } = this.state;
    const { dispatch } = this.props;
    const requestData = selectedTeachers.map((employeeId) => ({
      employeeId,
      classId,
      startDate: startDate
        ? Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: startDate,
              targetValue: '00:00:00',
            }),
            isUTC: false,
          })
        : undefined,
    }));
    dispatch({
      type: 'allocationTeacherNoClass/ADD',
      payload: requestData,
      callback: async () => {
        this.formRef?.current?.resetFields();
        await this.setStateData((prev) => ({
          categories: {
            ...prev?.categories,
            classes: [],
            teachers: [],
          },
          searchTeachers: {
            totalCount: 0,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
          },
          selectedTeachers: [],
          hasMore: true,
          loadingLoadMore: false,
        }));
        // gọi lại danh sách giáo viên từ API
        this.fetchTeachers();
      },
    });
  };

  handleInfiniteOnLoad = () => {
    const { searchTeachers, categories } = this.state;
    const { dispatch } = this.props;

    if (_.isEmpty(categories.teachers)) {
      return;
    }

    this.setStateData({ loadingLoadMore: true });

    if (categories.teachers.length >= searchTeachers.totalCount) {
      message.warning('Danh sách đã hiển thị tất cả.');
      this.setStateData({
        hasMore: false,
        loadingLoadMore: false,
      });
      return;
    }

    dispatch({
      type: 'categories/GET_TEACHERS',
      payload: {
        ...searchTeachers,
        page: searchTeachers.page + 1,
        include: Helper.convertIncludes(['positionLevel']),
      },
      callback: (res, error) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              teachers: categories.teachers.concat(res.parsePayload),
            },
            loadingLoadMore: false,
            searchTeachers: {
              ...searchTeachers,
              page: searchTeachers.page + 1,
            },
          }));
        }
        if (error) {
          this.setStateData({
            hasMore: false,
            loadingLoadMore: false,
          });
          message.error('Lỗi hệ thống.');
        }
      },
    });
  };

  render() {
    const {
      loading: { effects },
    } = this.props;
    const {
      categories: { teachers, branches, classes },
      selectedTeachers,
      loadingTeacher,
      loadingLoadMore,
      hasMore,
    } = this.state;
    const submitLoading = effects['allocationTeacherNoClass/ADD'];

    return (
      <Form layout="vertical" colon={false} ref={this.formRef} onFinish={this.finishForm}>
        <Helmet title="Giáo viên chưa xếp lớp" />
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
                  <div className="row mt-3">
                    <div className="col-lg-6">
                      <FormItem
                        className="mb-0"
                        label="Cơ sở"
                        name="branch"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                        data={branches}
                        onChange={this.selectBranch}
                        allowClear={false}
                      />
                    </div>
                  </div>
                </div>
                {loadingTeacher ? (
                  <div className="text-center p20">
                    <Spin />
                  </div>
                ) : (
                  <Scrollbars autoHeight autoHeightMax={window.innerHeight - 333}>
                    <InfiniteScroll
                      hasMore={!loadingLoadMore && hasMore}
                      initialLoad={loadingLoadMore}
                      loadMore={this.handleInfiniteOnLoad}
                      pageStart={0}
                      useWindow={false}
                    >
                      <List
                        className={stylesAllocation.list}
                        dataSource={teachers}
                        renderItem={({ id, fullName, fileImage, positionLevel }) => (
                          <List.Item key={id}>
                            <Checkbox
                              className={stylesAllocation.checkbox}
                              onChange={this.toggleCheckbox(id)}
                              checked={
                                !_.isEmpty(selectedTeachers) ? selectedTeachers.includes(id) : false
                              }
                            />
                            <div className={stylesAllocation['group-info']}>
                              <AvatarTable
                                fileImage={Helper.getPathAvatarJson(fileImage)}
                                fullName={fullName}
                                description={
                                  !_.isEmpty(positionLevel)
                                    ? _.map(positionLevel, 'position.name').join(', ')
                                    : ''
                                }
                              />
                            </div>
                          </List.Item>
                        )}
                      >
                        {loadingLoadMore && (
                          <div className="text-center p20">
                            <Spin />
                          </div>
                        )}
                      </List>
                    </InfiniteScroll>
                  </Scrollbars>
                )}
              </div>

              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Text color="dark" size="normal">
                    Đã chọn {selectedTeachers.length} giáo viên
                  </Text>

                  <Button
                    disabled={!selectedTeachers.length}
                    loading={submitLoading}
                    color="success"
                    size="large"
                    className="ml-auto"
                    htmlType="submit"
                  >
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
                        className="title-green"
                        label="Chọn lớp để xếp"
                        name="classId"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.RADIO}
                        data={
                          !_.isEmpty(classes)
                            ? classes.map(({ id, name }) => ({ value: id, label: name }))
                            : []
                        }
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <FormItem
                        className="title-green"
                        label="Ngày vào lớp"
                        name="startDate"
                        type={variables.DATE_PICKER}
                        disabledDate={(current) => current < moment().add(-1, 'day')}
                      />
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
