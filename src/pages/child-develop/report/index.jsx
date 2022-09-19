import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, head } from 'lodash';
import { Helmet } from 'react-helmet';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';

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
const mapStateToProps = ({ childDevelopReport, loading, user }) => ({
    data: childDevelopReport.data,
    error: childDevelopReport.error,
    pagination: childDevelopReport.pagination,
    classes: childDevelopReport.classes,
    branches: childDevelopReport.branches,
    defaultBranch: user.defaultBranch,
    loading,
    user: user.user,
});
@connect(mapStateToProps)
class Index extends PureComponent {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        const {
            defaultBranch,
            location: { query },
            user
        } = props;
        this.state = {
            defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
            search: {
                key: query?.key,
                page: query?.page || variables.PAGINATION.PAGE,
                limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
                branchId: query?.branchId || defaultBranch?.id,
                classId: query?.classId || user?.role === "Teacher" && head(user?.objectInfo?.classTeachers)?.classId,
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
            callback: (response) => {
                if (response) {
                    this.setStateData({
                        dataSource: response.parsePayload,
                    });
                }
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

    loadCategories = () => {
        const { dispatch } = this.props;
        const { search } = this.state;
        dispatch({
            type: 'childDevelopReport/GET_BRANCHES',
            payload: {},
        });
        if (search?.branchId) {
            dispatch({
                type: 'childDevelopReport/GET_CLASSES',
                payload: {
                    branch: search?.branchId,
                },
            });
        }
    };

    /**
     * Function header table
     */
    header = () => {
        const {
            location: { pathname },
        } = this.props;
        const columns = [
            {
                title: 'STT ',
                key: 'index',
                width: 80,
                render: (text, record, index) =>
                    Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
            },
            {
                title: 'Tên học sinh',
                key: 'full_name',
                width: 250,
                render: (record) => (
                    <AvatarTable
                        fileImage={Helper.getPathAvatarJson(record.fileImage)}
                        fullName={record?.fullName}
                    />
                )
            },
            {
                title: 'Năm học',
                key: 'year',
                width: 150,
                className: 'min-width-150',
                render: (record) => record?.schoolYear?.yearFrom ? <Text size="normal">{record?.schoolYear?.yearFrom} - {record?.schoolYear?.yearTo}</Text> : "",
            },
            {
                title: 'Tuổi (tháng)',
                key: 'birth_day',
                width: 150,
                render: (record) => <Text size="normal">{record?.age_month} Tháng</Text>,
            },
            {
                title: 'Cơ sở',
                key: 'age',
                width: 150,
                render: (value, record) => (
                    <div className='d-flex' >
                        {record.classStudent?.class?.branch?.name}
                    </div>
                ),
            },
            {
                title: 'Lớp',
                key: 'age',
                width: 150,
                render: (value, record) => (
                    <div className='d-flex' >
                        {record.classStudent?.class?.name}
                    </div>
                ),
            },
            {
                title: 'Ngày vào lớp',
                key: 'time',
                width: 150,
                render: (record) => Helper.getDate(record?.registerDate, variables.DATE_FORMAT.DATE),
            },
            {
                key: 'action',
                width: 100,
                clasName: "min-width-100 max-width-100",
                fixed: 'right',
                render: (record) => (
                    <div className={styles['list-button']}>
                        <Button
                            color="success"
                            onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
                        >
                            Chi tiết
                        </Button>
                    </div>
                ),
            },
        ];
        return columns;
    };

    /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
    onChangeDate = (e, type) => {
        if (e) {
            this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
            this.setStateData({ dataIDSearch: e });
        } else {
            this.debouncedSearch(e, type);
            this.setStateData({ dataIDSearch: e });
        }
    };

    onChangeSelectBranch = (e) => {
        this.debouncedSearch(e, "branchId");
        const { dispatch } = this.props;
        dispatch({
            type: 'childDevelopReport/GET_CLASSES',
            payload: {
                branch: e,
            },
        });
    };

    render() {
        const {
            classes,
            branches,
            data,
            match: { params },
            pagination,
            defaultBranch,
            loading: { effects },
            user,
        } = this.props;

        const { search, defaultBranchs } = this.state;
        const loading = effects['childDevelopReport/GET_DATA'];
        return (
            <>
                <Helmet title="Theo dõi sự phát triển của trẻ" />
                <div className={classnames(styles['content-form'], styles['content-form-children'])}>
                    <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                        <Text color="dark">Theo dõi sự phát triển của trẻ</Text>
                    </div>
                    <div className={styles['block-table']}>
                        <Form
                            initialValues={{
                                ...search,
                                branchId: search.branchId || null,
                                Class: search.Class || null,
                            }}
                            layout="vertical"
                            ref={this.formRef}
                        >
                            <div className="row">
                                <div className="col-lg-4">
                                    <FormItem
                                        name="key"
                                        onChange={(event) => this.onChange(event, 'key')}
                                        placeholder="Nhập từ khóa"
                                        type={variables.INPUT_SEARCH}
                                    />
                                </div>
                                {
                                    !defaultBranch?.id && (
                                        <div className="col-lg-3">
                                            <FormItem
                                                data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                                                name="branchId"
                                                onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                type={variables.SELECT}
                                                placeholder="Chọn cơ sở"
                                                allowClear={false}
                                            />
                                        </div>
                                    )
                                }
                                {
                                    defaultBranch?.id && (
                                        <div className="col-lg-3">
                                            <FormItem
                                                data={defaultBranchs}
                                                name="branchId"
                                                onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                                                type={variables.SELECT}
                                                placeholder="Chọn cơ sở"
                                                allowClear={false}
                                            />
                                        </div>
                                    )
                                }

                                <div className="col-lg-3">
                                    <FormItem
                                        data={user?.role === "Teacher" ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả', id: null }, ...classes]}
                                        name="classId"
                                        onChange={(event) => this.onChangeSelect(event, 'classId')}
                                        type={variables.SELECT}
                                        placeholder="Chọn lớp"
                                        allowClear={false}
                                    />
                                </div>
                            </div>
                        </Form>
                        <Table
                            bordered={false}
                            columns={this.header(params)}
                            dataSource={data}
                            loading={loading}
                            pagination={this.pagination(pagination)}
                            params={{
                                header: this.header(),
                                type: 'table',
                            }}
                            rowKey={(record) => record.id}
                            scroll={{ x: '100%', y: '60vh' }}
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
    branches: PropTypes.arrayOf(PropTypes.any),
    classes: PropTypes.arrayOf(PropTypes.any),
    data: PropTypes.arrayOf(PropTypes.any),
    defaultBranch: PropTypes.objectOf(PropTypes.any),
    user: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
    match: {},
    pagination: {},
    loading: {},
    dispatch: {},
    location: {},
    branches: [],
    classes: [],
    data: [],
    defaultBranch: {},
    user: {},
};

export default Index;