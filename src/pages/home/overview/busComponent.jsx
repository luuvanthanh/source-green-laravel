import { memo, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import { Avatar, Form, Modal } from 'antd';

import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

import styles from '../index.scss';
import variablesModules from '../variables';

const Index = memo(() => {

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState({});

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
          <p className="mb0 ml10">Su Beo</p>
        </div>
      )
    },
    {
      title: 'Tuổi (tháng)',
      key: 'age',
      className: 'min-width-120',
      width: 120,
      render: () => '32 tháng'
    },
    {
      title: 'Thời gian lên xe',
      key: 'time',
      className: 'min-width-120',
      width: 120,
      render: () => '07:01:12'
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
          <p className="mb0 ml10">Nguyễn Anh</p>
        </div>
      )
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-120',
      width: 120,
      render: () => 'Preschool 1'
    },
    {
      title: 'Giáo viên',
      key: 'teacher',
      className: 'min-width-250',
      width: 250,
      render: () => 'Nguyễn Văn Tuyết, Lê Xuân Thanh, Lê Tiểu Linh'
    },
  ];

  const getDetail = (record) => {
    setVisible(true);
    setTitle(`Danh sách ${record?.name?.toLowerCase()}`);
    setDetails(record);
  };

  const cancelModal = () => {
    setVisible(false);
  };

  const selectBranch = () => {};

  const onChange = () => {};

  return (
    <>
      <Modal
        className={styles['modal-student-detail']}
        visible={visible}
        title={title}
        width="95%"
        onCancel={cancelModal}
        footer={null}
      >
        <div className="p20">
          <Form>
            <div className="row">
              <div className="col-md-4 col-xl-3">
                <FormItem
                  className="mb-10"
                  name="name"
                  onChange={(event) => onChange(event, 'name')}
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
                  onChange={selectBranch}
                  allowClear={false}
                />
              </div>
              <div className="col-md-4 col-xl-7">
                <p className="d-flex align-items-center justify-content-end mb0">
                  {details?.name} <span className="text-success font-size-30 font-weight-bold ml10">56</span>
                </p>
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={header()}
            dataSource={[{id: 1}, {id: 2}]}
            // loading={loading}
            pagination={false}
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
              <img src="/images/home/road.svg" alt="notification" className={styles.icon} />
              <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Bus</span>
            </div>
          </div>
          <div className="mt50">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 335}>
              <div className={styles['content-bus']}>
                {variablesModules.DATA_BUS.map((item, index) => {
                  if (index === 0) {
                    return (
                      <div
                        key={index}
                        className={classnames(styles['content-tab'], styles.bus, 'width-100p', 'mb12')}
                        onClick={() => getDetail(item)}
                        aria-hidden="true"
                      >
                        <div className={classnames('d-flex', 'align-items-center', 'justify-content-between', styles['header-content-tab'])}>
                          <div className="d-flex align-items-center font-weight-bold ">
                            <Avatar
                              src={item.image}
                              size={24}
                            />
                            <p className="mb0 ml10">{item?.name}</p>
                          </div>
                          <p className={classnames('mb0', 'ml10', 'font-size-30', 'font-weight-bold', 'text-black')}>{item.number}</p>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={index}
                      className={classnames(styles['half-width'], 'pointer')}
                      onClick={() => getDetail(item)}
                      aria-hidden="true"
                    >
                      <Avatar
                        src={item.image}
                        size={30}
                      />
                      <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>{item.name}</p>
                      <p className={classnames('mb0', 'font-size-30', 'font-weight-bold', 'text-black', 'mt-auto', styles.number)}>{item.number}</p>
                    </div>
                  );
                })}
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
    </>
  );
});

export default Index;
