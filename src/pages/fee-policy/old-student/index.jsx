import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, map } from 'lodash';
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
const mapStateToProps = ({ oldStudent, loading }) => ({
  data: oldStudent.data,
  error: oldStudent.error,
  pagination: oldStudent.pagination,
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
        nameStudent: query?.nameStudent,
        from: query?.from || null,
        to: query?.to || null,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'schoolYear/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    this.getStudents();
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
  getStudents = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'oldStudent/GET_DATA',
      payload: {
        ...search,
        orderBy: 'CreationTime',
        sortedBy: 'desc',
        include: Helper.convertIncludes(['student.classStudent.class']),
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChange = debounce((value, type) => {
    let { search: { from, to } } = this.state;
    if (type === 'years') {
      if (!isEmpty(value)) {
        from = moment(value[0]).format('YYYY');
        to = moment(value[1]).format('YYYY');
      } else {
        from = null;
        to = null;
      }
    }
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          nameStudent: type === 'nameStudent' ? value : prevState.search.nameStudent,
          from,
          to,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => this.getStudents(),
    );
  }, 300);

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
        this.getStudents();
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
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'oldStudent/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              self.getStudents();
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
        title: 'Mã học sinh',
        key: 'code',
        className: 'min-width-150',
        render: (record) => record?.student?.code || '',
      },
      {
        title: 'Tên học sinh',
        key: 'fullName',
        className: 'min-width-200',
        render: (record) => record?.student?.fullName || '',
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        className: 'min-width-200',
        render: (record) => record?.student?.classStudent?.class?.branch?.name || '',
      },
      {
        title: 'Khối lớp',
        key: 'grade',
        className: 'min-width-150',
        render: (record) => record?.student?.classStudent?.class?.classType?.name || '',
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        render: (record) => record?.student?.classStudent?.class?.name || '',
      },
      {
        title: 'Năm học',
        key: 'schoolYear',
        className: 'min-width-150',
        render: (record) => `${record?.schoolYear?.yearFrom || ''} - ${record?.schoolYear?.yearTo || ''}`
      },
      {
        title: 'Chi tiết các loại phí',
        key: 'tuition',
        className: 'min-width-150',
        render: (record) => !isEmpty(record?.tuition) ? map(record?.tuition, 'fee.name').join(', ') : '',
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="success" icon="copy" onClick={() => history.push(`/chinh-sach-phi/tinh-phi-hoc-sinh-cu/${record?.id}/chi-tiet?type=ban-sao`)} />
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`/chinh-sach-phi/tinh-phi-hoc-sinh-cu/${record?.id}/chi-tiet`)}
            />
            <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
      data,
    } = this.props;
    const { search } = this.state;
    const loading = effects['oldStudent/GET_DATA'];

    return (
      <>
        <Helmet title="Tính phí học sinh cũ" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Tính phí học sinh cũ</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
                years: (search?.from && search?.to) ? [moment(search?.from), moment(search?.to)] : null
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="nameStudent"
                    onChange={(event) => this.onChange(event?.target?.value, 'nameStudent')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="years"
                    onChange={(event) => this.onChange(event, 'years')}
                    picker="year"
                    type={variables.RANGE_PICKER}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
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
  match: PropTypes.objectOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  data: [],
};

export default Index;
