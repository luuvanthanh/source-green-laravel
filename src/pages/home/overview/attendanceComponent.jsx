import { memo, useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Modal, Form, Avatar, Skeleton } from 'antd';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';

import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';

import { variables } from '@/utils';
import styles from '../index.scss';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [ { attendances, listAttendancesByStatus }, loading] = useSelector(({ loading: { effects }, overView }) => [
    overView,
    effects,
  ]);

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState({});
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    classId: '',
    keyWord: ''
  });

  const fetchDataNotes = () => {
    dispatch({
      type: 'overView/GET_DATA_ATTENDANCE',
    });
  };

  const getListAttendanceByStatus = () => {
    dispatch({
      type: 'overView/GET_DATA_ATTENDANCE_BY_STATUS',
      payload: {
        ...search
      }
    });
  };

  const getClasses = () => {
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: '',
      },
      callback: (res) => {
        if (!_.isEmpty(res.items)) {
          setClasses(res.items);
        }
      },
    });
  };

  useEffect(() => {
    fetchDataNotes();
  }, []);

  useEffect(() => {
    getListAttendanceByStatus();
  }, [search]);

  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'Trẻ',
      key: 'children',
      className: 'min-width-250',
      width: 250,
      render: () => (
        <div className="d-flex align-items-center">
          <Avatar
            src="/images/slice/avatar_02.png"
            shape="square"
            size={40}
          />
          <p className="mb0 ml10">Vân Khánh</p>
        </div>
      )
    },
    {
      title: 'Tuổi (tháng)',
      key: 'age',
      className: 'min-width-150',
      width: 150,
      render: () => '32 tháng'
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-150',
      width: 150,
      render: () => 'Preschool 1'
    },
    {
      title: 'Phụ huynh',
      key: 'parents',
      className: 'min-width-250',
      width: 250,
      render: () => (
        <div className="d-flex align-items-center">
          <Avatar
            src="/images/slice/avatar.png"
            shape="square"
            size={40}
          />
          <p className="mb0 ml10">Lê Tường Vy</p>
        </div>
      )
    },
    {
      title: 'Giáo viên',
      key: 'teacher',
      className: 'min-width-300',
      width: 300,
      render: () => 'Nguyễn Văn Tuyết, Lê Xuân Thanh, Lê Tiểu Linh'
    },
  ];

  const getDetails = (record) => {
    setVisible(true);
    setTitle(record?.title);
    setDetails(record);
    getListAttendanceByStatus();
    getClasses();
  };

  const cancelModal = () => {
    setVisible(false);
  };

  const handleSearch = _.debounce((value, name) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  }, 300);

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
   const changePagination = (page, limit) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      page,
      limit,
    }));
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const pagination = (pagination) => ({
    size: 'default',
    total: pagination?.total,
    pageSize: search.limit,
    defaultCurrent: Number(search.page),
    current: Number(search.page),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      changePagination(page, size);
    },
    onShowSizeChange: (current, size) => {
      changePagination(current, size);
    },
    showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
  });

  const getTitleAmount = (record) => {
    if (record?.id === variables.STATUS_ABSENT.ANNUAL_LEAVE || record?.id === variables.STATUS_ABSENT.UNPAID_LEAVE) {
      return `số trẻ ${record?.name?.toLowerCase()}`;
    }
    return record?.name;
  };

  return (
    <>
      <Modal
        className={styles['modal-student-detail']}
        visible={visible}
        title={title}
        width="90%"
        onCancel={cancelModal}
        footer={null}
      >
        <div className="p20">
          <Form>
            <div className="row">
              <div className="col-md-4 col-xl-3">
                <FormItem
                  className="mb-10"
                  name="keyWord"
                  onChange={(event) => handleSearch(event.target.value, 'keyWord')}
                  placeholder="Nhập từ khóa tìm kiếm"
                  type={variables.INPUT_SEARCH}
                />
              </div>
              <div className="col-md-4 col-xl-3">
                <FormItem
                  className="mb-10"
                  name="class"
                  type={variables.SELECT}
                  data={[{ id: '', name: 'Tất cả các lớp' }, ...classes]}
                  onChange={(event) => handleSearch(event, 'classId')}
                  allowClear={false}
                />
              </div>
              <div className="col-md-4 col-xl-6">
                <p className="d-flex align-items-center justify-content-end mb0">
                  {getTitleAmount(details)}
                  <span
                    className={`${details?.id === variables.STATUS_ABSENT.UNPAID_LEAVE ? 'text-warning' : 'text-success'} font-size-30 font-weight-bold ml10`}
                  >
                    {details?.number}
                  </span>
                </p>
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={header()}
            dataSource={listAttendancesByStatus?.data}
            loading={loading['overView/GET_DATA_ATTENDANCE_BY_STATUS']}
            pagination={pagination(listAttendancesByStatus?.pagination)}
            params={{
              header: header(),
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
              <img src="/images/home/note.svg" alt="notification" className={styles.icon} />
              <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Điểm danh vào lớp</span>
            </div>
          </div>
          <div className="mt50">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 335}>
              <div className={classnames(styles['content-bus'])}>
                {loading['overView/GET_DATA_ATTENDANCE'] ? (
                  <>
                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                  </>
                ) : (
                  attendances.map((item, index) => (
                    <div
                      key={index}
                      className={ classnames('pointer', styles['half-width']) }
                      onClick={() => getDetails(item)}
                      aria-hidden="true"
                    >
                      <Avatar
                        src={item.image}
                        size={30}
                      />
                      <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>{item.name}</p>
                      <p className={classnames('mb0', 'font-size-30', 'font-weight-bold', 'text-black', 'mt-auto', styles.number)}>{item.number}</p>
                    </div>
                  ))
                )}
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
    </>
  );
});

export default Index;
