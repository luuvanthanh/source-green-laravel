import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Modal } from 'antd';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import TableTransfer from '@/components/CommonComponent/TableTransfer';
import Text from '@/components/CommonComponent/Text';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { Helper } from '@/utils';

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
const mapStateToProps = ({ loading }) => ({
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      listId: props.listId,
      targetKeys: props.studentBusPlaces || [],
      dataSource: props.students.map((item) => ({
        ...item,
        key: item.id,
      })),
      categories: {
        branches: [],
        classes: [],
      },
      form: {
        left: {
          branchId: '',
          classId: '',
          keyWord: ''
        },
        right: {
          branchId: '',
          classId: '',
          keyWord: ''
        }
      },
      students: props.students.map((item) => ({
        ...item,
        key: item.id,
      })),
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.fetchBranches();
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

  fetchBranches = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categories/GET_BRANCHES',
      callback: (res) => {
        if (res) {
          this.formRef?.current?.resetFields(['classId-left']);
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              branches: res?.parsePayload || [],
              classes: []
            },
          }));
        }
      },
    });
  };

  fetchClasses = (branchId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: branchId,
      },
      callback: (res) => {
        if (res) {
          this.setStateData(({ categories }) => ({
            categories: {
              ...categories,
              classes: res?.items || [],
            },
          }));
        }
      },
    });
  };

  handleCancel = () => {
    this.props.handleCancel();
  };

  onChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  onSubmit = () => {
    const { targetKeys, listId, dataSource } = this.state;
    const users = dataSource.filter((item) => targetKeys.includes(item.key));
    this.props.onSave(
      users.map((item) => ({ ...item })),
      listId,
    );
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
    ];
    return columns;
  };

  filterData = (data, keyWord, branchId, classId) => [...data].filter(item => {
    const checkKeyWord = keyWord ? item?.fullName?.toUpperCase()?.indexOf(keyWord.toUpperCase()) !== -1 : true;
    const checkBranchId = branchId ? item?.class?.branch?.id === branchId : true;
    const checkClassId = classId ? item?.class?.id === classId : true;
    return checkKeyWord && checkBranchId && checkClassId;
  })

  changeSearch = (e, name, direction) => {
    let value = e;
    if (name === 'keyWord') {
      value = e?.target?.value;
    }

    const { form, students, targetKeys } = this.state;
    let dataLeft = students.filter((item) => !targetKeys.includes(item.key));;
    let dataRight = students.filter((item) => targetKeys.includes(item.key));;

    let result = [];
    if (name === 'keyWord') {
      result = this.filterData(direction === 'left' ? dataLeft : dataRight, value, form[direction].branchId, form[direction].classId);
    }
    if (name === 'branchId') {
      result = this.filterData(direction === 'left' ? dataLeft : dataRight, form[direction].keyWord, value, '');
    }
    if (name === 'classId') {
      result = this.filterData(direction === 'left' ? dataLeft : dataRight, form[direction].keyWord, form[direction].branchId, value);
    }

    if (direction === 'left') {
      dataLeft = result;
    } else {
      dataRight = result;
    }

    if (name === 'branchId') {
      this.fetchClasses(e);
      return this.setStateData(({ form }) => ({
        dataSource: [...dataLeft, ...dataRight],
        form: {
          ...form,
          [direction]: {
            ...form[direction],
            [name]: value,
            classId: undefined,
          },
        },
      }));
    }
    return this.setStateData(({ form }) => ({
      dataSource: [...dataLeft, ...dataRight],
      form: {
        ...form,
        [direction]: {
          ...form[direction],
          [name]: value
        },
      },
    }));
  }

  render() {
    const {
      loading: { effects },
    } = this.props;
    const { targetKeys, dataSource, categories, form } = this.state;
    const loadingSubmit = effects['BOContract/ADD'] || effects['BOContract/UPDATE'];
    return (
      <Modal
        centered
        className={classnames(styles['modal-container'], styles['modal-container-children'])}
        footer={[
          <div className={classnames('d-flex', 'justify-content-end')} key="action">
            <Button
              color="white"
              icon="cross"
              loading={loadingSubmit}
              onClick={this.handleCancel}
              size="medium"
            >
              HỦY
            </Button>
            <Button
              color="green"
              icon="save"
              loading={loadingSubmit}
              onClick={this.onSubmit}
              size="medium"
            >
              LƯU
            </Button>
          </div>,
        ]}
        onCancel={this.handleCancel}
        title="CẬP NHẬT DANH SÁCH TRẺ"
        visible={this.props.visible}
      >
        <TableTransfer
          dataSource={dataSource}
          targetKeys={targetKeys}
          // showSearch
          onChange={this.onChange}
          filterOption={(inputValue, item) => item?.fullName?.indexOf(inputValue) !== -1}
          leftColumns={this.header()}
          rightColumns={this.header()}
          showSelectAll={false}
          search={['keyWord', 'branch', 'class']}
          changeSearch={(e, name, direction) => this.changeSearch(e, name, direction)}
          categories={categories}
          valuesForm={form}
        />
      </Modal>
    );
  }
}

Index.propTypes = {
  visible: PropTypes.bool,
  handleCancel: PropTypes.func,
  loading: PropTypes.objectOf(PropTypes.any),
  onSave: PropTypes.func,
  listId: PropTypes.any,
  studentBusPlaces: PropTypes.arrayOf(PropTypes.any),
  students: PropTypes.arrayOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  visible: false,
  handleCancel: () => {},
  loading: {},
  onSave: () => {},
  listId: [],
  studentBusPlaces: [],
  students: [],
  dispatch: {}
};

export default withRouter(Index);
