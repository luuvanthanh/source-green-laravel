import { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Form, Modal, Avatar, Skeleton } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import _ from 'lodash';

import { variables, Helper } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '../index.scss';
import variablesModules from '../variables';
import BusComponent from './bus';
import ChildrenComponent from './children';
import HealthComponent from './health';
import NoteComponent from './note';
import MedicalComponent from './medical';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [ { students, detailsStudent }, loading] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

  const [visible, setVisible ] = useState(false);
  const [tab, setTab ] = useState('bus');
  const [studentId, setStudentId] = useState('');
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    keyWord: '',
    class: undefined,
    classStatus: 'ALL',
  });

  const fetchDataStudent = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_STUDENT',
      payload: {
        ...search
      },
    });
  };

  useEffect(() => {
    fetchDataStudent();
  }, [search.keyWord]);


  const onChange = _.debounce((e) => {
    setSearch((prev) => ({
      ...prev,
      keyWord: e.target.value
    }));
  }, 300);

  const cancelModal = () => {
    setVisible(false);
  };

  const changeTab = (tab) => {
    setTab(tab);
  };

  const getDetails = (id) => {
    setStudentId(id);
    setVisible(true);
    dispatch({
      type: 'studentHomePage/GET_DETAIL_STUDENT',
      payload: { id }
    });
  };

  const tables = (tab) => {
    switch (tab) {
      case 'bus':
        return <BusComponent studentId={studentId} />;

      case 'childrenInClass':
        return <ChildrenComponent studentId={studentId} />;

      case 'health':
        return <HealthComponent studentId={studentId} />;

      case 'note':
        return <NoteComponent studentId={studentId} />;

      case 'medical':
        return <MedicalComponent studentId={studentId} />;

      default:
        return null;
    };
  };

  return (
    <div className={classnames(styles['items-container'])}>
      <Form>
        <FormItem
          className={classnames('mt20', 'mb35', styles['input-search'])}
          name="fullName"
          onChange={onChange}
          placeholder="Nhập từ khóa tìm kiếm"
          type={variables.INPUT_SEARCH}
        />
      </Form>
      {!loading['studentHomePage/GET_DATA_STUDENT'] && _.isEmpty(students) && (
        <p className="mb0 p20 border text-center font-weight-bold">{variables.NO_DATA}</p>
      )}
      <div className={styles['container-student']}>
        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 300}>
          {loading['studentHomePage/GET_DATA_STUDENT'] ? (
            <>
              <Skeleton avatar paragraph={{ rows: 4 }} active />
              <Skeleton avatar paragraph={{ rows: 4 }} active />
              <Skeleton avatar paragraph={{ rows: 4 }} active />
            </>
          ) : (
            <div className="d-flex flex-wrap">
              {
                students.map((item, index) => (
                  <div className={styles['block-student']} key={index}>
                    <div
                      onClick={() => getDetails(item.id)}
                      className={styles['content-student']}
                      aria-hidden="true"
                    >
                      <AvatarTable
                        fileImage={Helper.getPathAvatarJson(item?.fileImage)}
                        // fullName={item?.name}
                        size={90}
                      />
                      <p className="font-size-14 mb0 mt5">{item?.fullName}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </Scrollbars>
      </div>
      <Modal
        className={styles['modal-student-detail']}
        visible={visible}
        width="90%"
        onCancel={cancelModal}
        footer={null}
      >
        <div className={classnames('p20', 'border-bottom', styles['header-modal'])}>
          <div className="row">
            <div className="col-lg-3 mt10">
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(detailsStudent?.student?.fileImage)}
                fullName={detailsStudent?.student?.fullName || ''}
                description={`${detailsStudent?.student?.age || 0} tháng tuổi`}
                size={50}
              />
            </div>
            <div className="col-lg-3 mt10">
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(detailsStudent?.farther?.fullName ? detailsStudent?.farther?.fileImage : detailsStudent?.mother?.fileImage)}
                fullName={detailsStudent?.farther?.fullName || detailsStudent?.mother?.fullName}
                description="Phụ huynh"
                size={50}
              />
            </div>
            <div className="col-lg-3 mt10">
              <div className="d-flex">
                <span className={styles.circleIcon}>
                  <span className="icon-open-book" />
                </span>
                <div className="ml10">
                  <p className={classnames('mb0', styles.class)}>Lớp</p>
                  <p className="font-weight-bold font-size-14 mb0">{detailsStudent?.student?.class?.name || 'Preschool'}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mt10">
              <div className="d-flex">
                <Avatar
                  src={`${API_UPLOAD}${Helper.getPathAvatarJson(detailsStudent?.student?.employee?.fileImage)}`}
                  size={50}
                />
                <div className="ml10">
                  <p className={classnames('mb0', styles.class)}>Giáo viên</p>
                  <p className="font-weight-bold font-size-14 mb0">{detailsStudent?.student?.employee?.fullName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['body-modal']}>
          <div className={styles['menu-modal']}>
            {variablesModules.MENU.map((item, index) => (
              <div
                onClick={() => changeTab(item.id)}
                className={classnames(styles['item-menu'],
                styles[item.id === tab? 'actived' : ''])}
                key={index}
                aria-hidden="true"
              >
                <img src={item.image} alt="" className={styles['image-menu']} />
                <p className={classnames('mt10', 'mb0', 'font-size-12', styles['title-menu'])}>{item?.name}</p>
              </div>
            ))}
          </div>
          {tables(tab)}
        </div>
      </Modal>
    </div>
  );
});

export default Index;
