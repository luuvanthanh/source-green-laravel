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
import AvatarTable from '@/components/CommonComponent/AvatarTable';
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
const mapStateToProps = ({ loading, user, childDevelopReport }) => ({
    loading,
    data: childDevelopReport?.data,
    error: childDevelopReport.error,
    classes: childDevelopReport.classes,
    branches: childDevelopReport.branches,
    pagination: childDevelopReport.pagination,
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
            type: 'childDevelopReport/GET_DATA',
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
                type: 'childDevelopReport/GET_CLASSES',
                payload: {
                    branch: search.branchId,
                },
            });
        }
        dispatch({
            type: 'childDevelopReport/GET_BRACHES',
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
            type: 'childDevelopReport/GET_CLASSES',
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
                title: 'Học sinh',
                width: 200,
                key: 'name',
                render: (value, row, index) => {
                    const obj = {
                        children: (
                            <div className={stylesModule['table-name']}>
                                <AvatarTable
                                    fileImage={Helper.getPathAvatarJson(value.file_image)}
                                />
                                <h4 className={stylesModule.title}>{value.name}</h4>
                                <p className={stylesModule.detail}>{value.detail}</p>
                            </div>
                        ),
                        props: {},
                    };
                    if (index % 8 === 0) {
                        obj.props.rowSpan = 3;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                },

            },
            {
                title: 'Tên KN',
                key: 'monsey',
                width: 200,
                render: (record) =>
                    <div >
                        {record.namekh}
                    </div>
            },
            {
                title: 'Test đầu vào',
                width: 200,
                key: 'date',
                render: (record) =>
                    <div >
                        {record.test}
                    </div>
            },
            {
                title: '2020',
                width: 150,
                key: '2020',
                children: [
                    {
                        title: 'Kì I',
                        width: 200,
                        key: 'date',

                        render: (record) =>
                            <div >
                                {record.test}
                            </div>
                    },
                    {
                        title: 'Kì II',
                        width: 200,
                        key: 'date',

                        render: (record) =>
                            <div >
                                {record.test}
                            </div>
                    },
                ]
            },
            {
                title: '2021',
                width: 150,
                key: '2021',
                children: [
                    {
                        title: 'Kì I',
                        width: 200,
                        key: 'date',
                        render: (record) =>
                            <div >
                                {record.test}
                            </div>
                    },
                ]
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
        const loading = effects['childDevelopReport/GET_DATA'];
        return (
            <>
                <Helmet title="Theo dõi sự phát triển của trẻ" />
                <div className={classnames(styles['content-form'], styles['content-form-children'])}>
                    {/* FORM SEARCH */}
                    <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                        <Text color="dark">Theo dõi sự phát triển của trẻ</Text>
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
                                        <div className="col-lg-2">
                                            <FormItem
                                                data={[{ id: null, name: 'Tất cả năm học' }, ...branches]}
                                                name="branchId"
                                                onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                type={variables.SELECT}
                                                allowClear={false}
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <FormItem
                                                data={[{ id: null, name: 'Tất cả kỳ học' }, ...classes]}
                                                name="classId"
                                                onChange={(event) => this.onChangeSelect(event, 'classId')}
                                                type={variables.SELECT}
                                                allowClear={false}
                                            />
                                        </div>
                                        {!defaultBranch?.id && (
                                            <div className="col-lg-2">
                                                <FormItem
                                                    data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
                                                    name="branchId"
                                                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                    type={variables.SELECT}
                                                    allowClear={false}
                                                />
                                            </div>
                                        )}
                                        {defaultBranch?.id && (
                                            <div className="col-lg-2">
                                                <FormItem
                                                    data={defaultBranchs}
                                                    name="branchId"
                                                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                    type={variables.SELECT}
                                                    allowClear={false}
                                                />
                                            </div>
                                        )}
                                        <div className="col-lg-2">
                                            <FormItem
                                                data={[{ id: null, name: 'Tất cả lớp' }, ...branches]}
                                                name="branchId"
                                                onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                type={variables.SELECT}
                                                allowClear={false}
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <FormItem
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
                                            Thống kê
                                        </Button>
                                    </div>

                                </div>

                            </div>
                        </Form>
                    </div>

                    <div className={classnames(styles['block-table'])}>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <Heading type="form-title"  >
                                Thống kê sự phát triển của trẻ
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
                                childrenColumnName="feeType"
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