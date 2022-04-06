import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import stylesModule from './styles.module.scss';


const dataTime = (n) => {
  const allTime = [];
  for (let i = 0; i < n + 1; i += 1) {
      allTime.push({ name: `${i} Năm` });
  }

  return allTime.map((i, id) => ({ id, ...i }));
};

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
const mapStateToProps = ({ medicalStudentProblem, loading, user, HRMWorkingSeniority }) => ({
    loading,
    pagination: HRMWorkingSeniority.pagination,
    data: HRMWorkingSeniority.data,
    divisions: HRMWorkingSeniority.divisions,
    branches: HRMWorkingSeniority.branches,
    employees: HRMWorkingSeniority.employees,
    error: medicalStudentProblem.error,
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
            search: {
                KeyWord: query?.KeyWord,
                branchId: query?.branchId || defaultBranch?.id,
                page: query?.page || "",
                limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
                date: query.date ? moment(query.date) : moment().format(variables.DATE_FORMAT.DATE_AFTER),
            },
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
     * @returns {void} call this.setState to upSearchDate state
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
            type: 'HRMWorkingSeniority/GET_DATA',
            payload: {
                ...search,
            },
        });
        history.push(
            `${pathname}?${Helper.convertParamSearchConvert(
                {
                    ...search,
                    date: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
                },
                variables.QUERY_STRING,
            )}`,
        );
    };

    /**
     * Function load branches
     */
    loadCategories = () => {
        const { dispatch } = this.props;
        const { search } = this.state;
        if (search.branchId) {
            dispatch({
                type: 'medicalStudentProblem/GET_CLASSES',
                payload: {
                    branch: search.branchId,
                },
            });
        }
        dispatch({
            type: 'HRMWorkingSeniority/GET_BRANCHES',
            payload: {},
        });
        dispatch({
            type: 'HRMWorkingSeniority/GET_DIVISIONS',
            payload: {},
        });
        dispatch({
            type: 'HRMWorkingSeniority/GET_EMPLOYEES',
            payload: {},
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
     * Function change select
     * @param {object} e value of select
     * @param {string} type key of object search
     */
    onChangeSelect = (e, type) => {
        this.debouncedSearch(e, type);
    };

    /**
     * Function change select
     * @param {object} e value of select
     * @param {string} type key of object search
     */
    onChangeSelectBranch = (e, type) => {
        const { dispatch } = this.props;
        this.debouncedSearch(e, type);
        dispatch({
            type: 'medicalStudentProblem/GET_CLASSES',
            payload: {
                branch: e,
            },
        });
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
    }, 200);

    /**
     * Function change input
     * @param {object} e event of input
     * @param {string} type key of object search
     */
    onChangeDate = (e , type) => {
      this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
    };

    /**
     * Function pagination of table
     * @param {object} pagination value of pagination items
     */
    pagination = (pagination) => {
        const {
            location: { query },
        } = this.props;
        return Helper.paginationLavarel({
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
        const { search } = this.state;
        const columns = [
          {
            title: 'STT',
            align: 'center',
            render: (value, _, index) => <>{Helper.serialOrder(search?.page, index, search?.limit)}</>, 
          },
          {
            title: 'Mã NV',
            key: 'code',
            render: (record) => <Text size="normal">{record?.employeeCode}</Text>,
          },
          {
            title: 'Tên nhân viên',
            key: 'name',
            render: (record) => <Text size="normal">{record?.employeeName}</Text>,
          },
          {
            title: 'Chức vụ',
            key: 'position',
            render: (record) => <Text size="normal">{record?.position}</Text>,
          },
          {
            title: 'Cơ sở',
            key: 'division',
            render: (record) => <Text size="normal">{record?.branch}</Text>,
          },
          {
            title: 'Thâm niên công tác',
            children: [
              {
                title: 'Ngày bắt đầu làm việc',
                key: 'start_date',
                render: (record) => Helper.getDate(record?.contractFrom, variables.DATE_FORMAT.DATE),
              },
              {
                title: 'Số năm làm việc',
                key: 'year_working',
                render: (record) => <Text size="normal">{record?.numberYearWork}</Text>,
              },
              {
                title: 'Số tháng làm việc',
                key: 'month_working',
                render: (record) => <Text size="normal">{record?.numberMonthWork}</Text>,
              },
            ],
          },
        ];
        return columns;
    };

    onChangeExcel = () => {
        const {
            defaultBranch,
            location: { query },
        } = this.props;
        Helper.exportExcel(
            `/v1/export-excel-working-seniority`,
            {
                employeeId: query?.employeeId,
                number_year_work_from: query?.number_year_work_from,
                number_year_work_to: query?.number_year_work_to,
                branchId: query?.branchId || defaultBranch?.id,
                date: query?.date ? moment(query.date) : moment().format(variables.DATE_FORMAT.DATE_AFTER),
            },
            `Baocaothamniencongtac.xlsx`,
        );
    };

    handleCancel = () => this.setStateData({ visible: false });

    render() {
        const {
            data,
            error,
            branches,
            employees,
            pagination,
            match: { params },
            loading: { effects },
        } = this.props;
        const { search, } = this.state;
        const loading = effects['medicalStudentProblem/GET_DATA'];
        return (
            <>
                <Helmet title="Báo cáo thâm niên công tác" />
                <div className={classnames(styles['content-form'], styles['content-form-children'])}>
                    {/* FORM SEARCH */}
                    <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                        <Text color="dark">Báo cáo thâm niên công tác</Text>
                        <Button color="primary" icon="export" className="ml-2" onClick={this.onChangeExcel}>
                            Xuất Excel
                        </Button>
                    </div>
                    <div className={classnames(styles['block-table'])}>
                        <Form
                            initialValues={{
                                ...search,
                                branchId: search.branchId || null,
                                classId: search.classId || null,
                                date: search.date && moment(search.date) || null,
                            }}
                            layout="vertical"
                            ref={this.formRef}
                        >
                            <div className="row">
                                <div className="col-lg-3">
                                    <FormItem
                                        name="date"
                                        onChange={(event) => this.onChangeDate(event, 'date')}
                                        type={variables.DATE_PICKER}
                                        allowClear={false}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <FormItem
                                        data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                                        name="branchId"
                                        onChange={(event) => this.onChangeSelect(event, 'branchId')}
                                        type={variables.SELECT}
                                        allowClear={false}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <FormItem
                                        data={ dataTime(100)}
                                        name="number_year_work_from"
                                        placeholder="Chọn số năm làm việc từ"
                                        onChange={(event) => this.onChangeSelect(event, 'number_year_work_from')}
                                        type={variables.SELECT}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <FormItem
                                        data={dataTime(100)}
                                        name="number_year_work_to"
                                        placeholder="Chọn số năm làm việc đến"
                                        onChange={(event) => this.onChangeSelect(event, 'number_year_work_to')}
                                        type={variables.SELECT}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <FormItem
                                        data={[{ id: null, fullName: 'Chọn tất cả nhân viên' }, ...employees]}
                                        name="employeeId"
                                        options={['id', 'fullName']}
                                        placeholder="Chọn nhân viên"
                                        onChange={(event) => this.onChangeSelect(event, 'employeeId')}
                                        type={variables.SELECT}
                                        allowClear={false}
                                    />
                                </div>
                            </div>
                        </Form>
                        <div className={stylesModule['wrapper-table']}>
                            <Table
                                columns={this.header(params)}
                                dataSource={data}
                                loading={loading}
                                error={error}
                                isError={error.isError}
                                defaultExpandAllRows
                                childrenColumnName="children"
                                bordered
                                pagination={this.pagination(pagination)}
                                params={{
                                    header: this.header(),
                                    type: 'table',
                                }}
                                rowKey={(record) => record?.name || record?.id}
                                scroll={{ x: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

Index.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.arrayOf(PropTypes.any),
    pagination: PropTypes.objectOf(PropTypes.any),
    loading: PropTypes.objectOf(PropTypes.any),
    employees: PropTypes.arrayOf(PropTypes.any),
    dispatch: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    branches: PropTypes.arrayOf(PropTypes.any),
    error: PropTypes.objectOf(PropTypes.any),
    defaultBranch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
    match: {},
    data: [],
    pagination: {},
    loading: {},
    dispatch: {},
    employees: [],
    location: {},
    branches: [],
    error: {},
    defaultBranch: {},
};

export default Index;