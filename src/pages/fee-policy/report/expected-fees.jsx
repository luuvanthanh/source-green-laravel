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
      branches: [],
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
    this.props.dispatch({
      type: 'classType/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    this.fetchBranches();
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
  header = () => {
    const columns = [
      {
        title: 'Học sinh',
        children: [
          {
            title: 'Mã học sinh',
            dataIndex: 'code',
            key: 'code',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.code || 'HS1001',
          },
          {
            title: 'Tên học sinh',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.fullName || 'Nguyễn Văn A ',
          },
        ]
      },
      {
        title: 'Các khoản phí',
        children: [
          {
            title: 'Học phí',
            dataIndex: 'hp',
            key: 'hp',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.hp || '1000000',
          },
          {
            title: 'Tiền ăn',
            dataIndex: 'TA',
            key: 'TA',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.TA || '300000',
          },
          {
            title: 'Phí anh văn',
            dataIndex: 'av',
            key: 'av',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.av || '300000',
          },
          {
            title: 'Phí xe bus',
            dataIndex: 'bus',
            key: 'bus',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.bus || '300000',
          },
          {
            title: 'Phí giữ thêm giờ',
            dataIndex: 'tg',
            key: 'tg',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.tg || '300000',
          },
          {
            title: 'Phí chậm nộp',
            dataIndex: 'cn',
            key: 'cn',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.cn || '300000',
          },
          {
            title: 'Tổng cộng',
            dataIndex: 'total',
            key: 'total',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.total || '1000000',
          },
        ]
      },
      {
        title: 'Giảm trừ',
        children: [
          {
            title: 'Giảm tiền chính sách',
            dataIndex: 'cs',
            key: 'cs',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.cs || '100000',
          },
          {
            title: 'Giảm tiền hoàn phí',
            dataIndex: 'hp',
            key: 'hp',
            width: 150,
            className: 'min-width-150',
            render: (record) => record?.hp || '1000000',
          },
        ]
      },
      {
        title: 'Đã nộp',
        dataIndex: 'dn',
        key: 'dn',
        width: 150,
        className: 'min-width-150',
        render: (record) => record?.dn || '9000000',
      },
      {
        title: 'Còn lại',
        dataIndex: 'cl',
        key: 'cl',
        width: 150,
        className: 'min-width-150',
        render: (record) => record?.cl || '1000000',
      },
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
      match: { params },
      pagination,
      loading: { effects },
      data,
      yearsSchool,
      classTypes,
      students,
    } = this.props;
    const { search, branches } = this.state;
    const loading = effects['reportFees/GET_DATA'];
    return (
      <>
        <Helmet title="Dự kiến các khoản phải thu" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Dự kiến các khoản phải thu</Text>
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
              <div className="header-search">
                <div className="form-search">
                  <div className="row">
                    <div className="col-lg-3">
                      <FormItem
                        name="schoolYearId"
                        type={variables.SELECT}
                        placeholder="Chọn năm"
                        allowClear={false}
                        data={yearsSchool.map(item => ({ ...item, name: `${item?.yearFrom} - ${item?.yearTo}`}))}
                        onChange={(event) => this.onChange(event, 'schoolYearId')}
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        name="branchId"
                        type={variables.SELECT}
                        placeholder="Chọn cơ sở"
                        allowClear={false}
                        data={[{ id: '', name: 'Tất cả'}, ...branches]}
                        onChange={(event) => this.onChange(event, 'branchId')}
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        name="classTypeId"
                        type={variables.SELECT}
                        placeholder="Chọn khối lớp"
                        allowClear={false}
                        data={[{ id: '', name: 'Tất cả'}, ...classTypes]}
                        onChange={(event) => this.onChange(event, 'classTypeId')}
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        name="studentId"
                        type={variables.SELECT}
                        placeholder="Chọn học sinh"
                        allowClear={false}
                        data={effects['OPchildren/GET_DATA'] ? [] : [{ id: '', fullName: 'Tất cả' }, ...students].map(item => ({ ...item, name: item.fullName || '-' }))}
                        onChange={(event) => this.onChange(event, 'studentId')}
                        onSearch={this.onSearch}
                        notFoundContent={effects['OPchildren/GET_DATA'] ? <Spin size="small" /> : null}
                        filterOption
                      />
                    </div>
                  </div>
                </div>
                <Button color="success" className="mb20" htmlType="submit" >
                  <span className="icon icon-report" />
                  <span>Tải dữ liệu</span>
                </Button>
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
              columns={this.header(params)}
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
  match: PropTypes.objectOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  yearsSchool: PropTypes.arrayOf(PropTypes.any),
  classTypes: PropTypes.arrayOf(PropTypes.any),
  students: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  data: [],
  yearsSchool: [],
  classTypes: [],
  students: [],
};

export default Index;
