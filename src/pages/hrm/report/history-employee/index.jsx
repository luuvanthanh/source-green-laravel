import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import ability from '@/utils/ability';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
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
const mapStateToProps = ({ loading, user, HRMReportHistoryEmployee }) => ({
    loading,
    data: HRMReportHistoryEmployee.data,
    divisions: HRMReportHistoryEmployee.divisions,
    branches: HRMReportHistoryEmployee.branches,
    positions: HRMReportHistoryEmployee.positions,
    error: HRMReportHistoryEmployee.error,
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
                page: query?.page || variables.PAGINATION.PAGE,
                limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
                SearchDate: query.SearchDate ? moment(query.SearchDate) : "",
            },
            dataIDSearch: [],
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
            type: 'HRMReportHistoryEmployee/GET_DATA',
            payload: {
                ...search,
            },
        });
        history.push(
            `${pathname}?${Helper.convertParamSearchConvert(
                {
                    ...search,
                    SearchDate: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
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
            type: 'HRMReportHistoryEmployee/GET_BRANCHES',
            payload: {},
        });
        dispatch({
            type: 'HRMReportHistoryEmployee/GET_DIVISIONS',
            payload: {},
        });
        dispatch({
            type: 'HRMReportHistoryEmployee/GET_POSITIONS',
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

    debouncedSearchDateRank = debounce((startDate, endDate) => {
        this.setStateData(
            (prevState) => ({
                search: {
                    ...prevState.search,
                    startDate,
                    endDate,
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
    onChangeDate = (e) => {
        this.debouncedSearchDateRank(
            moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
            moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
        );
        this.setStateData({ dataIDSearch: e });
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
                title: 'Tên nhân sự',
                key: 'fullName',
                className: 'min-width-250',
                width: 250,
                align: 'center',
                render: (record) => <div className='d-flex w-100 justify-content-start'>
                    <Text size="normal">{record?.fullName}</Text>
                </div>,
            },
            {
                title: 'Ngày sinh',
                key: 'dateOfBirth',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.dateOfBirth}</Text>,
            },
            {
                title: 'Số điện thoại',
                key: 'phoneNumber',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.phoneNumber}</Text>,
            },
            {
                title: 'Địa chỉ',
                key: 'address',
                className: 'min-width-250',
                width: 250,
                render: (record) => <Text size="normal">{record?.address}</Text>,
            },
            {
                title: 'Số sổ bảo hiểm',
                key: 'numberSocialInsurance',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.numberSocialInsurance}</Text>,
            },
            {
                title: 'Giới tính',
                key: 'gender',
                className: 'min-width-100',
                width: 100,
                render: (record) => <Text size="normal">{record?.gender}</Text>,
            },
            {
                title: 'Ngày bắt đầu làm việc',
                key: 'startDateWorking',
                className: 'min-width-170',
                width: 170,
                render: (record) => <Text size="normal">{record.startDateWorking}</Text>,
            },
            {
                title: 'Ngày hiện tại',
                key: 'dateNow',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.dateNow}</Text>,
            },
            {
                title: 'Số tháng làm việc',
                key: 'numberMonthWorking',
                className: 'min-width-150',
                width: 150,
                render: (record) => <div className='d-flex w-100 justify-content-center'>
                    <Text size="normal">{record?.numberMonthWorking}</Text>
                </div>,
            },
            {
                title: 'Số phép',
                key: 'numberAbsent',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record.numberAbsent}</Text>,
            },

            {
                title: 'Đã nghỉ',
                key: 'absent',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.absent}</Text>,
            },
            {
                title: 'Còn lại',
                key: 'remainingAbsent',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.remainingAbsent}</Text>,
            },
            {
                title: 'Bộ phận',
                key: 'division',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.division}</Text>,
            },
            {
                title: 'Chức vụ',
                key: 'position',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.position}</Text>,
            },
            {
                title: 'Số hợp đồng lao động',
                key: 'numberLabourContract',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.numberLabourContract}</Text>,
            },
            {
                title: 'Ngày ký',
                key: 'contractDate',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.contractDate}</Text>,
            },
            {
                title: 'HĐ/năm',
                key: 'typeOfContract',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.typeOfContract}</Text>,
            },

        ];
        return columns;
    };

    handleCancel = () => this.setStateData({ visible: false });

    onChangeExcel = () => {
        const { dataIDSearch } = this.state;
        const {
            defaultBranch,
            location: { query },
        } = this.props;
        Helper.exportExcel(
            `/v1/export-excel-absents`,
            {
                divisionId: query?.divisionId,
                employeeId: query?.employeeId,
                branchId: query?.branchId || defaultBranch?.id,
                startDate: dataIDSearch?.length > 0 ?
                    moment(dataIDSearch[0]).format(variables.DATE_FORMAT.DATE_AFTER)
                    : "",
                endDate: dataIDSearch?.length > 0 ?
                    moment(dataIDSearch[1]).format(variables.DATE_FORMAT.DATE_AFTER)
                    : "",
            },
            `Baocaonhanviendangnghi.xlsx`,
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


    render() {
        const {
            data,
            error,
            branches,
            pagination,
            match: { params },
            loading: { effects },
        } = this.props;
        const { search } = this.state;
        return (
            <>
                <Helmet title="Lịch sử nhân sự" />
                <div className={classnames(styles['content-form'], styles['content-form-children'])}>
                    {/* FORM SEARCH */}
                    <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                        <Text color="dark">Lịch sử nhân sự</Text>
                    </div>
                    <div className={classnames(styles['block-table'])}>
                        <Form
                            initialValues={{
                                ...search,
                                branchId: search.branchId || null,
                                classId: search.classId || null,
                                SearchDate: search.SearchDate && moment(search.SearchDate) || null,
                            }}
                            layout="vertical"
                            ref={this.formRef}
                        >
                            <div className="row">
                                <div className="col-lg-3">
                                    <FormItem
                                        name="fullName"
                                        onChange={(event) => this.onChange(event, 'fullName')}
                                        placeholder="Nhập từ khóa tìm kiếm"
                                        type={variables.INPUT_SEARCH}
                                        disabled={(effects['HRMReportHistoryEmployee/GET_DATA'])}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <FormItem
                                        data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                                        name="branchId"
                                        onChange={(event) => this.onChangeSelect(event, 'branchId')}
                                        type={variables.SELECT}
                                        allowClear={false}
                                        loading={effects['HRMReportHistoryEmployee/GET_DATA']}

                                    />
                                </div>
                            </div>
                        </Form>
                        <div className={stylesModule['wrapper-table']}>
                            <Table
                                columns={this.header(params)}
                                dataSource={data}
                                loading={effects['HRMReportHistoryEmployee/GET_DATA']}
                                error={error}
                                isError={error.isError}
                                onRow={(record) => ({
                                    onClick: () => {
                                        if (!record?.children && ability.can('HRM', 'HRM')) {
                                            history.push(`/quan-ly-nhan-su/lich-su-nhan-su/${record.id}/chi-tiet`);
                                        }
                                    },
                                })}
                                defaultExpandAllRows
                                childrenColumnName="children"
                                bordered
                                pagination={this.pagination(pagination)}
                                params={{
                                    header: this.header(),
                                    type: 'table',
                                }}
                                rowKey={(record) => record?.name || record?.id}
                                scroll={{ x: '100%', y: '60vh' }}
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
    location: {},
    branches: [],
    error: {},
    defaultBranch: {},
};

export default Index;