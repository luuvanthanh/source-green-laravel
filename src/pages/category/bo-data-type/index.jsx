import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form, Tag } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, difference } from 'lodash';
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
const mapStateToProps = ({ boDataType, loading }) => ({
  data: boDataType.data,
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
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      objects: {},
      isValidate: false,
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
      type: 'boDataType/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  /**
   * Function reset form
   */
  onResetForm = () => {
    if (this.formRef) {
      this.formRef.current.resetFields();
      this.setStateData({
        objects: {},
      });
    }
  };

  /**
   * Function close modal
   */
  handleCancel = () => {
    this.setStateData({ visible: false });
    this.onResetForm();
  };

  /**
   * Function onchange select
   * @param {string} e values of select
   */
  onChange = (e) => {
    const { objects } = this.state;
    const values = JSON.parse(objects.values);
    if (e.length < values.length) {
      const differenceItems = difference(values, e);
      this.props.dispatch({
        type: 'boDataType/VALIDATE_DELETE',
        payload: {
          id: objects.id,
          value: head(differenceItems),
        },
        callback: (response) => {
          if (response === false) {
            this.setState({
              isValidate: true,
            });
            this.formRef.current.setFields([
              {
                name: objects.key,
                errors: ['Dữ liệu này đã được sử dụng vui lòng kiểm tra lại'],
              },
            ]);
          }
        },
      });
    } else {
      this.setState({
        isValidate: false,
      });
    }
  };

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  onFinish = () => {
    const { objects } = this.state;
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: 'boDataType/UPDATE',
        payload: {
          ...objects,
          name: values.name,
          values: JSON.stringify(values[`${objects.key}`]),
        },
        callback: (response, error) => {
          if (response) {
            this.handleCancel();
            this.onLoad();
          }
          if (error) {
            if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
              error?.validationErrors.forEach((item) => {
                this.formRef.current.setFields([
                  {
                    name: head(item.members),
                    errors: [item.message],
                  },
                ]);
              });
            }
          }
        },
      });
    });
  };

  /**
   * Function remove items
   * @param {objects} record value of items
   */
  onEdit = (objects) => {
    this.setStateData(
      {
        objects,
        visible: true,
      },
      () => {
        this.formRef.current.setFieldsValue({
          ...objects,
          [`${objects.key}`]: JSON.parse(objects.values),
        });
      },
    );
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
        render: (text, record, index) => index + 1,
      },
      {
        title: 'TÊN DANH MỤC',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record.name}</Text>,
      },
      {
        title: 'DỮ LIỆU DANH MỤC',
        key: 'values',
        className: 'min-width-150',
        render: (record) => {
          const values = JSON.parse(record.values);
          if (!isEmpty(values)) {
            return (
              <div>
                {values.map((item, index) => (
                  <Tag className="mt-2" color="blue" key={index}>
                    {item}
                  </Tag>
                ))}
              </div>
            );
          }
          return null;
        },
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="primary" icon="edit" onClick={() => this.onEdit(record)} />
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      data,
      match: { params },
      loading: { effects },
    } = this.props;
    const { visible, objects, isValidate } = this.state;
    const loading = effects['boDataType/GET_DATA'];
    const loadingSubmit = effects['boDataType/ADD'] || effects['boDataType/UPDATE'];
    return (
      <div className={styles['layout-form']}>
        <Helmet title="Danh mục chung" />
        <Modal
          centered
          footer={[
            <div className={classnames('d-flex', 'justify-content-end')} key="action">
              <Button
                color="white"
                disabled={isValidate}
                icon="cross"
                loading={loadingSubmit}
                onClick={this.handleCancel}
                size="medium"
              >
                HỦY
              </Button>
              <Button
                color="green"
                disabled={isValidate}
                icon="save"
                loading={loadingSubmit}
                onClick={this.onFinish}
                size="medium"
              >
                LƯU
              </Button>
            </div>,
          ]}
          onCancel={this.handleCancel}
          title={!isEmpty(objects) ? 'CHỈNH SỬA DANH MỤC CHUNG' : 'THÊM MỚI DANH MỤC CHUNG'}
          visible={visible}
        >
          <Form layout="vertical" ref={this.formRef}>
            <div className="row">
              <div className="col-lg-12">
                <FormItem
                  data={
                    objects.values ? Helper.convertSelectSingle(JSON.parse(objects.values)) : []
                  }
                  label={'DỮ LIỆU DANH MỤC'}
                  name={objects.key}
                  onChange={this.onChange}
                  rules={[variables.RULES.EMPTY]}
                  type={variables.SELECT_TAGS}
                />
              </div>
            </div>
          </Form>
        </Modal>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">DANH MỤC CHUNG</Text>
          </div>
          <div className={styles['block-table']}>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data}
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
      </div>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
