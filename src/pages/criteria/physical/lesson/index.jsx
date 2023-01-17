import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { variables } from '@/utils';
import { Form } from 'antd';
import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { history } from 'umi';

const Index = memo(() => {

  const header = () => {
    const columns = [
      {
        title: 'Mã ID',
        key: 'id',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record.id}</Text>,
      },
      {
        title: 'Năm học',
        key: 'year',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.year}</Text>,
      },
      {
        title: 'Chương trình học',
        key: 'studyProgram',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.studyProgram}</Text>,
      },
      {
        title: 'Tỉ lệ áp dụng (%)',
        key: 'percent',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.percent}</Text>,
      },
      {
        key: 'action',
        width: 100,
        className: 'max-width-100',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={(e) => { e.stopPropagation(); history.push(`${window.location.pathname}/${record.id}/edit`); }}
            />
            <Button color="danger" icon="remove" onClick={()=>{}} />
          </div>
        ),
      },
    ];
    return columns;
  };

  const fakeData = [
    {
      id: 1,
      year: '2022',
      studyProgram: 'Test 1',
      percent: 40
    },
    {
      id: 2,
      year: '2023',
      studyProgram: 'Test 2',
      percent: 50
    }
  ];

  return (
    <>
        <Helmet title="Bài học" />
        <div className='pl20 pr20 pb20'>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Bài học</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${window.location.pathname}/add`)}>
              Tạo mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              layout="vertical"
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="key"
                    placeholder="Từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={header()}
              dataSource={fakeData}
              loading={false}

              params={{
                header: header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              onRow={(record) => ({
                onClick: () => {
                  history.push(`${window.location.pathname}/${record.id}/detail`);
                },
              })}
              scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
            />
          </div>
        </div>
      </>
  );
});

export default Index;