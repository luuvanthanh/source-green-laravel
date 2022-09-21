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

const mapStateToProps = ({ classes, loading, user }) => ({
  data: classes.data,
  error: classes.error,
  pagination: classes.pagination,
  branches: classes.branches,
  defaultBranch: user.defaultBranch,
  user: user.user,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
      defaultBranch,
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        KeyWord: query?.KeyWord,
        page: query?.page || variables.PAGINATION.PAGE,
        Branch: query?.Branch || defaultBranch?.id,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
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

  loadCategories = () => {
    this.props.dispatch({
      type: 'classes/GET_BRANCHES',
      payload: {},
    });
  };

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
      type: 'classes/GET_DATA',
      payload: {
        ...search,
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

  onChangeStatus = (e, type) => {
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

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'classes/REMOVE',
          payload: {
            id,
            pagination: {
              limit: search.limit,
              page: search.page,
            },
          },
          callback: (response) => {
            if (response) {
              self.onLoad();
            }
          },
        });
      },
    });
  };

  onFormBtn = (record) => {
    const {
      location: { pathname },
      user,
    } = this.props;
    if (user?.roleCode === variables.LIST_ROLE_CODE.PRINCIPAL || user?.roleCode === variables.LIST_ROLE_CODE.ADMIN) {
      return (
        <div className={styles['list-buttons']}>
          <Button
            className={styles.item}
            color="primary"
            icon="list"
            onClick={() => history.push(`${pathname}/${record.id}/danh-sach`)}
          />
          <Button
            className={styles.item}
            color="primary"
            icon="edit"
            onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
          />
          <Button
            className={styles.item}
            color="danger"
            icon="remove"
            onClick={() => this.onRemove(record.id)}
          />
        </div>);
    };
    return "";
  };

  /**
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'index',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'MÃ',
        key: 'code',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.code}</Text>,
      },
      {
        title: 'TÊN',
        key: 'name',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.name}</Text>,
      },
      {
        title: 'CƠ SỞ',
        key: 'branch',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.branch?.name}</Text>,
      },
      {
        key: 'actions',
        className: 'min-width-200',
        width: 200,
        render: (record) => (
          <>
            {this?.onFormBtn(record)}
          </>
        ),
      },
    ];
    return columns;
  };

  onFormAdd = () => {
    const {
      location: { pathname },
      user,
    } = this.props;
    if (user?.roleCode === variables.LIST_ROLE_CODE.PRINCIPAL || user?.roleCode === variables.LIST_ROLE_CODE.ADMIN) {
      return (
        <Button
          color="success"
          icon="plus"
          onClick={() => history.push(`${pathname}/tao-moi`)}
        >
          Thêm mới
        </Button>
      );
    };
    return "";
  };

  render() {
    const {
      error,
      data,
      match: { params },
      pagination,
      loading: { effects },
      defaultBranch,
      branches
    } = this.props;
    const { search, defaultBranchs } = this.state;

    const loading = effects['classes/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách lớp" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">DANH SÁCH LỚP</Text>
            {this?.onFormAdd()}
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
                    name="KeyWord"
                    onChange={(event) => this.onChange(event, 'KeyWord')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                {!defaultBranch?.id && (
                  <div className="col-lg-4">
                    <FormItem
                      data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                      name="Branch"
                      onChange={(event) => this.onChangeStatus(event, 'Branch')}
                      type={variables.SELECT}
                      placeholder="Chọn cơ sở"
                      allowClear={false}
                    />
                  </div>
                )}
                {defaultBranch?.id && (
                  <div className="col-lg-4">
                    <FormItem
                      data={defaultBranchs}
                      name="Branch"
                      onChange={(event) => this.onChangeStatus(event, 'Branch')}
                      type={variables.SELECT}
                      placeholder="Chọn cơ sở"
                      allowClear={false}
                    />
                  </div>
                )}
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              error={error}
              isError={error.isError}
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
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  error: {},
  defaultBranch: {},
  branches: [],
  user: {},
};

export default Index;
