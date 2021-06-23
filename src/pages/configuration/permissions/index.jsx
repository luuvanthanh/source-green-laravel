import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Checkbox } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
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
const mapStateToProps = ({ configurationPermissions, loading }) => ({
  data: configurationPermissions.data,
  permissions: configurationPermissions.permissions,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
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
    this.props.dispatch({
      type: 'configurationPermissions/GET_DATA',
      payload: {
        ...search,
      },
      callback: (response) => {
        if (response) {
          this.setStateData({
            dataSource: response,
          });
        }
      },
    });
    this.props.dispatch({
      type: 'configurationPermissions/GET_PERMISSION_BY_ROLE',
      payload: {
        ...search,
      },
    });
  };

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearch = debounce((value) => {
    const { data } = this.props;
    this.setStateData({
      dataSource: value
        ? data.filter(
            (item) => Helper.slugify(item.description)?.indexOf(Helper.slugify(value)) >= 0,
          )
        : data,
    });
  }, 100);

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

  onChangePermission = (e, record, role) => {
    this.props.dispatch({
      type: 'configurationPermissions/UPDATE',
      payload: {
        providerName: 'R',
        providerKey: role.name,
        permissions: [
          {
            name: record.permissionKey,
            isGranted: e.target.checked,
          },
        ],
      },
      callback: () => {},
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const { permissions } = this.props;
    const columns = [
      {
        title: 'MÃ QUYỀN',
        key: 'description',
        className: 'min-width-150',
        width: 150,
        fixed: 'left',
        render: (record) => <Text size="normal">{record.description}</Text>,
      },
    ];
    const permissionColums = permissions.map((item) => ({
      title: item.name,
      key: item.normalizedName,
      className: 'min-width-100',
      width: 100,
      align: 'center',
      render: (record) => (
        <Checkbox
          defaultChecked={!!item?.permissionGrants?.includes(record.permissionKey)}
          onChange={(event) => this.onChangePermission(event, record, item)}
        />
      ),
    }));
    return columns.concat(permissionColums);
  };

  render() {
    const {
      match: { params },
      loading: { effects },
    } = this.props;
    const { dataSource } = this.state;
    const loading =
      effects['configurationPermissions/GET_DATA'] ||
      effects['configurationPermissions/GET_PERMISSION_BY_ROLE'];
    return (
      <>
        <Helmet title="Phân quyền" />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-configurationPermissions'],
          )}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Phân quyền</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form layout="vertical" ref={this.formRef}>
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    name="name"
                    onChange={(event) => this.onChange(event, 'name')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={dataSource}
              loading={loading}
              pagination={false}
              params={{
                header: this.header(),
                type: 'table',
              }}
              bordered
              rowKey={(record) => record.permissionKey}
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
  data: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  permissions: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  loading: {},
  dispatch: {},
  permissions: [],
};

export default Index;
