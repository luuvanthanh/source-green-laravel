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
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import { EditableCell, EditableRow } from '@/components/CommonComponent/Table/EditableCell';

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
const mapStateToProps = ({ holidays, loading }) => ({
  data: holidays.data,
  pagination: holidays.pagination,
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
        fullName: query?.fullName,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        date: query?.date
          ? Helper.getDate(query.date, variables.DATE_FORMAT.DATE_AFTER)
          : Helper.getDate(moment(), variables.DATE_FORMAT.DATE_AFTER),
      },
      dataSource: [],
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
      type: 'holidays/GET_DATA',
      payload: {
        ...search,
      },
      callback: (response) => {
        this.setStateData({
          dataSource: response.map((item) => ({
            ...item,
            startDate: moment(item.startDate),
            endDate: moment(item.endDate),
          })),
        });
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          date: Helper.getDate(search.date, variables.DATE_FORMAT.DATE_AFTER),
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
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
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
    const { search } = this.state;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'holidays/REMOVE',
          payload: {
            name: moment(search.date).format(variables.DATE_FORMAT.YEAR),
            deleteIds: [id],
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

  handleSave = (record) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    const payload = {
      name: Helper.getDate(search.date, variables.DATE_FORMAT.YEAR),
      updateRows: [
        {
          ...record,
          startDate: Helper.getDate(record.startDate, variables.DATE_FORMAT.DATE_AFTER),
          endDate: Helper.getDate(record.endDate, variables.DATE_FORMAT.DATE_AFTER),
        },
      ],
    };
    this.setStateData((prevState) => ({
      dataSource: prevState.dataSource.map((item) => (item.id === record.id ? record : item)),
    }));
    dispatch({
      type: 'holidays/ADD',
      payload,
      callback: () => {},
    });
  };

  /**
   * Function header table
   */
  header = () => [
    {
      title: 'Tên ngày lễ',
      key: 'name',
      dataIndex: 'name',
      editable: true,
      className: classnames('min-width-150', 'max-width-150'),
      type: variables.TEXTAREA,
    },
    {
      title: 'Từ ngày',
      key: 'startDate',
      className: classnames('min-width-150', 'max-width-150'),
      width: 150,
      dataIndex: 'startDate',
      editable: true,
      type: variables.DATE_PICKER,
      render: (values, record) => Helper.getDate(record.startDate),
    },
    {
      title: 'Đến ngày',
      key: 'endDate',
      className: classnames('min-width-150', 'max-width-150'),
      width: 150,
      dataIndex: 'endDate',
      editable: true,
      type: variables.DATE_PICKER,
      render: (values, record) => Helper.getDate(record.endDate),
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 80,
      render: (record) => {
        if (!record.holidayDetails) {
          return (
            <div className={styles['list-button']}>
              <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
            </div>
          );
        }
        return null;
      },
    },
  ];

  render() {
    const {
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search, dataSource } = this.state;
    const loading = effects['holidays/GET_DATA'];

    const mergedColumns = this.header().map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          type: col.type,
          prefix: col.prefix,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <>
        <Helmet title="Danh sách ngày nghỉ lễ" />
        <div className={classnames(styles['content-form'], styles['content-form-holidays'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách ngày nghỉ lễ</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Tạo mới
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.date ? moment(search.date) : null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDate(event, 'date')}
                    type={variables.YEAR_PICKER}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={mergedColumns}
              components={{
                body: {
                  row: EditableRow,
                  cell: EditableCell,
                },
              }}
              dataSource={dataSource}
              className="table-edit"
              loading={loading}
              pagination={false}
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
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
