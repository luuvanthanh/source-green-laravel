import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import moment from 'moment';

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
const mapStateToProps = ({ currencyOldStudent, loading }) => ({
  data: currencyOldStudent.data,
  error: currencyOldStudent.error,
  pagination: currencyOldStudent.pagination,
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
        from: query?.from || null,
        to: query?.to || null,
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
      type: 'currencyOldStudent/GET_DATA',
      payload: {
        ...search,
        orderBy: 'CreationTime',
        sortedBy: 'desc',
        include: Helper.convertIncludes(['schoolYear']),
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
  debouncedSearch = debounce((value) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          from: !isEmpty(value) ? moment(value[0]).format('YYYY') : null,
          to: !isEmpty(value) ? moment(value[1]).format('YYYY') : null,
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
  onChange = (value, type) => {
    this.debouncedSearch(value, type);
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
   * Function header table
   */
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'Mã học sinh',
        key: 'code',
        className: 'min-width-200',
        render: (record) => record?.code || '',
      },
      {
        title: 'Tên học sinh',
        key: 'name',
        className: 'min-width-200',
        render: (record) => record?.name || '',
      },
      {
        title: 'Cơ sở',
        key: 'basic',
        className: 'min-width-200',
        render: (record) => record?.basic || '',
      },
      {
        title: 'Khối lớp',
        key: 'Grade',
        className: 'min-width-200',
        render: (record) => record?.Grade || '',
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        render: (record) => record?.class || '',
      },
      {
        title: 'Năm học',
        key: 'year',
        className: 'min-width-200',
        render: (record) => record?.year || '',
      },
      {
        title: 'Chi tiết các loại phí',
        key: 'detail',
        className: 'min-width-130',
        render: (record) => record?.detail || ''
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
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

  render() {
    const {
      pagination,
      loading: { effects },
      data,
    } = this.props;
    const { search } = this.state;
    const loading = effects['currencyOldStudent/GET_DATA'];
    return (
      <>
        <Helmet title="Tính phí học sinh cũ" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Tính phí học sinh cũ</Text>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
                years: (search?.from && search?.to) ? [moment(search.from), moment(search.to)] : null
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="key"
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ name: 'Tất cả năm học' },]}
                    name="district"
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn năm học"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ name: 'Tất cả lớp học' },]}
                    name="district"
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn lớp học"
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header()}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
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
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  data: [],
};

export default Index;
