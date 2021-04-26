import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
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
const { confirm } = Modal;
const mapStateToProps = ({ criteriaLearn, loading }) => ({
  data: criteriaLearn.data,
  pagination: criteriaLearn.pagination,
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
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
    };
    setIsMounted(true);
  }

  // componentDidMount() {
  //   this.onLoad();
  // }

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
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'Thời gian',
        key: 'thoiGian',
        width: 60,
        align: 'center',
        render: (text, record, index) => <Text size="normal">15:31, 10/1/2021</Text>,
      },
      {
        title: 'Tên tài khoản',
        key: 'tenTaiKhoan',
        className: 'min-width-150',
        width: 250,
        render: (record) => <Text size="normal">Nguyễn Vân</Text>,
      },
      {
        title: 'Hành động',
        key: 'hanhDong',
        className: 'min-width-150',
        width: 250,
        render: (record) => <Text size="normal">Nhập thông tin</Text>,
      },
      {
        title: 'Chương trình học',
        key: 'chuongTrinhHoc',
        className: 'min-width-150',
        render: (record) => <Text size="normal">Chương trình phát triển suy luận cho trẻ</Text>,
      },
      {
        title: 'Trẻ',
        key: 'tre',
        className: 'min-width-150',
        width: 250,
        render: (record) => <Text size="normal">Su Beo</Text>,
      },
    ];
    return columns;
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

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  pagination = (pagination) => ({
    size: 'default',
    total: pagination.total,
    pageSize: variables.PAGINATION.PAGE_SIZE,
    defaultCurrent: Number(this.state.search.page),
    current: Number(this.state.search.page),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: false,
    pageSizeOptions: false,
    onChange: (page, size) => {
      this.changePagination(page, size);
    },
  });

  render() {
    const {
      match: { params },
      data,
      pagination,
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { visible, objects, search } = this.state;
    const loading = effects['criteriaLearn/GET_DATA'];
    const loadingSubmit = effects['criteriaLearn/ADD'] || effects['criteriaLearn/UPDATE'];
    return (
      <>
        <Helmet title="Lịch sử" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Lịch sử</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
                productType: search.productType || null,
                startDate: search.startDate && moment(search.startDate),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-2 col-md-4">
                  <FormItem
                    name="nhanVien"
                    type={variables.SELECT}
                    data={[]}
                    onChange={this.selectProgram}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-2 col-md-4">
                  <FormItem
                    name="hanhDong"
                    type={variables.SELECT}
                    data={[]}
                    onChange={this.selectProgram}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-2 col-md-4">
                  <FormItem
                    name="time"
                    type={variables.RANGE_PICKER}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={[{ id: 1 }]}
              loading={loading}
              params={{
                header: this.header(),
                type: 'table',
              }}
              pagination={this.pagination(pagination)}
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
