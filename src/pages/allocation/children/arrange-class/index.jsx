import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect, NavLink } from 'umi';
import { Form, List, Checkbox, Spin, message } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';

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

const mapStateToProps = ({ loading, user }) => ({
  loading,
  defaultBranch: user.defaultBranch,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      searchStudents: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        totalCount: 0,
      },
      categories: {
        students: [],
        branches: [],
        classes: [],
      },
      selectedStudents: [],
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.fetchStudents();
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
    this.setStateData(({ selectedStudents }) => ({
      selectedStudents: checked
        ? [...selectedStudents, id]
        : selectedStudents.filter((selected) => selected !== id),
    }));
  };

  selectBranch = (value) => {
    this.fetchClasses(value);
  };

  fetchStudents = () => {
    const { dispatch } = this.props;
    const { searchStudents } = this.state;
    dispatch({
      type: 'categories/GET_STUDENTS',
      payload: {
        ...searchStudents,
        classStatus: 'NO_CLASS',
        ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      },
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              students: res?.items || [],
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
              branches: res?.parsePayload || [],
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
              classes: res?.items || [],
            },
          }));
        }
      },
    });
  };

  handleInfiniteOnLoad = () => {
    const { categories, searchStudents } = this.state;
    if (categories?.students?.length >= searchStudents.totalCount) {
      message.warning('Danh sách đã hiển thị tất cả.');
      this.setStateData({
        hasMore: false,
      });
      return;
    }
    this.props.dispatch({
      type: 'allocationChangeClass/GET_STUDENTS',
      payload: {
        ...searchStudents,
        page: searchStudents.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          this.setStateData((prevState) => ({
            categories: {
              ...categories,
              students: prevState?.categories?.students?.concat(response?.items || []),
            },
            searchStudents: {
              ...searchStudents,
              page: searchStudents.page + 1,
            },
          }));
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          this.setStateData({
            hasMore: false,
          });
        }
      },
    });
  };

  finishForm = ({ classId, joinDate }) => {
    const { selectedStudents } = this.state;
    const { dispatch } = this.props;
    const requestData = selectedStudents.map((studentId) => ({
      studentId,
      classId,
      joinDate,
    }));
    dispatch({
      type: 'allocationArrangeClass/ADD',
      payload: requestData,
      callback: () => {
        this.formRef?.current?.resetFields();
        this.setStateData((prev) => ({
          // xóa học sinh thủ công
          categories: {
            ...prev?.categories,
            students: prev?.categories?.students.filter(
              (student) => !selectedStudents.includes(student?.id),
            ),
          },
          selectedStudents: [],
        }));
        // gọi lại danh sách học sinh từ API
        // this.fetchStudents
      },
    });
  };

  /**
 * Function debounce search
 * @param {string} value value of object search
 * @param {string} type key of object search
 */
  debouncedSearch = debounce((value, type) => {
    this.setStateData(
      (prevState) => ({
        searchStudents: {
          ...prevState.searchStudents,
          [`${type}`]: value,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => this.fetchStudents(),
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


  render() {
    const {
      loading: { effects },
      defaultBranch,
    } = this.props;
    const {
      hasMore,
      selectedStudents,
      categories: { students, branches, classes },
    } = this.state;

    const submitLoading = effects['allocationArrangeClass/ADD'];
    const loading = effects['allocationArrangeClass/GET_STUDENTS'];

    return (
      <Form
        layout="vertical"
        colon={false}
        ref={this.formRef}
        onFinish={this.finishForm}
        initialValues={{ branch: defaultBranch?.id || null }}
      >
        <Helmet title="Trẻ chưa xếp lớp" />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-allocationArrangeClass'],
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
                activeClassName={stylesAllocation.active}
                className={stylesAllocation.link}
              >
                Trẻ chưa xếp lớp
              </NavLink>
              <NavLink
                to="/phan-bo/hoc-sinh/chuyen-lop"
                activeClassName={stylesAllocation.active}
                className={stylesAllocation.link}
              >
                Chuyển lớp
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
                    Danh sách trẻ chưa xếp lớp
                  </Text>
                </div>
                <div className="col-lg-12 mt15">
                  <FormItem
                    name="keyWord"
                    onChange={(event) => this.onChange(event, 'keyWord')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <Scrollbars autoHeight autoHeightMax={window.innerHeight - 390}>
                  <InfiniteScroll
                    hasMore={!loading && hasMore}
                    initialLoad={false}
                    loadMore={this.handleInfiniteOnLoad}
                    pageStart={0}
                    useWindow={false}
                  >
                    <List
                      className={stylesAllocation.list}
                      dataSource={students}
                      renderItem={({ id, fullName, age, fileImage, branch, branchId, registerDate }) => (
                        <List.Item key={id}>
                          <Checkbox
                            className={stylesAllocation.checkbox}
                            onChange={this.toggleCheckbox(id)}
                          />
                          <div className={stylesAllocation['group-info']}>
                            <AvatarTable
                              fileImage={Helper.getPathAvatarJson(fileImage)}
                              fullName={`${fullName} ${branchId ? ` - ${branch?.name}` : ""}`}
                              description={`${age} tháng tuổi ${registerDate ? ` - ${Helper.getDate(registerDate, variables.DATE_FORMAT.DATE)}` : ""}`}
                            />
                          </div>
                        </List.Item>
                      )}
                    >
                      {loading && hasMore && (
                        <div className="demo-loading-container">
                          <Spin />
                        </div>
                      )}
                    </List>
                  </InfiniteScroll>
                </Scrollbars>
              </div>

              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Text color="dark" size="normal">
                    Đã chọn {selectedStudents.length} bé
                  </Text>

                  <Button
                    disabled={!selectedStudents.length}
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
              <div className={stylesAllocation.content}>
                <div className={stylesAllocation.heading}>
                  <Text color="dark" size="large-medium">
                    Danh sách cơ sở/lớp
                  </Text>
                </div>
                <div className={stylesAllocation['content-form']}>
                  <div className="row mt-3">
                    <div className="col-lg-6">
                      <FormItem
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
                  <hr />

                  {!!classes.length && (
                    <>
                      <div className="row mt-3">
                        <div className="col-lg-12">
                          <FormItem
                            label="Chọn lớp để xếp"
                            name="classId"
                            type={variables.RADIO}
                            data={classes.map(({ id, name }) => ({ value: id, label: name }))}
                            rules={[variables.RULES.EMPTY]}
                          />
                        </div>
                      </div>
                      <hr />
                    </>
                  )}

                  <div className="row mt-3">
                    <div className="col-lg-6">
                      <FormItem label="Ngày vào lớp" name="joinDate" type={variables.DATE_PICKER} />
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
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  loading: {},
  dispatch: {},
  defaultBranch: {},
};

export default Index;
