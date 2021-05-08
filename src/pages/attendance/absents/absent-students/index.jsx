import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form, Avatar, Typography } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, get } from 'lodash';
import { UserOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import HelperModules from '../../utils/Helper';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

const { Paragraph } = Typography;
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
const { confirm } = Modal;
const mapStateToProps = ({ absentStudents, loading }) => ({
  data: absentStudents.data,
  pagination: absentStudents.pagination,
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
      visible: false,
      search: {
        fullName: query?.fullName,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        endDate: HelperModules.getEndDate(query?.endDate, query?.choose),
        startDate: HelperModules.getStartDate(query?.startDate, query?.choose),
      },
      objects: {},
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
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'absentStudents/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
          startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
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
  changePagination = (page, limit) => {
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

  changePagination

  renderDescription = (record) => {
    if (!isEmpty(record)) {
      const absentStudents = record.map((item) => {
        if (!isEmpty(get(item, 'fingerprintTimekeeper'))) {
          return `${get(item, 'fingerprintTimekeeper.name')} - ${Helper.getDate(
            item.attended_at,
            variables.DATE_FORMAT.DATE_TIME,
          )}`;
        }
        return '';
      });
      return (
        <Paragraph ellipsis={{ rows: 6, expandable: true, symbol: 'Xem thêm' }}>
          {absentStudents.map((item, index) => (
            <div key={index}>
              {item}
              <br />
            </div>
          ))}
        </Paragraph>
      );
    }
    return null;
  };

  /**
   * Function header table
   */
  header = () => {
    return [
      {
        title: 'STT',
        key: 'text',
        width: 50,
        align: 'center',
        render: (text, record, index) =>
          Helper.sttList(
            this.props.pagination?.current_page,
            index,
            this.props.pagination?.per_page,
          ),
      },
      {
        title: 'Bé',
        key: 'name',
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'student.fileImage'))}
            fullName={get(record, 'student.fullName')}
          />
        ),
      },
      {
        title: 'Phụ huynh',
        key: 'parent',
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'parent.fileImage'))}
            fullName={get(record, 'parent.fullName')}
          />
        ),
      },
      {
        title: 'Ngày',
        key: 'count',
        className: 'min-width-200',
        width: 200,
        render: (record) =>
          `${Helper.getDate(record.startDate)} / ${Helper.getDate(record.endDate)}`,
      },
      {
        title: 'Loại',
        key: 'absentType',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.absentType?.name,
      },
      {
        title: 'Lý do',
        key: 'absentReason',
        className: 'min-width-200',
        render: (record) => record?.absentReason?.name,
      },
    ];
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const loading = effects['absentStudents/GET_DATA'];
    return (
      <>
        <Helmet title="Đơn xin phép cho bé" />
        <div className={classnames(styles['content-form'], styles['content-form-absentStudents'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Đơn xin phép cho bé</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Tạo xin phép
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                startDate: search.startDate ? moment(search.startDate) : null,
                endDate: search.endDate ? moment(search.endDate) : null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="fullName"
                    onChange={(event) => this.onChange(event, 'fullName')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeDate(event, 'startDate')}
                    type={variables.DATE_PICKER}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="endDate"
                    onChange={(event) => this.onChangeDate(event, 'endDate')}
                    type={variables.DATE_PICKER}
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
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
