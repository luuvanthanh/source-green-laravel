import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Spin } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
const mapStateToProps = ({ reportFees, schoolYear, classType, OPchildren, loading }) => ({
  data: reportFees.data,
  error: reportFees.error,
  pagination: reportFees.pagination,
  loading,
  yearsSchool: schoolYear.data,
  classTypes: classType.data,
  students: OPchildren.data
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
      search: {
        schoolYearId: query?.schoolYearId || '',
        branchId: query?.branchId || '',
        classTypeId: query?.classTypeId || '',
        studentId: query?.studentId || '',
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'schoolYear/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    this.getStudents();
    this.loadData();
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

  getStudents = (keyWord = '') => {
    this.props.dispatch({
      type: 'OPchildren/GET_DATA',
      payload: {
        keyWord: keyWord || undefined,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
      },
    });
  };

  /**
   * Function load data
   */
  loadData = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'reportFees/GET_DATA',
      payload: {
        ...search,
        include: Helper.convertIncludes(['student.classStudent.class']),
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChange = (value, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [type]: value,
        },
      }),
    );
  };

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  changePagination = ({ page, limit }) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          page,
          limit,
        },
      }),
      () => {
        this.loadData();
      },
    );
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  pagination = (pagination) => {
    const {
      location: { query },
    } = this.props;
    return Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        this.changePagination(response);
      },
    });
  };

  /**
   * Function remove items
   * @param {uid} id id of items
   */
   onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'reportFees/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              self.loadData();
            }
          },
        });
      },
    });
  };

  /**
   * Function header table
   */
  header = (name, columnsName) => {
    const columns = [
      {
        title: name,
        align: 'left',
        children: [
          {
            title: 'Tháng',
            dataIndex: 'student',
            key: 'month',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.[`${columnsName?.month}`] || '2/21',
          },
          {
            title: 'Số tiền',
            dataIndex: 'money',
            key: 'money',
            className: 'min-width-200',
            width: 200,
            render: (record) => record?.[`${columnsName.money}`] || '10,000,000',
          },
          {
            title: 'Ngày đến hạn',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.[`${columnsName.dueDate}`] || '25/07/21',
          },
          {
            title: 'Đã nộp',
            dataIndex: 'dn',
            key: 'dn',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.[`${columnsName.dn}`] || '10,000,000',
          },
          {
            title: 'Còn lại',
            dataIndex: 'cl',
            key: 'cl',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.[`${columnsName.cl}`] || '0',
          },
        ]
      }
    ];
    return columns;
  };

  onFinish = () => {
    this.loadData();
  }

  exportData = () => {
    Helper.exportExcel('/v1/dismisseds-export-word', {}, 'QDMienNhiem.docx');
  };

  onSearch = _.debounce((val) => {
    this.getStudents(val);
  }, 300);

  render() {
    const {
      pagination,
      loading: { effects },
      data,
      yearsSchool,
      students,
    } = this.props;
    const { search } = this.state;
    const loading = effects['reportFees/GET_DATA'];
    return (
      <>
        <Helmet title="Lịch nộp tiền học" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Lịch nộp tiền học</Text>
          </div>
          <div className={classnames(styles['block-table'], 'mb20', 'pb0')}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
              onFinish={this.onFinish}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    label="Mã học sinh"
                    name="studentId"
                    type={variables.SELECT}
                    placeholder="Chọn học sinh"
                    allowClear={false}
                    data={effects['OPchildren/GET_DATA'] ? [] : students.map(item => ({ ...item, name: item.code || '-' }))}
                    onChange={(event) => this.onChange(event, 'studentId')}
                    onSearch={this.onSearch}
                    notFoundContent={effects['OPchildren/GET_DATA'] ? <Spin size="small" /> : null}
                    filterOption
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    label="Năm học"
                    name="schoolYearId"
                    type={variables.SELECT}
                    placeholder="Chọn năm"
                    allowClear={false}
                    data={yearsSchool.map(item => ({ ...item, name: `${item?.yearFrom} - ${item?.yearTo}`}))}
                    onChange={(event) => this.onChange(event, 'schoolYearId')}
                  />
                </div>
                <div className="col-lg-3">
                  <Button color="success" className="mb20 no-label" htmlType="submit" >
                    <span className="icon icon-report" />
                    <span>Tải dữ liệu</span>
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className={styles['block-table']}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Text color="dark">Chi tiết báo cáo</Text>
              <Button color="primary" onClick={this.exportData} icon="export">
                Export
              </Button>
            </div>
            <Table
              bordered
              columns={[
                ...this.header('Tiền học phí A1'),
                ...[{
                  ...this.header('Tiền ăn A2')[0],
                  children: [...this.header('Tiền ăn A2')[0].children.slice(1)]
                }]
              ]}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
            <Table
              bordered
              columns={[
                ...this.header('Các loại phí khác A3'),
              ]}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  yearsSchool: PropTypes.arrayOf(PropTypes.any),
  students: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  data: [],
  yearsSchool: [],
  students: []
};

export default Index;
