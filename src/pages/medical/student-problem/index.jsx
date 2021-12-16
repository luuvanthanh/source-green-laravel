import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import FormItem from '@/components/CommonComponent/FormItem';
import PropTypes from 'prop-types';
import { variables, Helper } from '@/utils';
import HelperModules from './utils/Helper';

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
const mapStateToProps = ({ medicalStudentProblem, loading }) => ({
  data: medicalStudentProblem.data,
  error: medicalStudentProblem.error,
  pagination: medicalStudentProblem.pagination,
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
      type: 'medicalStudentProblem/GET_DATA',
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
          type: 'medicalStudentProblem/REMOVE',
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
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'Thời gian',
        key: 'time',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE_TIME)}
          </Text>
        ),
      },
      {
        title: 'Học sinh',
        key: 'name',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.file_image)}
            fullName={record?.medicalProblem?.name}
          />
        ),
      },
      {
        title: 'Cơ sở',
        key: 'basis',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.basis}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.class}</Text>,
      },
      {
        title: 'Sự cố',
        key: 'Trouble',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.Trouble}</Text>,
      },
      {
        title: 'Vị trí vết thương',
        key: 'Wound_location',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.Wound_location}</Text>,
      },
      {
        title: 'Triệu chứng',
        key: 'Trouble',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.Trouble}</Text>,
      },
      {
        title: 'Hình ảnh',
        key: 'name',
        width: 100,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.file_image)}
          />
        ),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        className: 'min-width-150',
        width: 150,
        render: (record) => HelperModules.tagStatus(record.status),
      },
      {
        title: 'Cách xử lý',
        key: 'Trouble',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.Trouble}</Text>,
      },
      {
        title: 'Người xử lý',
        key: 'Trouble',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.Trouble}</Text>,
      },
    ];
    return columns;
  };

  render() {
    const {
      error,
      data,
      match: { params },
      pagination,
      loading: { effects },
    } = this.props;
    console.log(data)
    const { search } = this.state;
    const loading = effects['medicalStudentProblem/GET_DATA'];
    return (
      <>
        <Helmet title="Danh mục học sinh bị sự cố" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Danh mục học sinh bị sự cố</Text>
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
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    // data={[{  name: 'Tất cả cơ sở' }]}
                    name="district"
                    type={variables.SELECT}
                    onChange={(event) => this.onChange(event, 'key')}
                    allowClear={false}
                    placeholder="Chọn cơ sở"
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    // data={[{ name: 'Tất cả lớp học' }]}
                    name="district"
                    onChange={(event) => this.onChange(event, 'key')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn lớp học"
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
              error={error}
              isError={error.isError}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
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
  error: {},
};

export default Index;
