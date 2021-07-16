import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import moment from 'moment';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

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
const mapStateToProps = ({ salary, loading }) => ({
  data: salary.data,
  error: salary.error,
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
        month: query?.month ? moment(query.month) : moment().startOf('months'),
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
    if (search.month) {
      this.props.dispatch({
        type: 'salary/GET_DATA',
        payload: {
          ...search,
        },
      });
      history.push(
        `${pathname}?${Helper.convertParamSearchConvert(
          {
            ...search,
            month: Helper.getDate(search.month, variables.DATE_FORMAT.DATE_AFTER),
          },
          variables.QUERY_STRING,
        )}`,
      );
    }
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
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchStatus = debounce((value, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [`${type}`]: value,
        },
      }),
      () => this.onLoad(),
    );
  }, 200);

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(
      moment(e).startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
      type,
    );
  };

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
  onChangeSelectStatus = (e, type) => {
    this.debouncedSearchStatus(e, type);
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
  pagination = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        this.changePagination(response);
      },
    });

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
          type: 'salary/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) self.onLoad();
          },
        });
      },
    });
  };

  update = (record, key) => {
    const { dispatch } = this.props;
    if (key === 'CHOT_BANG_LUONG') {
      dispatch({
        type: 'salary/UPDATE',
        payload: {
          id: record.id,
          isTimesheet: true,
          isBonus: record.isBonus,
          isOther: record.isOther,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }
    if (key === 'CHOT_BANG_THUONG_KPI') {
      dispatch({
        type: 'salary/UPDATE',
        payload: {
          id: record.id,
          isBonus: true,
          isOther: record.isOther,
          isTimesheet: record.isTimesheet,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }
    if (key === 'KHAI_BAO_KHOAN_KHAC') {
      dispatch({
        type: 'salary/UPDATE',
        payload: {
          id: record.id,
          isOther: true,
          isBonus: record.isBonus,
          isTimesheet: record.isTimesheet,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }
  };

  updateSalary = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salary/UPDATE_SALARY',
      payload: {
        id: record.id,
      },
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const { data } = this.props;
    const columns = [
      {
        title: 'Họ và tên',
        key: 'name',
        width: 200,
        className: 'min-width-200',
        fixed: 'left',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.employee?.fileImage)}
            fullName={record?.employee?.fullName}
          />
        ),
      },
      {
        title: 'Ngày bắt đầu làm việc',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getDate(record.dateStartWork, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Nghỉ không lương/Thai sản',
        key: 'isMaternity',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.isMaternity && 'Có',
      },
      {
        title: 'Thử việc',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.isProbation && 'Có',
      },
      {
        title: 'Không tham gia BHXH',
        key: 'isSocialInsurance',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.isProbation && 'Có',
      },
      {
        title: 'Tổng thu nhập',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getPrice(record.totalIncome),
      },
      {
        title: 'Lương cơ bản + Phụ Cấp',
        key: 'name',
        children:
          data?.columnBasicSalaryAndAllowance?.map((item) => ({
            title: item.name,
            key: item.code,
            className: 'min-width-150',
            width: 150,
            render: (record) => {
              const basicSalaryAndAllowance =
                Helper.isJSON(record.basicSalaryAndAllowance) &&
                JSON.parse(record.basicSalaryAndAllowance);
              if (basicSalaryAndAllowance) {
                const basic = basicSalaryAndAllowance.find(
                  (itemBasic) => itemBasic.code === item.code,
                );
                return Helper.getPrice(basic?.value || 0);
              }
              return null;
            },
          })) || [],
      },
      {
        title: 'Phụ cấp phát sinh trong tháng',
        key: 'name',
        children:
          data?.columnIncurredAllowance?.map((item) => ({
            title: item.name,
            key: item.code,
            className: 'min-width-150',
            width: 150,
            render: (record) => {
              const incurredAllowance =
                Helper.isJSON(record.incurredAllowance) && JSON.parse(record.incurredAllowance);
              if (incurredAllowance) {
                const incurred = incurredAllowance.find(
                  (itemIncurred) => itemIncurred.code === item.code,
                );
                return Helper.getPrice(incurred?.value || 0);
              }
              return null;
            },
          })) || [],
      },
      {
        title: 'Thưởng KPI',
        key: 'kpiBonus',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getPrice(record.kpiBonus),
      },
      {
        title: 'OT',
        key: 'name',
        children: [
          {
            title: 'OT tính thuế',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.otTax),
          },
          {
            title: 'OT không tính thuế',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.otNoTax),
          },
        ],
      },
      {
        title: 'Nghỉ không lương',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => record.unpaidLeave,
      },
      {
        title: 'Ngày công thực tế trong tháng',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => record.totalWork,
      },
      {
        title: 'Tổng thu nhập trong tháng',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getPrice(record.totalIncomeMonth),
      },
      {
        title: 'Người lao động',
        key: 'name',
        children: [
          {
            title: 'BHXH 8%',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.socialInsuranceEmployee),
          },
          {
            title: 'BHYT 1.5%',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.healthInsuranceEmployee),
          },
          {
            title: 'BHTN 1%',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.unemploymentInsuranceEmployee),
          },
          {
            title: 'Điều chỉnh BHXH',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.socialInsuranceAdjustedEmployee),
          },
        ],
      },
      {
        title: 'Công ty',
        key: 'name',
        children: [
          {
            title: 'BHXH 17.5%',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.socialInsuranceCompany),
          },
          {
            title: 'BHYT 3%',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.healthInsuranceCompany),
          },
          {
            title: 'BHTN 1%',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.unemploymentInsuranceCompany),
          },
          {
            title: 'Điều chỉnh BHXH',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.socialInsuranceAdjustedCompany),
          },
          {
            title: 'Phí công đoàn',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.unionDues),
          },
        ],
      },
      {
        title: 'Tham số tính thuế TNCN',
        key: 'name',
        children: [
          {
            title: 'Số người phụ thuộc',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => record.DependentPerson,
          },
          {
            title: 'Tổng giảm trừ bản thân và người phụ thuộc',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.eeduce),
          },
          {
            title: 'Đóng góp từ thiện',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.charity),
          },
        ],
      },
      {
        title: 'Tổng các khoản giảm trừ',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getPrice(record.totalReduce),
      },
      {
        title: 'Thu nhập tính thuế',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getPrice(record.rentalIncome),
      },
      {
        title: 'Thuế TNCN',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getPrice(record.personalIncomeTax),
      },
      {
        title: 'Các khoản thanh toán không tính thuế',
        key: 'name',
        children: [
          {
            title: 'Thanh toán từ BHXH',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.SocialInsurancePayment),
          },
          {
            title: 'Trừ các khoản đã chi tạm ứng',
            key: 'name',
            className: 'min-width-150',
            width: 150,
            render: (record) => Helper.getPrice(record.advance),
          },
        ],
      },
      {
        title: 'Ghi chú',
        key: 'note',
        className: 'min-width-150',
        width: 150,
        render: (record) => record.note,
      },
      {
        title: 'Lương thực nhận',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        fixed: 'right',
        render: (record) => Helper.getPrice(record.actuallyReceived),
      },
    ];
    return columns;
  };

  render() {
    const {
      data,
      error,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['salary/GET_DATA'];
    return (
      <>
        <Helmet title="Bảng lương" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">BẢNG LƯƠNG</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                month: search.month && moment(search.month),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="month"
                    onChange={(event) => this.onChangeDate(event, 'month')}
                    type={variables.MONTH_PICKER}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data?.payrollDetail || []}
              loading={loading}
              pagination={false}
              error={error}
              isError={error.isError}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '55vh' }}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  loading: {},
  dispatch: {},
  location: {},
  error: {},
};

export default Index;
