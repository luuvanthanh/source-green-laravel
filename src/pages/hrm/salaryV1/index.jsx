import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, toNumber, head } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import TableCus from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import moment from 'moment';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Button from '@/components/CommonComponent/Button';
import stylesModule from './styles.module.scss';

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
const mapStateToProps = ({ salary, loading, hrmSalary }) => ({
  data: hrmSalary.dataTable,
  error: salary.error,
  branches: salary.branches,
  divisions: salary.divisions,
  employees: salary.employees,
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
        branchId: query?.branchId,
        divisionId: query?.divisionId,
        employeeId: query?.employeeId ? query?.employeeId.split(',') : undefined,
        month: query?.month ? moment(query.month) : moment().startOf('months'),
      },
      isCollapsed: false,
      loadingDownload: false,
      loadingBank: false,
      loadingSalary: false,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
    this.loadCategories();
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

  loadCategories = () => {
    this.props.dispatch({
      type: 'salary/GET_BRANCHES',
      payload: {},
    });
    this.props.dispatch({
      type: 'salary/GET_DIVISIONS',
      payload: {},
    });
    this.props.dispatch({
      type: 'salary/GET_EMPLOYEES',
      payload: {},
    });
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
        type: 'hrmSalary/GET_DATA',
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
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
    const { isCollapsed, search } = this.state;
    const columns = [
      {
        title: 'Họ và tên',
        key: 'name',
        width: isCollapsed ? 100 : 200,
        className: isCollapsed ? 'min-width-100 thead-green' : 'min-width-200 thead-green',
        fixed: 'left',
        render: (record) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {record?.children || record?.key ? (
                  <>{record?.name}</>
                ) : (
                  <AvatarTable
                    fileImage={Helper.getPathAvatarJson(record?.employee?.FileImage)}
                    fullName={record?.employee?.FullName}
                  />
                )}
              </div>
            ),
            props: {},
          };
          if ((record?.children && record?.name) || record?.key) {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Ngày bắt đầu làm việc',
        key: 'name',
        className: isCollapsed
          ? 'min-width-50 thead-green text-primary'
          : 'min-width-150 thead-green text-primary',
        width: isCollapsed ? 50 : 150,
        render: (record) => Helper.getDate(record.DateStartWork, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Nghỉ không lương/Thai sản',
        key: 'isMaternity',
        className: isCollapsed
          ? 'min-width-50 thead-green text-primary'
          : 'min-width-150 thead-green text-primary',
        width: isCollapsed ? 50 : 150,
        render: (record) => record?.IsMaternity && 'Có',
      },
      {
        title: 'Thử việc',
        key: 'name',
        className: isCollapsed
          ? 'min-width-50 thead-green text-primary'
          : 'min-width-150 thead-green text-primary',
        width: isCollapsed ? 50 : 150,
        render: (record) => record?.IsProbation && 'Có',
      },
      {
        title: 'Không tham gia BHXH',
        key: 'isSocialInsurance',
        className: isCollapsed
          ? 'min-width-50 thead-green text-primary'
          : 'min-width-150 thead-green text-primary',
        width: isCollapsed ? 50 : 150,
        render: (record) => record?.IsSocialInsurance && 'Có',
      },
      {
        title: 'Tổng thu nhập',
        key: 'name',
        className: isCollapsed
          ? 'min-width-50 thead-green text-primary'
          : 'min-width-150 thead-green text-primary',
        width: isCollapsed ? 50 : 150,
        render: (record) => Helper.getPrice(record.TotalIncome),
      },
      ...(!isEmpty(head(data)?.ColumnIncurredAllowance)
        ? [
          {
            title: 'Lương cơ bản + Phụ Cấp',
            key: 'name',
            className: 'thead-green',
            children:
            head(data)?.ColumnIncurredAllowance?.map((item) => {
                if (item.code === 'TI_LE_THU_VIEC') {
                  return {
                    title: item.name,
                    key: item.code,
                    className: isCollapsed
                      ? 'min-width-50 thead-green'
                      : 'min-width-150 thead-green',
                    width: isCollapsed ? 50 : 150,
                    render: (record) => {
                      if (record.basicSalaryAndAllowance) {
                        const basic = record.basicSalaryAndAllowance.find(
                          (itemBasic) => itemBasic.code === item.code,
                        );
                        return basic?.value;
                      }
                      return null;
                    },
                  };
                }
                return {
                  title: item.name,
                  key: item.code,
                  className: isCollapsed
                    ? 'min-width-50 thead-green'
                    : 'min-width-150 thead-green',
                  width: isCollapsed ? 50 : 150,
                  render: (record) => {
                    if (record.basicSalaryAndAllowance) {
                      const basic = record.basicSalaryAndAllowance.find(
                        (itemBasic) => itemBasic.code === item.code,
                      );
                      return Helper.getPrice(basic?.value || 0);
                    }
                    return null;
                  },
                };
              }) || [],
          },
        ]
        : []),
        ...(!isEmpty(head(data)?.ColumnIncurredAllowance)
        ? [
          {
            title: 'Phụ cấp phát sinh trong tháng',
            key: 'name',
            className: 'thead-green-1',
            children:
              head(data)?.ColumnIncurredAllowance?.map((item) => ({
                title: item.name,
                key: item.code,
                className: isCollapsed
                  ? 'min-width-50 thead-green-1'
                  : 'min-width-150 thead-green-1',
                width: isCollapsed ? 50 : 150,
                render: (record) => {
                  if (record.IncurredAllowance) {
                    const incurred = record.IncurredAllowance.find(
                      (itemIncurred) => itemIncurred.code === item.code,
                    );
                    return Helper.getPrice(incurred?.value || 0);
                  }
                  return null;
                },
              })) || [],
          },
        ]
        : []),
        {
          title: 'Thưởng KPI',
          key: 'kpiBonus',
          className: isCollapsed ? 'min-width-50 thead-yellow' : 'min-width-150 thead-yellow',
          width: isCollapsed ? 50 : 150,
          render: (record) => Helper.getPrice(record.KpiBonus),
        },
        {
          title: 'OT',
          key: 'name',
          className: 'thead-green',
          children: [
            {
              title: 'OT tính thuế ',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.OtTax),
            },
            {
              title: 'OT không tính thuế',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.OtNoTax),
            },
          ],
        },
        {
          title: 'Nghỉ không lương',
          key: 'name',
          className: isCollapsed
            ? 'min-width-50 thead-green text-primary'
            : 'min-width-150 thead-green text-primary',
          width: isCollapsed ? 50 : 150,
          render: (record) => record.UnpaidLeave,
        },
        {
          title: 'Ngày công thực tế trong tháng',
          key: 'name',
          className: isCollapsed
            ? 'min-width-50 thead-green text-primary'
            : 'min-width-150 thead-green text-primary',
          width: isCollapsed ? 50 : 150,
          render: (record) => record.TotalWork,
        },
        {
          title: 'Tổng thu nhập trong tháng',
          key: 'name',
          className: isCollapsed
            ? 'min-width-50 thead-green text-primary'
            : 'min-width-150 thead-green text-primary',
          width: isCollapsed ? 50 : 150,
          render: (record) => Helper.getPrice(record.TotalIncomeMonth),
        },
        {
          title: 'Người lao động',
          key: 'name',
          className: 'thead-primary',
          children: [
            {
              title: 'BHXH 8%',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-primary' : 'min-width-150 thead-primary',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.SocialInsuranceEmployee),
            },
            {
              title: 'BHYT 1.5%',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-primary' : 'min-width-150 thead-primary',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.HealthInsuranceEmployee),
            },
            {
              title: 'BHTN 1%',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-primary' : 'min-width-150 thead-primary',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.UnemploymentInsuranceEmployee),
            },
            {
              title: 'Điều chỉnh BHXH',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-primary' : 'min-width-150 thead-primary',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.SocialInsuranceAdjustedEmployee),
            },
          ],
        },
        {
          title: 'Công ty',
          key: 'name',
          className: 'thead-green',
          children: [
            {
              title: 'BHXH 17.5%',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.SocialInsuranceCompany),
            },
            {
              title: 'BHYT 3%',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.HealthInsuranceCompany),
            },
            {
              title: 'BHTN 1%',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.UnemploymentInsuranceCompany),
            },
            {
              title: 'Điều chỉnh BHXH',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.SocialInsuranceAdjustedCompany),
            },
            {
              title: 'Phí công đoàn',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.UnionDues),
            },
          ],
        },
        {
          title: 'Tham số tính thuế TNCN',
          key: 'name',
          className: 'thead-green',
          children: [
            {
              title: 'Số người phụ thuộc',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => record.DependentPerson,
            },
            {
              title: 'Tổng giảm trừ bản thân và người phụ thuộc',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.Eeduce),
            },
            {
              title: 'Đóng góp từ thiện',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.Charity),
            },
          ],
        },
        {
          title: 'Tổng các khoản giảm trừ',
          key: 'name',
          className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
          width: isCollapsed ? 50 : 150,
          render: (record) => Helper.getPrice(record.TotalReduce),
        },
        {
          title: 'Thu nhập tính thuế',
          key: 'name',
          className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
          width: isCollapsed ? 50 : 150,
          render: (record) => Helper.getPrice(record.RentalIncome),
        },
        {
          title: 'Thuế TNCN',
          key: 'name',
          className: isCollapsed ? 'min-width-50 thead-green' : 'min-width-150 thead-green',
          width: isCollapsed ? 50 : 150,
          render: (record) => Helper.getPrice(record.PersonalIncomeTax),
        },
        {
          title: 'Các khoản thanh toán không tính thuế',
          key: 'name',
          className: 'thead-yellow',
          children: [
            {
              title: 'Thanh toán từ BHXH',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-yellow' : 'min-width-150 thead-yellow',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.SocialInsurancePayment),
            },
            {
              title: 'Trừ các khoản đã chi tạm ứng',
              key: 'name',
              className: isCollapsed ? 'min-width-50 thead-yellow' : 'min-width-150 thead-yellow',
              width: isCollapsed ? 50 : 150,
              render: (record) => Helper.getPrice(record.Advance),
            },
          ],
        },
        {
          title: 'Ghi chú',
          key: 'note',
          className: isCollapsed ? 'min-width-50 thead-yellow' : 'min-width-150 thead-yellow',
          width: isCollapsed ? 50 : 150,
          render: (record) => record.Note,
        },
        {
          title: 'Lương thực nhận',
          key: 'name',
          className: isCollapsed
            ? 'min-width-50 thead-yellow text-primary'
            : 'min-width-150 thead-yellow text-primary',
          width: isCollapsed ? 50 : 150,
          fixed: 'right',
          render: (record) => Helper.getPrice(record.ActuallyReceived),
        },
    ];
    return columns;
  };

  onChangeCollapsed = () => {
    this.setStateData(
      (prevState) => ({
        isCollapsed: !prevState.isCollapsed,
      }),
      () => {
        this.props.dispatch({
          type: 'settings/CHANGE_SETTING_COLLAPSED',
          payload: {
            setting: 'isMenuCollapsed',
            value: this.state.isCollapsed,
          },
        });
      },
    );
  };

  addSummary = (data) => {
    if (!isEmpty(data.payrollDetail)) {
      return [
        ...data.payrollDetail,
        {
          key: 'TOTAL',
          totalIncome: data.payrollDetail.reduce((total, item) => total + item.totalIncome, 0),
          kpiBonus: data.payrollDetail.reduce((total, item) => total + item.kpiBonus, 0),
          otTax: data.payrollDetail.reduce((total, item) => total + item.otTax, 0),
          otNoTax: data.payrollDetail.reduce((total, item) => total + item.otNoTax, 0),
          unpaidLeave: data.payrollDetail.reduce((total, item) => total + item.unpaidLeave, 0),
          totalWork: data.payrollDetail.reduce((total, item) => total + item.totalWork, 0),
          totalIncomeMonth: data.payrollDetail.reduce(
            (total, item) => total + item.totalIncomeMonth,
            0,
          ),
          socialInsuranceEmployee: data.payrollDetail.reduce(
            (total, item) => total + item.socialInsuranceEmployee,
            0,
          ),
          healthInsuranceEmployee: data.payrollDetail.reduce(
            (total, item) => total + item.healthInsuranceEmployee,
            0,
          ),
          unemploymentInsuranceEmployee: data.payrollDetail.reduce(
            (total, item) => total + item.unemploymentInsuranceEmployee,
            0,
          ),
          socialInsuranceAdjustedEmployee: data.payrollDetail.reduce(
            (total, item) => total + item.socialInsuranceAdjustedEmployee,
            0,
          ),
          socialInsuranceCompany: data.payrollDetail.reduce(
            (total, item) => total + item.socialInsuranceCompany,
            0,
          ),
          healthInsuranceCompany: data.payrollDetail.reduce(
            (total, item) => total + item.healthInsuranceCompany,
            0,
          ),
          unemploymentInsuranceCompany: data.payrollDetail.reduce(
            (total, item) => total + item.unemploymentInsuranceCompany,
            0,
          ),
          socialInsuranceAdjustedCompany: data.payrollDetail.reduce(
            (total, item) => total + item.socialInsuranceAdjustedCompany,
            0,
          ),
          unionDues: data.payrollDetail.reduce((total, item) => total + item.unionDues, 0),
          dependentPerson: data.payrollDetail.reduce(
            (total, item) => total + item.dependentPerson,
            0,
          ),
          eeduce: data.payrollDetail.reduce((total, item) => total + item.eeduce, 0),
          charity: data.payrollDetail.reduce((total, item) => total + item.charity, 0),
          totalReduce: data.payrollDetail.reduce((total, item) => total + item.totalReduce, 0),
          rentalIncome: data.payrollDetail.reduce((total, item) => total + item.rentalIncome, 0),
          personalIncomeTax: data.payrollDetail.reduce(
            (total, item) => total + item.personalIncomeTax,
            0,
          ),
          socialInsurancePayment: data.payrollDetail.reduce(
            (total, item) => total + item.socialInsurancePayment,
            0,
          ),
          advance: data.payrollDetail.reduce((total, item) => total + item.advance, 0),
          actuallyReceived: data.payrollDetail.reduce(
            (total, item) => total + item.actuallyReceived,
            0,
          ),
          basicSalaryAndAllowance: data?.ColumnIncurredAllowance
            .filter((item) => item.code !== 'TI_LE_THU_VIEC')
            .map((item) => {
              let summary = 0;
              data.payrollDetail.forEach((itemPage) => {
                if (!isEmpty(itemPage.basicSalaryAndAllowance)) {
                  const basic = itemPage.basicSalaryAndAllowance.find(
                    (itemBasic) => itemBasic.code === item.code,
                  );
                  if (basic) summary += toNumber(basic.value);
                }
              });
              return {
                ...item,
                value: summary,
              };
            }),
          incurredAllowance: data?.ColumnIncurredAllowance.map((item) => {
            let summary = 0;
            data.payrollDetail.forEach((itemPage) => {
              if (!isEmpty(itemPage.incurredAllowance)) {
                const basic = itemPage.incurredAllowance.find(
                  (itemBasic) => itemBasic.code === item.code,
                );
                if (basic) summary += toNumber(basic.value);
              }
            });
            return {
              ...item,
              value: summary,
            };
          }),
        },
      ];
    }
    return [];
  };

  exportData = async (id, type) => {
    const { branches } = this.props;
    const { search } = this.state;
    const dataBranch = branches?.find((i) => i?.id === search?.branchId);
    if (type === 'payrolls') {
      this.setState({
        loadingDownload: true,
      });
      await Helper.exportExcel(
        `/v1/export-payrolls`,
        {
          id,
          salaryForeigner: 'false',
        },
        `${dataBranch ? `${dataBranch?.name} ` : ''}Bảng Lương ${Helper.getDate(
          search.month,
          variables.DATE_FORMAT.MONTH_FULL,
        )}.xlsx`,
      );
      this.setState({
        loadingDownload: false,
      });
    }
    if (type === 'payment-template') {
      this.setState({
        loadingSalary: true,
      });
      await Helper.exportExcel(
        `/v1/export-salary-payment-template`,
        {
          id,
          salaryForeigner: 'false',
        },
        `${dataBranch ? `${dataBranch?.name} ` : ''}Bảng Thanh Toán Lương ${Helper.getDate(
          search.month,
          variables.DATE_FORMAT.MONTH_FULL,
        )}.xlsx`,
      );
      this.setState({
        loadingSalary: false,
      });
    }
    if (type === 'template-go-to-bank') {
      this.setState({
        loadingBank: true,
      });
      await Helper.exportExcel(
        `/v1/export-salary-template-go-to-bank`,
        {
          id,
          salaryForeigner: 'false',
        },
        `${dataBranch ? `${dataBranch?.name} ` : ''}Bảng Lương Đi Ngân Hàng ${Helper.getDate(
          search.month,
          variables.DATE_FORMAT.MONTH_FULL,
        )}.xlsx`,
      );
      this.setState({
        loadingBank: false,
      });
    }
  };

  render() {
    const {
      data,
      error,
      match: { params },
      loading: { effects },
      divisions,
      branches,
      employees,
    } = this.props;

    const { search, isCollapsed, loadingDownload, loadingSalary, loadingBank } = this.state;
    const loading = effects['hrmSalary/GET_DATA'];
    return (
      <>
        <Helmet title="Bảng lương" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">BẢNG LƯƠNG</Text>
            <div className={styles['tab-switch']}>
              <div
                className={classnames(styles['tab-item'], {
                  [styles.active]: !isCollapsed,
                })}
                role="presentation"
                onClick={this.onChangeCollapsed}
              >
                Hiển thị rộng
              </div>
              <div
                className={classnames(styles['tab-item'], {
                  [styles.active]: isCollapsed,
                })}
                role="presentation"
                onClick={this.onChangeCollapsed}
              >
                Hiển thị hẹp
              </div>
            </div>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                month: search.month && moment(search.month),
                divisionId: search.divisionId || null,
                branchId: search.branchId || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="month"
                    onChange={(event) => this.onChangeDate(event, 'month')}
                    type={variables.MONTH_PICKER}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả cơ sở' }, ...branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả bộ phận' }, ...divisions]}
                    name="divisionId"
                    onChange={(event) => this.onChangeSelect(event, 'divisionId')}
                    type={variables.SELECT}
                  />
                </div>
                {data.id && (
                  <div className="col-lg-3">
                    <Button
                      color="success"
                      onClick={() => this.exportData(data.id, 'payrolls')}
                      loading={loadingDownload}
                    >
                      Xuất bảng lương
                    </Button>
                  </div>
                )}
                <div className="col-lg-6">
                  <FormItem
                    data={Helper.convertSelectUsers(employees)}
                    name="employeeId"
                    onChange={(event) => this.onChangeSelect(event, 'employeeId')}
                    type={variables.SELECT_MUTILPLE}
                    placeholder="Chọn tất cả"
                  />
                </div>
                {/* <div className="col-lg-6 d-flex">
                  <Button
                    color="success"
                    onClick={() => this.exportData(data.id, 'payment-template')}
                    loading={loadingSalary}
                  >
                    Xuất bảng Thanh toán lương
                  </Button>
                  <Button
                    color="success"
                    className="ml10"
                    onClick={() => this.exportData(data.id, 'template-go-to-bank')}
                    loading={loadingBank}
                  >
                    Xuất bảng lương đi ngân hàng
                  </Button>
                </div> */}
              </div>
            </Form>
            <TableCus
              bordered
              className={classnames('table-salary', { 'table-salary-collapsed': isCollapsed })}
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              defaultExpandAllRows
              childrenColumnName="children"
              pagination={false}
              error={error}
              isError={error.isError}
              rowClassName={(record) => (record.key === 'TOTAL' ? 'total-row' : '')}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id || record.key}
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
  divisions: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  loading: {},
  dispatch: {},
  location: {},
  error: {},
  divisions: [],
  branches: [],
  employees: [],
};

export default Index;
