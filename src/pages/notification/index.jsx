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
  const [loadingReducer, paginationReducer] = useSelector(({ loading, notification = {} }) => [loading, notification?.pagination])
  const loading = loadingReducer?.effects['notification/GET_DATA']

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
      title: 'Thời gian gửi',
      key: 'time',
      className: 'min-width-140',
      render: () => <Text size="normal">10:15, 15/3/2021</Text>
    },
    {
      title: 'Người gửi',
      key: 'creator',
      className: 'min-width-70',
      render: () => <Text size="normal">Nguyễn Ngọc Bích</Text>
    },
    {
      title: 'Tiêu đề',
      key: 'title',
      className: 'min-width-70',
      render: () => <Text size="normal">Khám sức khỏe đầu năm</Text>
    },
    {
      title: 'Nội dung',
      key: 'description',
      className: 'min-width-150',
      width: '40%',
      render: () => <Text size="normal">Thực hiện theo kế hoạch y tế năm học 2020 - 2021</Text>
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
      <Helmet title="Danh sách thông báo" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh sách thông báo</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
          // onClick={() => history.push(`/thong-bao/tao-moi`)}
          >
            Tạo thông báo
          </Button>
        </Pane>
        <Pane className="card">
          <Pane className="p20">
            <Form
              layout="vertical"
              ref={filterRef}
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
