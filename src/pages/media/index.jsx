import { memo, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Form } from 'antd'
import { useSelector, useHistory, useLocation } from 'dva'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import variables from '@/utils/variables'
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const [loadingReducer, paginationReducer] = useSelector(({ loading, media = {} }) => [loading, media?.pagination])
  const loading = loadingReducer?.effects['media/GET_DATA']

  const history = useHistory()
  const { query } = useLocation()

  const filterRef = useRef()

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  })

  const columns = useMemo(() => [
    {
      title: 'Mã ID',
      key: 'index',
      className: 'min-width-70',
      align: 'center',
      render: () => 'TD01'
    },
    {
      title: 'Thời gian',
      key: 'time',
      className: 'min-width-140',
      render: () => <Text size="normal">10:15, 15/3/2021</Text>
    },
    {
      title: 'Cơ sở',
      key: 'position',
      className: 'min-width-70',
      render: () => <Text size="normal">Lake viewh</Text>
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-70',
      render: () => <Text size="normal">Preschool</Text>
    },
    {
      title: 'Mô tả',
      key: 'description',
      className: 'min-width-150',
      render: () => <Text size="normal">Bé hoạt động</Text>
    },
    {
      title: 'Phụ huynh',
      key: 'parent',
      className: 'min-width-70',
      render: () => <Text size="normal">Nguyễn Anh</Text>
    },
    {
      title: 'Học sinh',
      key: 'student',
      className: 'min-width-70',
      render: () => <Text size="normal">Su Beo</Text>
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 80,
      render: () => (
        <div className={styles['list-button']}>
          <Button
            color="success"
            ghost
            onClick={() => history.push('/thong-bao/1/chi-tiet')}
          >
            Chi tiết
          </Button>
        </div>
      )
    },
  ], [])

  const pagination = useMemo(() => ({
    size: 'default',
    total: paginationReducer?.total || 0,
    pageSize: variables.PAGINATION.PAGE_SIZE,
    defaultCurrent: Number(search.page),
    current: Number(search.page),
    hideOnSinglePage: (paginationReducer?.total || 0) <= 10,
    showSizeChanger: false,
    pageSizeOptions: false,
    onChange: (page, limit) => {
      setSearch(prev => ({
        ...prev,
        page,
        limit
      }))
      // callback
    },
  }), [paginationReducer])

  return (
    <>
      <Helmet title="Danh sách ghi nhận" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh sách ghi nhận</Heading>
        </Pane>

        <Pane className="card">
          <Pane className="p20">
            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{
                position: 0,
                class: 0
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="search"
                    type={variables.INPUT_SEARCH}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="position"
                    type={variables.SELECT}
                    data={[ { id: 0, name: 'Tất cả cơ sở' } ]}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="class"
                    type={variables.SELECT}
                    data={[ { id: 0, name: 'Tất cả lớp' } ]}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="rangeTime"
                    type={variables.RANGE_PICKER}
                  />
                </Pane>
              </Pane>
            </Form>

            <Table
              columns={columns}
              dataSource={[{ id: 1 }]}
              loading={loading}
              pagination={pagination}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  )
})

export default Index
