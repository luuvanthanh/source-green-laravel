import { memo, useRef, useMemo, useState, useCallback } from 'react'
import { Form, Input, Radio } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import csx from 'classnames'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import Select from '@/components/CommonComponent/Select'
import ImageUpload from '@/components/CommonComponent/ImageUpload'

const { Item: FormItem, List: FormList } = Form
const { Group: RadioGroup } = Radio

const infomationTypes = {
  create: 'CREATE',
  select: 'SELECT',
}

const mockParents = [
  { id: 1, name: 'Nguyễn Văn Mai' },
]

const Shuttlers = memo(() => {
  const formRef = useRef()

  const [formType, setFormType] = useState({
    0: infomationTypes.create,
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
        <FormItem name={[key, 'type']}>
          <RadioGroup onChange={({ target: { value } }) => switchType(key, value)}>
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
                <FormItem name={[key, 'avatar']} label="Hình ảnh">
                  <ImageUpload />
                </FormItem>
              </Pane>
            </Pane>

            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem name={[key, 'name']} label="Họ và tên">
                  <Input placeholder="Nhập" />
                </FormItem>
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name={[key, 'relationship']} label="Mối liên hệ">
                  <Select
                    placeholder="Chọn"
                    dataSet={[]}
                  />
                </FormItem>
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name={[key, 'identityCard']} label="Số CMND">
                  <Input placeholder="Nhập" maxLength={9} />
                </FormItem>
              </Pane>

              <Pane className="col-lg-4">
                <FormItem name={[key, 'posistion']} label="Số điện thoại">
                  <Input placeholder="Nhập" maxLength={10} />
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
                <FormItem name={[key, 'id']} label="Tên phụ huynh">
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
      onFinish
      initialValues={{
        shuttlers: [
          {
            type: infomationTypes.create,
            name: 'Nguyễn Văn Phước',
          },
        ]
      }}
    >
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0">
          <Heading type="form-title">Người đưa đón</Heading>
        </Pane>

        <FormList name="shuttlers">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => (
                <Pane
                  key={key}
                  className={csx("pb-0", "border-bottom", "position-relative")}
                  style={{ padding: 20 }}
                >
                  <Heading type="form-block-title" style={{ marginBottom: 12 }}>Người đưa đón {index + 1}</Heading>

                  {typeRadioGroup(name)}
                  {detailForm(name)}

                  {fields.length > 1 && (
                    <DeleteOutlined
                      className="position-absolute"
                      style={{ top: 20, right: 20 }}
                      onClick={() => remove(name)}
                    />
                  )}
                </Pane>
              ))}

              <Pane style={{ padding: 20 }} className="border-bottom">
                <Button
                  color="success"
                  ghost
                  icon="plus"
                  onClick={() => {
                    switchType(fields.length, infomationTypes.create)
                    add({ type: infomationTypes.create })
                  }}
                >
                  Thêm
                </Button>
              </Pane>
            </>
          )}
        </FormList>

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

export default Shuttlers
