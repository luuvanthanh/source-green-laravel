import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Form } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';

import styles from '../index.scss';
import variablesModules from '../variables';
import { variables } from '@/utils';

const { TabPane } = Tabs;
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

@connect(({ user, loading }) => ({ user, loading }))
class AttendanceComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { user } = props;
    this.state = {
      title: '',
      visible: false
    };
    setIsMounted(true);
  }

  componentDidMount() {
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

  cancelModal = () => {
    this.setStateData({ visible: false });
  }

  getDetails = (record) => {
    if (record?.id === variables.STATUS_ABSENT.ANNUAL_LEAVE || record?.id === variables.STATUS_ABSENT.UNPAID_LEAVE) {
      this.setStateData({
        visible: true,
        title: `Danh sách trẻ ${(record?.name).toLowerCase()}`
      });
    }
    return;
  }

  /**
   * Function header table
   */
   header = () => {
    return [
      {
        title: 'Trẻ',
        key: 'children',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <AvatarTable
            // fileImage={Helper.getPathAvatarJson(fileImage)}
            fullName={'Vân Khánh'}
            size={40}
          />
        )
      },
      {
        title: 'Tuổi (tháng)',
        key: 'age',
        className: 'min-width-150',
        width: 150,
        render: (record) => '32 tháng'
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        width: 150,
        render: (record) => 'Preschool 1'
      },
      {
        title: 'Phụ huynh',
        key: 'parents',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <AvatarTable
            // fileImage={Helper.getPathAvatarJson(fileImage)}
            fullName={'Lê Tường Vy'}
            size={40}
          />
        )
      },
      {
        title: 'Giáo viên',
        key: 'teacher',
        className: 'min-width-300',
        width: 300,
        render: (record) => 'Nguyễn Văn Tuyết, Lê Xuân Thanh, Lê Tiểu Linh'
      },
    ];
  };

  selectBranch = () => {

  }

  render() {
    const { visible, title } = this.state;
    return (
      <>
        <Modal
          className={styles['modal-student-detail']}
          visible={visible}
          title={title}
          width={"90%"}
          onCancel={this.cancelModal}
          footer={null}
        >
          <div className="p20">
            <Form>
              <div className="row">
                <div className="col-md-4 col-xl-3">
                  <FormItem
                    className="mb-10"
                    name="name"
                    onChange={(event) => this.onChange(event, 'name')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-md-4 col-xl-2">
                  <FormItem
                    className="mb-10"
                    name="class"
                    type={variables.SELECT}
                    data={[]}
                    onChange={this.selectBranch}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header()}
              dataSource={[{id: 1}, {id: 2}]}
              // loading={loading}
              pagination={false}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </div>
        </Modal>
        <div className={classnames(styles['block-category'])}>
          <div className={styles['body-tab']}>
            <div className={styles['header-tab']}>
              <div>
                <img src={'/images/home/note.svg'} alt="notification" className={styles['icon']} />
                <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Điểm danh vào lớp</span>
              </div>
            </div>
            <div className="mt50">
              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 335}>
                <div className={classnames(styles['content-bus'])}>
                  {variablesModules.ATTENDANCE.map((item, index) =>
                    <div
                      key={index}
                      className={
                        classnames(
                          `${(item?.id === variables.STATUS_ABSENT.ANNUAL_LEAVE || item?.id === variables.STATUS_ABSENT.UNPAID_LEAVE) ? 'pointer' : ''}`,
                          styles['half-width']
                        )
                      }
                      onClick={() => this.getDetails(item)}
                    >
                      <AvatarTable
                        // fileImage={Helper.getPathAvatarJson(fileImage)}
                        size={30}
                      />
                      <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>{item.name}</p>
                      <p className={classnames('mb0', 'font-size-30', 'font-weight-bold', 'text-black', 'mt-auto', styles['number'])}>{item.number}</p>
                    </div>
                  )}
                </div>
              </Scrollbars>
            </div>
          </div>
        </div>
      </>
    );
  }
}

AttendanceComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

AttendanceComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default AttendanceComponent;
