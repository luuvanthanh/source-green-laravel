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
import Heading from '@/components/CommonComponent/Heading';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import stylesModule from '../styles.module.scss';

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
const mapStateToProps = ({ medicalStudentProblem, loading, user, feePolicyReport }) => ({
    loading,
    data: feePolicyReport?.data,
    error: medicalStudentProblem.error,
    classes: medicalStudentProblem.classes,
    branches: medicalStudentProblem.branches,
    pagination: medicalStudentProblem.pagination,
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
            defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
            search: {
                KeyWord: query?.KeyWord,
                branchId: query?.branchId || defaultBranch?.id,
                page: query?.page || variables.PAGINATION.PAGE,
                limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
                date: query.date ? moment(query.date) : moment(),
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
            type: 'medicalStudentProblem/GET_DATA',
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
            type: 'medicalStudentProblem/GET_BRACHES',
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

    /**
     * Function change input
     * @param {object} e event of input
     * @param {string} type key of object search
     */
    onChangeDate = (e, type) => {
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
                title: 'Lớp',
                dataIndex: 'name',
                width: 200,
                key: 'name',
            },
            {
                title: 'Mã HS',
                dataIndex: 'code',
                width: 80,
                key: 'code',
            },
            {
                title: 'Tên HS',
                dataIndex: 'nameStudent',
                width: 200,
                key: 'date',
            },
            {
                title: 'Ngày nhập học',
                dataIndex: 'birthDay',
                width: 150,
                key: 'birthDay',
            },
            {
                title: 'Tháng',
                dataIndex: 'date',
                width: 150,
                key: 'addageress',
            },
            {
                title: 'Học phí (đ)',
                dataIndex: 'money',
                width: 150,
                key: 'addageress',
            },
            {
                title: 'Tiền ăn (đ)',
                dataIndex: 'money',
                width: 150,
                key: 'addageress',
            },
            {
                title: 'Tiếng Anh (đ)',
                dataIndex: 'money',
                width: 150,
                key: 'addageress',
            },
            {
                title: 'Bus (đ)',
                dataIndex: 'money',
                width: 150,
                key: 'addageress',
            },
            {
                title: 'Ngoài giờ (đ)',
                dataIndex: 'money',
                width: 150,
                key: 'addageress',
            },
            {
                title: 'Giảm trừ (đ)',
                dataIndex: 'money',
                width: 150,
                key: 'addageress',
            },
            {
                title: 'Tổng tiền (đ)',
                dataIndex: 'money',
                width: 150,
                key: 'month',
            },
        ];
        return columns;
    };

    handleCancel = () => this.setStateData({ visible: false });

    render() {
        const {
            data,
            error,
            classes,
            branches,
            pagination,
            defaultBranch,
            match: { params },
            loading: { effects },
        } = this.props;
        const { search, defaultBranchs } = this.state;
        const loading = effects['medicalStudentProblem/GET_DATA'];
        return (
            <>
                <Helmet title="Báo cáo tiền hoàn phí" />
                <div className={classnames(styles['content-form'], styles['content-form-children'])}>
                    {/* FORM SEARCH */}
                    <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                        <Text color="dark">Báo cáo tiền hoàn phí</Text>
                    </div>
                    <div className='card'>
                        <Form
                            initialValues={{
                                ...search,
                                branchId: search.branchId || null,
                                classId: search.classId || null,
                                date: search.date && moment(search.date),
                            }}
                            layout="vertical"
                            ref={this.formRef}
                        >
                            <div className={stylesModule['wrapper-top']}>
                                <div className="row">
                                    <div className='col-lg-10 d-flex' >
                                        <div className="col-lg-3">
                                            <FormItem
                                                label="Thời gian nghỉ học"
                                                name="date"
                                                type={variables.RANGE_PICKER}
                                                allowClear={false}
                                            />
                                        </div>
                                        {!defaultBranch?.id && (
                                            <div className="col-lg-3">
                                                <FormItem
                                                    label="Cơ sở"
                                                    data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
                                                    name="branchId"
                                                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                    type={variables.SELECT}
                                                    allowClear={false}
                                                />
                                            </div>
                                        )}
                                        {defaultBranch?.id && (
                                            <div className="col-lg-3">
                                                <FormItem
                                                    label="Cơ sở"
                                                    data={defaultBranchs}
                                                    name="branchId"
                                                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                    type={variables.SELECT}
                                                    allowClear={false}
                                                />
                                            </div>
                                        )}
                                        <div className="col-lg-3">
                                            <FormItem
                                                label="Loại học sinh"
                                                data={[{ id: null, name: 'Tất cả Loại học sinh' }, ...classes]}
                                                name="classId"
                                                onChange={(event) => this.onChangeSelect(event, 'classId')}
                                                type={variables.SELECT}
                                                allowClear={false}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <FormItem
                                                label="Học sinh "
                                                data={[{ id: null, name: 'Tất cả Học sinh ' }, ...branches]}
                                                name="branchId"
                                                onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                type={variables.SELECT}
                                                allowClear={false}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-2 d-flex flex-row-reverse w-100 align-items-end'>
                                        <Button color="success" icon="report" className="ml-4 " >
                                            Tải dữ liệu
                                        </Button>
                                    </div>

                                </div>

                            </div>
                        </Form>
                    </div>

                    <div className={classnames(styles['block-table'])}>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <Heading type="form-title"  >
                                Chi tiết báo cáo tiền hoàn phí
                            </Heading>
                            <Button color="primary" icon="export" className="ml-2">
                                Xuất Excel
                            </Button>
                        </div>
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
                                rowKey={(record) => record.key || record.id}
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
    dispatch: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    branches: PropTypes.arrayOf(PropTypes.any),
    error: PropTypes.objectOf(PropTypes.any),
    classes: PropTypes.arrayOf(PropTypes.any),
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
    classes: [],
    defaultBranch: {},
};

export default Index;
