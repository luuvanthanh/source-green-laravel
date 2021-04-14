import { memo, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Form, Tabs } from 'antd'
import csx from 'classnames'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'
import Text from '@/components/CommonComponent/Text'
import AvatarTable from '@/components/CommonComponent/AvatarTable'

import variables from '@/utils/variables'
import variablesModules from '../utils/variables'
import styles from '@/assets/styles/Common/common.scss'
import infoStyles from '@/assets/styles/Common/information.module.scss';

import RouteModal from '../history/route'

const { TabPane } = Tabs

const mockData = [
  {
    location: 'Số 45 Hoàng Hoa Thám',
    list: [
      { id: 1, name: 'Subeo' },
      { id: 2, name: 'An Hưng' },
      { id: 3, name: 'Trần Văn Đức' },
    ]
  },
  {
    location: 'Số 245 Hoàng Hoa Thám',
    list: [
      { id: 4, name: 'Bích Ngọc' },
      { id: 5, name: 'Ngọc Bảo' },
    ]
  },
]

const Index = memo(() => {
  const filterRef = useRef()
  const formRef = useRef()

  const [visibleRoute, setVisibleRoute] = useState(false)

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
              className="border-bottom"
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
              </Pane>
            </Form>


            <Form
              ref={formRef}
            >
              <Pane className="border-bottom py20 d-flex align-items-center">
                <Text size="normal">Số trẻ đã lên xe: <b>8/12</b></Text>
                <Button
                  className="ml-auto"
                  color="success"
                  onClick={() => setVisibleRoute(true)}
                >
                  Xem lộ trình
                </Button>
              </Pane>

              {mockData.map(({ location, list }, index) => (
                <Pane key={index} className="pt20 border-bottom">
                  <Pane className="mb10">
                    <Text size="normal">Điểm đón số {index + 1}: {location}</Text>
                  </Pane>

                  {list.map(({ name }, index) => (
                    <Pane className="row" key={index}>
                      <Pane className="col-lg-3">
                        <Pane className={infoStyles.userInformation}>
                          <AvatarTable />
                          <Pane>
                            <h3>{name}</h3>
                          </Pane>
                        </Pane>
                      </Pane>

                      <Pane className="col-lg-6">
                        <FormItem
                          type={variables.CHECKBOX}
                          data={[
                            { value: 0, label: 'Không lên xe' },
                            { value: 1, label: 'Đã lên xe' },
                            { value: 2, label: 'Đã xuống xe' },
                          ]}
                        />
                        {false &&
                          <FormItem
                            label="Lý do"
                            type={variables.INPUT}
                          />
                        }
                      </Pane>

                      <Pane className="col-lg-3">
                        <Button
                          icon="phone"
                          className="ml-auto"
                          color="success"
                          ghost
                        >
                          Gọi phụ huynh
                        </Button>
                      </Pane>
                    </Pane>
                  ))}
                </Pane>
              ))}
            </Form>
          </Pane>
        </Pane>
      </Pane>
      <RouteModal visible={visibleRoute} onCancel={() => setVisibleRoute(false)} />
    </>
  )
})

export default Index
