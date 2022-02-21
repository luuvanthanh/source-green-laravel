import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';

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
const mapStateToProps = ({ CRMnewStudent, loading }) => ({
  data: CRMnewStudent.data,
  error: CRMnewStudent.error,
  pagination: CRMnewStudent.pagination,
  loading,
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
        nameStudent: query?.nameStudent,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
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
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'CRMnewStudent/GET_DATA',
      payload: {
        ...search,
        orderBy: 'created_at',
        sortedBy: 'desc',
        include: Helper.convertIncludes(['studentInfo.parentInfo', 'admissionRegister.parentInfo,classType,schoolYear,studentInfo', 'schoolYear']),
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
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
        search: {
          ...prevState.search,
          [`${type}`]: value,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
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
        this.onLoad();
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
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'Năm học',
        key: 'schoolYear',
        className: 'min-width-150',
        render: (record) => `${record?.schoolYear?.year_from || ''} - ${record?.schoolYear?.year_to || ''}`
      },
      {
        title: 'Tên học sinh',
        key: 'nameStudent',
        className: 'min-width-200',
        render: (record) => record?.studentInfo?.full_name || record?.name_student,
      },
      {
        title: 'Sinh ngày',
        key: 'dateOfBirth',
        className: 'min-width-200',
        render: (record) =>
          record?.studentInfo
            ? Helper.getDate(record?.studentInfo?.birth_date, variables.DATE_FORMAT.DATE_VI) || " "
            : Helper.getDate(record?.date_of_birth, variables.DATE_FORMAT.DATE_VI) || " ",
      },
      {
        title: 'Tháng tuổi',
        key: 'age',
        className: 'min-width-100',
        render: (record) =>
          record?.studentInfo
            ? <>{record?.studentInfo?.age_month || "0"}</>
            : <>{record?.age || "0"}</>,
      },
      {
        title: 'Ngày nhập học',
        key: 'dayAdmission',
        className: 'min-width-150',
        render: (record) =>
          record?.day_admission
            ? Helper.getDate(record?.day_admission, variables.DATE_FORMAT.DATE_VI)
            : '',
      },
      {
        title: 'Họ tên cha',
        key: 'fatherName',
        className: 'min-width-150',
        render: (record) => {
          const a = record?.admissionRegister?.parentInfo.find(i => i.sex === "MALE");
          return <>{a?.full_name ? a?.full_name : record?.father_name}</>;
        }
      },
      {
        title: 'SĐT cha',
        key: 'fatherPhoneNumber',
        className: 'min-width-150',
        render: (record) => {
          const a = record?.admissionRegister?.parentInfo.find(i => i.sex === "MALE");
          return <>{a?.phone ? a?.phone : record?.father_phone}</>;
        }
      },
      {
        title: 'Họ tên mẹ',
        key: 'motherName',
        className: 'min-width-150',
        render: (record) => {
          const a = record?.admissionRegister?.parentInfo.find(i => i.sex === "FEMALE");
          return <>{a?.full_name ? a?.full_name : record?.mother_name}</>;
        }
      },
      {
        title: 'SĐT mẹ',
        key: 'motherPhoneNumber',
        className: 'min-width-150',
        render: (record) => {
          const a = record?.admissionRegister?.parentInfo.find(i => i.sex === "FEMALE");
          return <>{a?.full_name ? a?.full_name : record?.mother_phone}</>;
        }
      },
      {
        title: 'Tổng học phí đóng đ',
        key: 'totalMoney',
        className: 'min-width-200',
        render: (record) => Helper.getPrice(record.total_money) || 0,
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              onClick={() =>
                history.push(`/crm/chinh-sach-phi/tinh-phi-hoc-sinh-moi/${record?.id}/chi-tiet`)
              }
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
      data,
    } = this.props;
    const { search } = this.state;
    const loading = effects['CRMnewStudent/GET_DATA'];
    return (
      <>
        <Helmet title="Tính phí học sinh mới" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Tính phí học sinh mới</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Tạo mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="nameStudent"
                    onChange={(event) => this.onChange(event, 'nameStudent')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
              </div>
            </Form>
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
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  data: [],
};

export default Index;
