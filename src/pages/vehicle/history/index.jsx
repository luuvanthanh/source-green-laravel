import { memo, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Form, Tabs } from 'antd'
import { useSelector, useLocation } from 'dva'
import csx from 'classnames'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'
import Table from '@/components/CommonComponent/Table'
import Text from '@/components/CommonComponent/Text'

import variables from '@/utils/variables'
import variablesModules from '../utils/variables'
import styles from '@/assets/styles/Common/common.scss'

import RouteModal from './route'

const { TabPane } = Tabs

const Index = memo(() => {
  const [loadingReducer, paginationReducer] = useSelector(({ loading, busHistory = {} }) => [loading, busHistory?.pagination])
  const loading = loadingReducer?.effects['notification/GET_DATA']

  const { query } = useLocation()

  const filterRef = useRef()

  const [visibleRoute, setVisibleRoute] = useState(false)
  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  })

  const columns = useMemo(() => [
    {
      title: 'STT',
      key: 'index',
      className: 'min-width-70',
      align: 'center',
      render: () => '1'
    },
    {
      title: 'Cơ sở',
      key: 'premises',
      className: 'min-width-70',
      render: () => <Text size="normal">Lake view</Text>
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-70',
      render: () => <Text size="normal">Preschool 1</Text>
    },
    {
      title: 'Trẻ',
      key: 'student',
      className: 'min-width-70',
      render: () => <Text size="normal">Su Beo</Text>
    },
    {
      title: 'Địa điểm',
      key: 'location',
      className: 'min-width-150',
      render: () => <Text size="normal">165 Hoàng Văn Thụ</Text>
    },
    {
      title: 'Lên xe',
      key: 'start',
      className: 'min-width-70',
      render: () => <Text size="normal">07:15</Text>
    },
    {
      title: 'Xuống xe',
      key: 'end',
      className: 'min-width-70',
      render: () => <Text size="normal">07:23</Text>
    },
    {
      title: 'Bảo mẫu',
      key: 'shuttler',
      className: 'min-width-70',
      render: () => <Text size="normal">Lê Thị Vân</Text>
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
            onClick={() => setVisibleRoute(true)}
          >
            Xem lộ trình
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
      <Helmet title="Lịch sử điểm danh" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Lịch sử điểm danh</Heading>
        </Pane>

        <Pane className="card">
          <Pane className={csx(styles['block-table'], styles['block-table-tab'])}>
            <Tabs>
              {variablesModules.TABS.map(({ id, name }) => (
                <TabPane tab={name} key={id} />
              ))}
            </Tabs>

            <Form
              layout="vertical"
              ref={filterRef}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="premises"
                    type={variables.SELECT}
                    data={[]}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="class"
                    type={variables.SELECT}
                    data={[]}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="date"
                    type={variables.DATE_PICKER}
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
      <RouteModal visible={visibleRoute} onCancel={() => setVisibleRoute(false)} />
    </>
  )
})

export default Index
