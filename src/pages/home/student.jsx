import React, { PureComponent } from 'react';
import { connect } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Form, Modal, Avatar } from 'antd';

import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from './index.scss';
import variablesModules from './variables';
import BusComponent from './busComponent';
import ChildrenComponent from './childrenComponent';
import HealthComponent from './health';
import NoteComponent from './note'
import MedicalComponent from './medical';

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
class Student extends PureComponent {
  formRef = React.createRef();
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      tab: 'bus'
    }
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

  onChange = (e, name) => {

  }

  cancelModal = () => {
    this.setStateData({ visible: false });
  }

  changeTab = (tab) => {
    this.setStateData({ tab });
  }

  getDetails = () => {
    this.setStateData({ visible: true });
  }

  tables = (tab) => {
    switch (tab) {
      case 'bus':
        return <BusComponent />

      case 'childrenInClass':
        return <ChildrenComponent />

      case 'health':
        return <HealthComponent />

      case 'note':
        return <NoteComponent />

      case 'medical':
        return <MedicalComponent />

      default:
        return null
    }
  };

  render() {
    const {
      loading: { effects },
      user: { user }
    } = this.props;

    const { visible, tab } = this.state;

    return (
      <div className={classnames(styles['items-container'])}>
        <Form>
          <FormItem
            className={classnames('mt20', 'mb5', styles['input-search'])}
            name="fullName"
            onChange={(event) => this.onChange(event, 'fullName')}
            placeholder="Nhập từ khóa tìm kiếm"
            type={variables.INPUT_SEARCH}
          />
        </Form>
        <div className="row">
          {
            variablesModules.STUDENTS.map((item, index) => (
              <div className={styles['block-student']} key={index}>
                <div onClick={this.getDetails} className={styles['content-student']}>
                  <AvatarTable
                    // fileImage={Helper.getPathAvatarJson(fileImage)}
                    // fullName={item?.name}
                    size={90}
                  />
                  <p className="font-size-14 mb0 mt5">{item?.name}</p>
                </div>
              </div>
            ))
          }
        </div>
        <Modal
          className={styles['modal-student-detail']}
          visible={visible}
          width={"90%"}
          onCancel={this.cancelModal}
          footer={null}
        >
          <div className={classnames('p20', 'border-bottom', styles['header-modal'])}>
            <div className="row">
              <div className="col-lg-3 mt10">
                <AvatarTable
                  // fileImage={Helper.getPathAvatarJson(fileImage)}
                  fullName={'Bùi Ngọc Thy Nhân'}
                  description={'32 tháng tuổi'}
                  size={50}
                />
              </div>
              <div className="col-lg-3 mt10">
                <AvatarTable
                  // fileImage={Helper.getPathAvatarJson(fileImage)}
                  fullName={'Nguyễn Anh'}
                  description={'Phụ huynh'}
                  size={50}
                />
              </div>
              <div className="col-lg-2 mt10">
                <div className="d-flex">
                  <Avatar
                    src=""
                    size={50}
                  />
                  <div className="ml10">
                    <p className={classnames('mb0', styles['class'])}>Lớp</p>
                    <p className="font-weight-bold font-size-14 mb0">Preschool 2</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mt10">
                <div className="d-flex">
                  <Avatar
                    src=""
                    size={50}
                  />
                  <div className="ml10">
                    <p className={classnames('mb0', styles['class'])}>Giáo viên</p>
                    <p className="font-weight-bold font-size-14 mb0">Nguyễn Văn Tuyết, Lê Xuân Thanh, Lê Tiểu Linh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['body-modal']}>
            <div className={styles['menu-modal']}>
              {variablesModules.MENU.map((item, index) => (
                <div onClick={() => this.changeTab(item.id)} className={classnames(styles['item-menu'], styles[item.id === tab? 'actived' : ''])} key={index}>
                  <img src={item.image} className={styles['image-menu']} />
                  <p className={classnames('mt10', 'mb0', 'font-size-12', styles['title-menu'])}>{item?.name}</p>
                </div>
              ))}
            </div>
            {this.tables(tab)}
          </div>
        </Modal>
      </div>
    );
  }
}

Student.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Student.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default Student;
