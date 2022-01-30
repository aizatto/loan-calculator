import { Button, Form, Input, InputNumber, Radio, Space } from "antd"
import { useState } from "react"
import { DownPaymentType, DTOLong, DTOShort } from "./types"

interface Props {
  initialValues: any,
  onChange: (values: any) => DTOLong,
  onFinish: (values: DTOShort) => void,
}

export const BudgetForm: React.FC<Props> = (props) => {
  const [previewValues, setPreviewValues] = useState<DTOLong>(props.initialValues)

  let downPayment = {
    name: 'downPaymentPercentage',
    addonAfter: '',
  } 
  switch (previewValues.downPaymentType){
  case DownPaymentType.FIXED:
    downPayment.name = 'downPaymentFixed'
    downPayment.addonAfter = ''
    break;
  case DownPaymentType.PERCENTAGE:
    downPayment.name = 'downPaymentPercentage'
    downPayment.addonAfter = '%'
    break;
  }

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={props.initialValues}
      onFinish={props.onFinish}
      autoComplete="off"
    >
      <div>
        <div>
          <Form.Item label="name" name="name">
            <Input />
          </Form.Item>

          <Form.Item
            label="Monthly"
            name="monthly"
            rules={[{ required: true, message: 'Please input your price!' }]}
          >
            <InputNumber
              onChange={(value: number) => {
                setPreviewValues(
                  props.onChange({
                    ...previewValues,
                    monthly: value,
                  })
                )
              }}
            />
          </Form.Item>

          <Form.Item
            label="Down Payment (Type)"
            name="downPaymentType"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
          >
            <Radio.Group
              onChange={(e) => {
                setPreviewValues(
                  props.onChange({
                    ...previewValues,
                    downPaymentType: e.target.value,
                  })
                )
              }} >
              <Space direction="vertical">
                <Radio value="percentage">Percentage</Radio>
                <Radio value="fixed">Fixed</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Down Payment"
            name={downPayment.name}
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
          >
            <InputNumber
              addonAfter={downPayment.addonAfter}
              onChange={(value: number) => {
                switch (previewValues.downPaymentType) {
                case DownPaymentType.FIXED:
                  setPreviewValues(
                    props.onChange({
                      ...previewValues,
                      downPaymentFixed: value,
                    })
                  )
                  break;
                case DownPaymentType.PERCENTAGE:
                  setPreviewValues(
                    props.onChange({
                      ...previewValues,
                      downPaymentPercentage: value,
                    })
                  )
                  break;
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Loan Period (Years)"
            name="loanPeriodYears"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
          >
            <InputNumber
              addonAfter="years"
              onChange={(value: number) => {
                setPreviewValues(
                  props.onChange({
                    ...previewValues,
                    loanPeriodYears: value,
                  })
                )
              }}
            />
          </Form.Item>

          <Form.Item
            label="Interest Rate (%)"
            name="interestRate"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
          >
            <InputNumber
              formatter={(value) => `${value}%`}
              onChange={(value: number) => {
                setPreviewValues(
                  props.onChange({
                    ...previewValues,
                    interestRate: value,
                  })
                )
              }}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Price" name="price">
            {Number(previewValues.price).toLocaleString()}
          </Form.Item>

          <Form.Item label="Down Payment" name="downPayment">
            {Number(previewValues.downPaymentFixed).toLocaleString()}
          </Form.Item>

          <Form.Item label="Loan Size" name="loanSize">
            {Number(previewValues.loanSize).toLocaleString()}
          </Form.Item>

          <Form.Item label="Total Interest" name="totalInterest">
            {Number(previewValues.totalInterest).toLocaleString()}
          </Form.Item>

          <Form.Item label="Lifetime Cost" name="totalInterest">
            {Number(previewValues.lifetimeCost).toLocaleString()}
          </Form.Item>
        </div>
      </div>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}