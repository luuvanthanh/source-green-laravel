import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Heading from '@/components/CommonComponent/Heading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { Helper, variables } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';

const Index = memo(() => {
  const [
    menuData,
  ] = useSelector(({ menu, physicalCreate, loading: { effects } }) => [
    menu.menuLeftPhysical,
    physicalCreate,
    effects,
  ]);

  const mounted = useRef(false);
  const [error] = useState({
    height: '',
    weight: ''
  });

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const columns = [
    {
      title: 'Chiều cao (cm)',
      children: [
        {
          title: 'Cũ',
          key: 'old',
          className: 'min-width-120',
          align: 'center',
          render: (record) => record?.heightOld || 30
        },
        {
          title: 'Mới',
          key: 'heightNew',
          className: 'min-width-120',
          align: 'center',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
                value={record?.height || ''}
                // onChange={(e) => onChange(e, record, 'heightNew')}
              />
              {error?.height && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          )
        },
      ]
    },
    {
      title: 'Cân nặng (kg)',
      children: [
        {
          title: 'Cũ',
          key: 'weightOld',
          className: 'min-width-120',
          align: 'center',
          render: (record) =>  record?.weightOld || 30
        },
        {
          title: 'Mới',
          key: 'weight',
          className: 'min-width-120',
          align: 'center',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
                value={record?.weight || ''}
                // onChange={(e) => onChange(e, record, 'weightNew')}
              />
              {error?.weight && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          )
        },
      ]
    },
  ];

  return (
    <>
      <Helmet title="Nhập thể chất" />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Breadcrumbs last="Nhập thể chất" menu={menuData} />
        <Pane className="row">
          <Pane className="col-lg-6 offset-lg-3 card">
            <Pane className="p20">
              <Heading type="page-title">Học sinh</Heading>
              <AvatarTable
                fileImage={Helper.getPathAvatarJson('')}
                fullName="Bé Zia"
                description={`${31} tháng tuổi`}
              />
              <Pane className="row">
                <Pane className="col-lg-6 mt15">
                  <Text size="normal">Cơ sở: <span className="font-weight-bold">Lake View</span></Text>
                </Pane>
                <Pane className="col-lg-6 mt15">
                  <Text size="normal">Lớp: <span className="font-weight-bold">Preschool 1</span></Text>
                </Pane>
              </Pane>
              <Pane className="py20">
                <Table
                  bordered
                  columns={columns}
                  dataSource={[{ id: 1 }]}
                  loading={false}
                  isError={error?.isError}
                  pagination={false}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                />
              </Pane>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb0 font-size-14 underline">Hủy</p>
                <Button
                  icon="save"
                  htmlType="submit"
                  size="large"
                  color="success"
                  loading={false}
                >
                  LƯU
                </Button>
              </div>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
