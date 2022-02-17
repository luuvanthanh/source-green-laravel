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
import moment from 'moment';
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
const mapStateToProps = ({ currencyPaymentPlan, loading }) => ({
  data: currencyPaymentPlan.data,
  error: currencyPaymentPlan.error,
  year: currencyPaymentPlan.year,
  dataClass: currencyPaymentPlan.dataClass,
  pagination: currencyPaymentPlan.pagination,
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
      categories: {
        yearsConvert: [],
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
 * Function load branches
 */
   loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'currencyPaymentPlan/GET_YEAR',
      payload: {},
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              yearsConvert:
                res?.parsePayload?.map((item) => ({
                  id: item.id,
                  name: `Năm học  ${item.yearFrom} - ${item.yearTo}`,
                })) || [],
            },
          }));
        }
      },
    });
    dispatch({
      type: 'currencyPaymentPlan/GET_CLASS',
      payload: {},
    });
  };


  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
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
      type: 'currencyPaymentPlan/GET_DATA',
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
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'currencyPaymentPlan/REMOVE',
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
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'Ngày tạo',
        key: 'code',
        className: 'min-width-200',
        render: (record) => <Text size="normal">{Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE)} </Text>
      },
      {
        title: 'Năm học',
        key: 'name',
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.schoolYear?.yearFrom} - {record?.schoolYear?.yearTo}</ Text>,
      },
      {
        title: 'Tháng',
        key: 'basic',
        className: 'min-width-200',
        render: (record) => <Text size="normal">{Helper.getDate(record.chargeMonth, variables.DATE_FORMAT.DATE_MONTH)} </Text>
      },
      {
        title: 'Cơ sở',
        key: 'Grade',
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.branch?.name}</ Text>,
      },
      {
        title: 'Lớp học',
        key: 'class',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.classes?.name}</ Text>,
      },
      {
        title: 'Trạng thái',
        key: 'year',
        className: 'min-width-200',
        render: (record) => record?.status || '',
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={stylesModule['list-button']} >
            <Button icon="plan" className={stylesModule.plan} />
            <Button icon="remove" className={stylesModule.remove} onClick={() => this.onRemove(record.id)} />
            <Button
              icon="edit"
              className={stylesModule.edit}
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
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
      location: { pathname },
      dataClass,
    } = this.props;
    const { search , categories: { yearsConvert } } = this.state;
    const loading = effects['currencyPaymentPlan/GET_DATA'];
    return (
      <>
        <Helmet title="Kế hoạch đóng phí" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Kế hoạch đóng phí</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm mới
            </Button>
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
                    data={[{ name: 'Tất cả năm học' }, ...yearsConvert]}
                    name="schoolYearId"
                    type={variables.SELECT}
                    onChange={(event) => this.onChangeSelect(event, 'schoolYearId')}
                    allowClear={false}
                    placeholder="Chọn năm học"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ name: 'Tất cả lớp học' }, ...dataClass]}
                    name="classId"
                    type={variables.SELECT}
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    allowClear={false}
                    placeholder="Chọn lớp học"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="chargeMonth"
                    type={variables.MONTH_PICKER}
                    onChange={(event) => this.onChangeSelect(event, 'chargeMonth')}
                    allowClear={false}
                    placeholder="Chọn tháng"
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
  dataClass: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  data: [],
  dataClass: [],
};

export default Index;
