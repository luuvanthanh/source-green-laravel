import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
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
const mapStateToProps = ({ englishSettingSubject, loading, user }) => ({
  data: englishSettingSubject.data,
  error: englishSettingSubject.error,
  pagination: englishSettingSubject.pagination,
  skill: englishSettingSubject.skill,
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
    } = props;
    this.state = {
      search: {
        key: query?.key,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        categorySkillId: query?.categorySkillId,
        age: query?.age,
        aplly: query?.aplly,

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
      type: 'englishSettingSubject/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
        },
        variables.QUERY_STRING,
      )}`,
    );
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
  pagination = (pagination) =>
    Helper.paginationEnglish({
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
    const text = "Do you want to delete?";
    Helper.confirmDeleteEnglish({
      callback: () => {
        dispatch({
          type: 'englishSettingSubject/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              self.onLoad();
            }
          },
        });
      },
    }, text);
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
        title: 'ID',
        key: 'skill',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.code}</Text>,
      },
      {
        title: 'Subject name',
        key: 'name',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.name}</Text>,
      },
      {
        key: 'action',
        width: 100,
        className: 'max-width-100',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={(e) => { e.stopPropagation(); history.push(`${pathname}/${record.id}/edit`); }}
              permission="WEB_TIENGANH_QUANLYPHANMUC_EDIT"
            />
            <Button color="danger" icon="remove" onClick={(e) => { e.stopPropagation(); this.onRemove(record.id); }}
              permission="WEB_TIENGANH_QUANLYPHANMUC_DELETE"
            />
          </div>
        ),
      },
    ];
    return columns;
  };

  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
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
  }, 300);

  render() {
    const {
      error,
      data,
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
      user,
    } = this.props;
    const { search } = this.state;
    const loading = effects['englishSettingSubject/GET_DATA'];
    return (
      <>
        <Helmet title="Subject" />
        <div className='pl20 pr20 pb20'>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Subject</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/add`)}
              permission="WEB_TIENGANH_QUANLYPHANMUC_CREATE"
            >
              Create new
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
                <div className="col-lg-3">
                  <FormItem
                    name="key"
                    onChange={(event) => this.onChange(event, 'key')}
                    placeholder="Enter keyword"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              description="No data"
              pagination={this.pagination(pagination)}
              error={error}
              isError={error.isError}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              onRow={(record) => ({
                onClick: () => {
                  if (user?.permissions?.find(i => i === "WEB_TIENGANH_QUANLYPHANMUC_DETAIL")) {
                    history.push(`${pathname}/${record.id}/detail`);
                  }
                },
              })}
              scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
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
  user: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  user: {},
  error: {},
};

export default Index;
