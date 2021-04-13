import { memo, useRef } from 'react'
import { Form } from 'antd'
import { Helmet } from 'react-helmet';
import { Scrollbars } from 'react-custom-scrollbars';
import { useHistory } from 'umi'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'
import NoData from '@/components/CommonComponent/NoData'

import variables from '@/utils/variables'

const Index = memo(() => {
  const filterRef = useRef()
  const history = useHistory()

  return (
    <>
      <Helmet title="Duyệt hình" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh sách hình ảnh đã tải lên</Heading>
          <Button
            className="ml-auto"
            color="primary"
            icon="upload1"
            onClick={() => { }}
          >
            Tải ảnh lên
          </Button>
        </Pane>

        <Pane className="card">
          <Pane className="pt20 px20 border-bottom">
            <Form
              layout="vertical"
              ref={filterRef}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="date"
                    type={variables.DATE_PICKER}
                  />
                </Pane>
              </Pane>
            </Form>
          </Pane>

          {false
            ? (
              <Pane className="p20">
                <NoData />
              </Pane>
            ) : (
              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 312}>

                <Pane className="px20 py10">
                  <Pane className="row">
                    {new Array(8).fill(null).map((v, index) => (
                      <Pane
                        className="col-lg-2 position-relative my10"
                        key={index}
                      >
                        <img
                          className="d-block w-100"
                          src={'https://picsum.photos/300/200'}
                          alt={`student-image-${index}`}
                        />

                        <Button
                          icon="cancel"
                          style={{
                            borderRadius: '50%',
                            transform: 'scale(.6)',
                            position: 'absolute',
                            background: '#fff',
                            right: -4,
                            top: -16,
                          }}
                        />
                      </Pane>
                    ))}
                  </Pane>
                </Pane>
              </Scrollbars>
            )}
        </Pane>

        <Pane>
          <Button
            className="mx-auto"
            color="success"
            icon="checkmark"
            onClick={() => history.push('/ghi-nhan/duyet-hinh/ket-qua')}
          >
            Lọc hình ảnh
          </Button>
        </Pane>
      </Pane>
    </>
  )
})

export default Index
