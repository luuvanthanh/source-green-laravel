import { memo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Form, List, Timeline } from 'antd'
import { useHistory, useLocation } from 'dva' //useSelector
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment'
import 'moment/locale/vi'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'
import Text from '@/components/CommonComponent/Text';

import variables from '@/utils/variables'
import styles from '@/assets/styles/Common/common.scss';

const { Item: ListItem } = List
const { Item: TimelineItem } = Timeline

const mockMenu = [
  {
    date: '2021/04/12',
    timelines: [
      {
        range: '07:00 - 07:30',
        dishes: [
          { name: 'Hủ tiếu mực tần ô', image: 'https://bit.ly/3mF1QGn' },
          { name: 'Chuối cau' }
        ]
      },
      {
        range: '9:00 - 9:30',
        dishes: [
          { name: 'Nước sâm' },
        ]
      },
      {
        range: '11:00 - 11:45',
        dishes: [
          { name: 'Cá ba sa file sốt cà chua' },
          { name: 'Canh rau ngót nấu tôm' },
          { name: 'Bắp cải luộc' },
          { name: 'Chuối cau' },
        ]
      },
      {
        range: '14:40 - 15:35',
        dishes: [
          { name: 'Sữa TH' }
        ]
      }
    ]
  },
  {
    date: '2021/04/15',
    timelines: [
      {
        range: '07:00 - 07:30',
        dishes: [
          { name: 'Hủ tiếu mực tần ô', image: 'https://bit.ly/3mF1QGn' },
          { name: 'Chuối cau' }
        ]
      },
      {
        range: '9:00 - 9:30',
        dishes: [
          { name: 'Nước sâm' },
        ]
      },
      {
        range: '11:00 - 11:45',
        dishes: [
          { name: 'Cá ba sa file sốt cà chua' },
          { name: 'Canh rau ngót nấu tôm' },
          { name: 'Bắp cải luộc' },
          { name: 'Chuối cau' },
        ]
      },
      {
        range: '14:40 - 15:35',
        dishes: [
          { name: 'Sữa TH' }
        ]
      }
    ]
  },
]

const Index = memo(() => {
  // const [loadingReducer] = useSelector(({ loading }) => [loading])
  // const loading = loadingReducer?.effects['menuKid/GET_DATA']

  const history = useHistory()
  const { query } = useLocation()

  const filterRef = useRef()

  const [search, /*setSearch*/] = useState({
    position: query?.position || 1,
    class: query?.class || 1,
    rangeTime: query?.rangeTime || [
      moment('2021/03/01'),
      moment('2021/03/15'),
    ]
  })

  return (
    <>
      <Helmet title="Danh sách thông báo" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Thực đơn</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
            onClick={() => history.push(`/thuc-don/tao-moi`)}
          >
            Tạo thực đơn
          </Button>
        </Pane>

        <Pane className="card mb20">
          <Pane className="pb-0" style={{ padding: 20 }}>
            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={search}
            >
              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    name="position"
                    type={variables.SELECT}
                    data={[
                      { id: 1, name: 'Lake View' },
                    ]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="class"
                    type={variables.SELECT}
                    data={[
                      { id: 1, name: 'Preschool 1' },
                    ]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="rangeTime"
                    type={variables.RANGE_PICKER}
                  />
                </Pane>
              </Pane>
            </Form>
          </Pane>
        </Pane>

        <Pane className="row justify-content-center">
          <Pane className="col-lg-6 card">
            <Scrollbars
              autoHeight
              autoHeightMax={window.innerHeight - 278}
            >
              <List
                dataSource={mockMenu}
                renderItem={({ date, timelines = [] }, index) => (
                  <ListItem key={index}>
                    <Pane className="w-100">
                      <Pane className="mb10">
                        <Heading type="form-block-title">{moment(date).format('dddd - DD/MM/YYYY')}</ Heading>
                      </Pane>
                      <Timeline>
                        {timelines.map(({ range, dishes }, index) => (
                          <TimelineItem color='red' key={index} style={{ paddingBottom: 10 }}>
                            <Pane><b>{range}</b></Pane>
                            {dishes.map(({ name, image }, index) => (
                              <Pane key={index} className="mb5">
                                <Text size="normal">{name}</Text>
                                {image && <img src={image} alt="dishes-preview" className={styles['dishes-image']} />}
                              </Pane>
                            ))}
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </Pane>
                  </ListItem>
                )}
              />
            </Scrollbars>
          </Pane>
        </Pane>
      </Pane>
    </>
  )
})

export default Index
