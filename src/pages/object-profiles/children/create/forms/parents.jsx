import { memo, useRef, useMemo, useState, useCallback } from 'react'
import { Form, Input, DatePicker, Radio } from 'antd'
import moment from 'moment'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import Select from '@/components/CommonComponent/Select'
import ImageUpload from '@/components/CommonComponent/ImageUpload'

import { variables } from '@/utils/variables'
import { group, flatten } from '@/utils/key'

const { Item: FormItem } = Form
const { Group: RadioGroup } = Radio

const infomationTypes = {
  create: 'CREATE',
  select: 'SELECT',
}

const mockParents = [
  { id: 1, name: 'Nguyễn Văn Mai' },
]

const Parents = memo(() => {
  const formRef = useRef()

  const [formType, setFormType] = useState({
    father: infomationTypes.create,
    mother: infomationTypes.create,
  })

  const switchType = useCallback((key, value) => {
    setFormType(prevValue => ({
      ...prevValue,
      [key]: value
    }))
  })

  const typeRadioGroup = useMemo(() => (key) => (
    <Pane className="row">
      <Pane className="col">
        <FormItem name={`${key}.type`}>
          <RadioGroup onChange={({ target: { value }}) => switchType(key, value)}>
            <Radio value={infomationTypes.create}>Tạo mới</Radio>
            <Radio value={infomationTypes.select}>Lấy từ danh sách phụ huynh</Radio>
          </RadioGroup>
        </FormItem>
      </Pane>
    </Pane>
  ), [switchType])

  const detailForm = useMemo(() => (key) => {
    switch (formType[key]) {
      case infomationTypes.create:
        return (
          <>
            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem name={`${key}.avatar`} label="Hình ảnh">
                  <ImageUpload />
                </FormItem>
              </Pane>
            </Pane>

            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem name={`${key}.name`} label="Họ và tên">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name={`${key}.birthday`} label="Ngày sinh">
                  <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} disabledDate={current => current > moment()} />
                </FormItem>
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name={`${key}.job`} label="Nghề nghiệp">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>

              <Pane className="col-lg-4">
                <FormItem name={`${key}.posistion`} label="Chức vụ">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name={`${key}.workplace`} label="Nơi làm việc">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name={`${key}.phone`} label="Số điện thoại">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>

              <Pane className="col-lg-4">
                <FormItem name={`${key}.mail`} label="Email">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name={`${key}.facebook`} label="Link facebook">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>

              <Pane className="col-lg-12">
                <FormItem name={`${key}.favorites`} label="Tính cách và sở thích">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>
            </Pane>
          </>
        )
      case infomationTypes.select:
        return (
          <>
            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem name={`${key}.id`} label="Tên phụ huynh">
                  <Select
                    placeholder="Chọn"
                    dataSet={mockParents}
                  />
                </FormItem>
              </Pane>
            </Pane>
          </>
        )
      default:
        return null
    }
  }, [formType])

  return (
    <Form
      layout="vertical"
      ref={formRef}
      onFinish={values => console.log(group(values))}
      initialValues={flatten({
        father: {
          type: infomationTypes.create,
          name: 'Nguyễn Văn Phước',
          birthday: moment('1986/12/15'),
        },
        mother: {
          type: infomationTypes.create,
          id: 1,
        }
      })}
    >
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>Phụ huynh</Heading>
          <Heading type="form-block-title" style={{ marginBottom: 12 }}>Thông tin cha</Heading>

          {typeRadioGroup('father')}
          {detailForm('father')}
        </Pane>

        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-block-title" style={{ marginBottom: 12 }}>Thông tin mẹ</Heading>

          {typeRadioGroup('mother')}
          {detailForm('mother')}
        </Pane>

        <Pane style={{ padding: 20 }}>
          <Button
            color="success"
            style={{ marginLeft: 'auto' }}
            htmlType="submit"
          >
            Lưu
          </Button>
        </Pane>
      </Pane>
    </Form>
  )
})

export default Parents
