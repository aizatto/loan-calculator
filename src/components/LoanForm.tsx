import {
  Form,
  Input,
  InputNumber,
  Button,
  Radio,
  Space,
  FormInstance,
} from 'antd'
import { useState } from 'react'
import { DownPaymentType, Details, LoanFormDTO } from './types'

interface Props {
  form?: FormInstance
  initialValues: any
  onChange: (values: any) => Details
  onFinish: (values: LoanFormDTO) => void
  disableSubmit?: boolean
}

export const LoanForm: React.FC<Props> = (props) => {
  const [previewValues, setPreviewValues] = useState<Details>(
    props.initialValues
  )

  let downPayment = {
    name: 'downPaymentPercentage',
    addonAfter: '',
  }
  switch (previewValues.downPaymentType) {
    case DownPaymentType.FIXED:
      downPayment.name = 'downPaymentFixed'
      downPayment.addonAfter = ''
      break
    case DownPaymentType.PERCENTAGE:
      downPayment.name = 'downPaymentPercentage'
      downPayment.addonAfter = '%'
      break
  }

  return (
    <Form
      name="basic"
      form={props.form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={props.initialValues}
      onFinish={props.onFinish}
      autoComplete="off"
    >
      <div>
        <div>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input your Price' }]}
          >
            <InputNumber
              onChange={(value: number) => {
                setPreviewValues(
                  props.onChange({
                    ...previewValues,
                    price: value,
                  })
                )
              }}
            />
          </Form.Item>

          <Form.Item
            label="Down Payment (Type)"
            name="downPaymentType"
            rules={[
              {
                required: true,
                message: 'Please input your Down Payment Type',
              },
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
              }}
            >
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
              { required: true, message: 'Please input your Down Payment' },
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
                    break
                  case DownPaymentType.PERCENTAGE:
                    setPreviewValues(
                      props.onChange({
                        ...previewValues,
                        downPaymentPercentage: value,
                      })
                    )
                    break
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Loan Period (Years)"
            name="loanPeriodYears"
            rules={[
              { required: true, message: 'Please input your Loan Period' },
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
              { required: true, message: 'Please input your Interest Rate' },
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
          <Form.Item label="Monthly" name="monthly">
            {Number(previewValues.monthly).toLocaleString()}
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

          <Form.Item label="Lifetime Cost" name="lifetimeCost">
            {Number(previewValues.lifetimeCost).toLocaleString()}
          </Form.Item>

          {props.disableSubmit ? null : (
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          )}
        </div>
      </div>
    </Form>
  )
}
