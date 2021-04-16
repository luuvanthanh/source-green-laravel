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
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import variables from '@/utils/variables'
import styles from '@/assets/styles/Common/common.scss';
import infoStyles from '@/assets/styles/Common/information.module.scss';

const Index = memo(() => {
  const [loadingReducer, paginationReducer] = useSelector(({ loading, healthHistory = {} }) => [loading, healthHistory?.pagination])
  const loading = loadingReducer?.effects['healthHistory/GET_DATA']

  const history = useHistory()
  const { query } = useLocation()

  const filterRef = useRef()

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  })

  const columns = useMemo(() => [
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-100',
      render: () => <Text size="normal">Lake View</Text>
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-100',
      render: () => <Text size="normal">Preschool 1</Text>
    },
    {
      title: 'Trẻ',
      key: 'student',
      className: 'min-width-100',
      render: () => (
        <Pane className={infoStyles.userInformation}>
          <AvatarTable />
          <Pane>
            <h3>{'Su Beo'}</h3>
          </Pane>
        </Pane>
      )
    },
    {
      title: 'Số lần pipi',
      key: 'pipi',
      className: 'min-width-30',
      align: 'center',
      render: () => <Text size="normal">4</Text>
    },
    {
      title: 'Số lần pupu',
      key: 'pupu',
      className: 'min-width-30',
      align: 'center',
      render: () => <Text size="normal">1</Text>
    },
    {
      title: 'Lượng nước uống (bình)',
      key: 'pipi',
      className: 'min-width-70',
      align: 'center',
      render: () => <Text size="normal">2</Text>
    },
    {
      title: 'Ăn sáng',
      key: 'breakfast',
      className: 'min-width-50',
      render: () => <Text size="normal">Tốt</Text>
    },
    {
      title: 'Ăn trưa',
      key: 'lunch',
      className: 'min-width-50',
      render: () => <Text size="normal">Tốt</Text>
    },
    {
      title: 'Ăn xế',
      key: 'tea',
      className: 'min-width-50',
      render: () => <Text size="normal">Bình thường</Text>
    },
    {
      title: 'Ngủ trưa',
      key: 'nap',
      className: 'min-width-50',
      render: () => <Text size="normal">Tốt</Text>
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
            onClick={() => history.push('/suc-khoe/hom-nay/1/chi-tiet')}
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
    },
  }), [paginationReducer])

  return (
    <>
      <Helmet title="Lịch sử sức khỏe" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Lịch sử sức khỏe</Heading>
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
                    name="branch"
                    type={variables.SELECT}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="class"
                    type={variables.SELECT}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="class"
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
    </>
  )
})

export default Index
