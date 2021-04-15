import { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect, NavLink } from 'umi';
import { Form, List, Checkbox } from 'antd';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';

import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import AvatarTable from '@/components/CommonComponent/AvatarTable'

import stylesAllocation from '@/assets/styles/Modules/Allocation/styles.module.scss';
import styles from '@/assets/styles/Common/common.scss';
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
const mapStateToProps = ({ loading }) => ({
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      search: {},
      categories: {
        students: [],
        branches: [],
        classes: [],
        filterClasses: [],
      },
      selectedStudents: [],
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.fetchBranches()
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

  selectBranch = classesType => value => {
    this.fetchClasses(value, classesType)
  }

  selectClass = value => {
    const { getFieldValue, setFieldsValue } = this.formRef?.current
    if (value === getFieldValue('classId')) {
      setFieldsValue({ classId: undefined })
    }
    this.fetchStudents(value)
  }

  toggleCheckbox = (id) => e => {
    const { checked } = e.target
    this.setStateData(({ selectedStudents }) => ({
      selectedStudents: checked
        ? [
          ...selectedStudents,
          id
        ]
        : selectedStudents.filter(
          selected => selected !== id
        )
    }))
  }

  fetchBranches = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categories/GET_BRANCHES',
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              branches: res?.items || []
            }
          }))
        }
      }
    })
  }

  fetchClasses = (branchId, classesType = 'classes') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: branchId
      },
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              [classesType]: res?.items || []
            }
          }))
        }
      }
    })
  }

  fetchStudents = (classId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'allocationChangeClass/GET_STUDENTS',
      payload: {
        class: classId,
        ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX)
      },
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              students: res?.items.map(item => item?.student) || [],
            },
            selectedStudents: []
          }))
        }
      }
    })
  }

  finishForm = ({ classId }) => {
    const { selectedStudents } = this.state
    const { dispatch } = this.props

    dispatch({
      type: 'allocationChangeClass/UPDATE',
      payload: {
        id: classId,
        data: selectedStudents,
      },
      callback: () => {
        // reset form
        this.formRef?.current?.resetFields();
        this.setStateData(prev => ({
          categories: {
            ...prev?.categories,
            students: [],
            classes: []
          },
          selectedStudents: []
        }))
      }
    })
  }

  render() {
    const { loading: { effects }, } = this.props;
    const submitLoading = effects['allocationChangeClass/CHANGE'];

    const { categories: { students, branches, classes, filterClasses }, selectedStudents } = this.state

    return (
      <Form
        layout="vertical"
        colon={false}
        ref={this.formRef}
        onFinish={this.finishForm}
      >
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
                        name="branch"
                        type={variables.SELECT}
                        data={branches}
                        onChange={this.selectBranch('filterClasses')}
                        allowClear={false}
                      />
                    </div>
                    <div className="col-lg-6">
                      <FormItem
                        label="Lớp"
                        name="class"
                        type={variables.SELECT}
                        data={filterClasses}
                        onChange={this.selectClass}
                        allowClear={false}
                      />
                    </div>
                  </div>
                  <hr />
                </div>

                <Scrollbars autoHeight autoHeightMax={window.innerHeight - 444}>
                  <List
                    className={stylesAllocation.list}
                    dataSource={students}
                    renderItem={({ id, fullName, age }, index) => (
                      <List.Item key={id + index}>
                        <Checkbox className={stylesAllocation.checkbox} onChange={this.toggleCheckbox(id)} />
                        <div className={stylesAllocation['group-info']}>
                          <AvatarTable />
                          <div className={stylesAllocation['info']}>
                            <h3 className={stylesAllocation['title']}>{fullName}</h3>
                            <p className={stylesAllocation['norm']}>{age} tháng tuổi</p>
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
                    Đã chọn {selectedStudents.length} bé
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
                        name="branches"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                        data={branches}
                        allowClear={false}
                        onChange={this.selectBranch()}
                      />
                    </div>
                  </div>
                  <hr />

                  {!!classes.length && (
                    <>
                      <div className="row mt-3">
                        <div className="col-lg-12">
                          <FormItem
                            label="Chọn lớp để chuyển"
                            name="classId"
                            type={variables.RADIO}
                            data={classes.map(({ id, name }) => ({ value: id, label: name }))}
                            rules={[variables.RULES.EMPTY]}
                            disabledKeys={[this.formRef?.current?.getFieldValue('class')]}
                          />
                        </div>
                      </div>
                      <hr />
                    </>
                  )}
                </div>
              </div>
              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Button
                    color="success"
                    size="large"
                    className="ml-auto"
                    htmlType="submit"
                    disabled={!selectedStudents.length}
                    loading={submitLoading}
                  >
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
