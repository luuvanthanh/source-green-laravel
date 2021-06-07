import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Form, Avatar, Input } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, head } from 'lodash';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import classnames from 'classnames';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import Select from '@/components/CommonComponent/Select';
import styles from '@/assets/styles/Common/common.scss';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

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
const mapStateToProps = ({ tutorialAddV2, loading, menu }) => ({
  loading,
  error: tutorialAddV2.error,
  details: tutorialAddV2.details,
  busInformations: tutorialAddV2.busInformations,
  menuData: menu.menuLeftSchedules,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { details } = props;
    this.state = {
      busTransportations:
        details?.busTransportations?.map((item) => ({
          ...item,
          ...item.busInfor,
          id: uuidv4(),
        })) || [],
    };
    setIsMounted(true);
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

  componentDidMount() {
    this.loadCategories();
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tutorialAddV2/GET_BUS_INFORMATIONS',
      payload: {},
    });
  };

  /**
   * Function header table
   */
  header = () => {
    let columns = [];
    columns = [
      {
        title: 'STT',
        key: 'index',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (text, record, index) => <Text size="normal">{index + 1}</Text>,
      },
      {
        title: 'HỌC SINH',
        key: 'name',
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
            fullName={record.fullName}
          />
        ),
      },
      {
        title: 'ĐỊA CHỈ',
        key: 'address',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.address}</Text>,
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="danger"
              icon="remove"
              onClick={() => this.onRemoveChildren(record, object)}
            />
          </div>
        ),
      },
    ];

    return columns;
  };

  onFinish = () => {
    const {
      dispatch,
      match: { params },
      details,
    } = this.props;
    dispatch({
      type: 'tutorialAddV2/UPDATE',
      payload: {
        ...details,
        id: params?.id,
      },
      callback: (response, error) => {
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
  };

  render() {
    const {
      error,
      details,
      busInformations,
      loading: { effects },
    } = this.props;
    const { busTransportations } = this.state;
    const loading =
      effects['tutorialAddV2/GET_DETAILS'] || effects['tutorialAddV2/GET_BUS_INFORMATIONS'];
    const loadingSubmit = effects['tutorialAddV2/ADD'] || effects['tutorialAddV2/UPDATE'];
    return (
      <Form
        layout="vertical"
        ref={this.formRef}
        initialValues={{
          ...details,
          busId: details?.busTransportations?.find((item) => item.isMain)?.busId,
        }}
        onFinish={this.onFinish}
      >
        <div className="card">
          <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title">Danh sách điểm đón</Heading>
              <div className={classnames(styles['list-info'])}>
                <div className={classnames(styles.item)}>
                  <div
                    className={classnames(
                      styles.heading,
                      'd-flex',
                      'justify-content-between',
                      'align-items-center',
                    )}
                  >
                    <div className="d-flex align-items-center">
                      <h3 className={styles.title}>ĐIỂM ĐÓN SỐ</h3>
                      <Input
                        className="ml-3"
                        size="large"
                        style={{ width: '400px' }}
                        // onChange={(event) => this.onChangeAddress(event, item)}
                        suffix={
                          <span
                            className={classnames('icon-map', styles['icon-map'])}
                            role="presentation"
                            onClick={() => this.showMap()}
                          />
                        }
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className={styles['list-button']}>
                        <Button color="grey" icon="remove" />
                        <Button color="grey" icon="up" />
                      </div>
                    </div>
                  </div>
                  <div className={styles['content-block']}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Text color="dark" size="large-medium">
                        DS TRẺ TẠI ĐIỂM ĐÓN
                      </Text>
                      <Button color="success" icon="edit">
                        Cập nhật danh sách
                      </Button>
                    </div>
                    <Table
                      bordered
                      columns={this.header('CHILDREN')}
                      dataSource={[]}
                      className="table-edit"
                      pagination={false}
                      isEmpty
                      params={{
                        header: this.header('CHILDREN'),
                        type: 'table',
                      }}
                      rowKey={(record) => record.id || record.key}
                      scroll={{ x: '100%' }}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <p className={styles['button-plus']} role="presentation">
                <span className="icon-plus-circle" /> THÊM ĐIỂM ĐÓN
              </p>
            </div>

            <div className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                Lưu
              </Button>
            </div>
          </Loading>
        </div>
      </Form>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  busInformations: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  busInformations: [],
};

export default withRouter(Index);
