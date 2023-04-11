import { memo, useEffect, useRef } from 'react';
import Table from '@/components/CommonComponent/Table';
import { useSelector } from 'dva';
import { history, useParams } from 'umi';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import stylesModule from '../styles.module.scss';
import HelperModules from '../../utils/Helper';

const Index = memo(() => {
  const { details } = useSelector(({ hrmRecruitmentRecruitmentListAdd }) => ({
    details: hrmRecruitmentRecruitmentListAdd.details,
  }));

  const mounted = useRef(false);
  const params = useParams();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'no',
        className: 'min-width-80',
        width: 80,
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Ngày ứng tuyển',
        key: 'creationTime',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">
            {' '}
            {Helper.getDate(record?.creationTime, variables.DATE_FORMAT.DATE)}
          </Text>
        ),
      },
      {
        title: 'Họ và tên',
        key: 'name',
        className: 'min-width-250',
        render: (record) => <Text size="normal">{record?.name}</Text>,
      },
      {
        title: 'Vị trí ứng tuyển',
        key: 'location',
        className: 'min-width-250',
        render: (record) => <Text size="normal">{record?.location}</Text>,
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.phone}</Text>,
      },
      {
        title: 'Trạng thái',
        key: 'number',
        className: 'min-width-150',
        render: (record) => HelperModules.tagStatusRecruimentUser(record?.status),
      },
      {
        key: 'text',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (record) => (
          <p
            className={stylesModule['text-table']}
            role="presentation"
            onClick={() =>
              history.push(
                `/quan-ly-nhan-su/tuyen-dung/danh-sach-tuyen-dung/${params?.id}/chi-tiet-nhan-vien?id=${record?.id}`,
              )
            }
          >
            chi tiết
          </p>
        ),
      },
    ];
    return columns;
  };

  return (
    <div className={stylesModule['wrapper-table']}>
      <Table
        columns={header()}
        dataSource={details?.candidate}
        pagination={false}
        isEmpty
        params={{
          header: header(),
          type: 'table',
        }}
        bordered={false}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </div>
  );
});

export default Index;
