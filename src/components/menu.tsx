import { Menu as AntMenu } from 'antd'
import {
  GithubOutlined,
  LinkedinOutlined,
  QuestionOutlined,
  ExperimentOutlined,
  FileAddOutlined,
  CarOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

export const Menu: React.FC = () => {
  return (
    <AntMenu mode="horizontal" defaultSelectedKeys={['car']}>
      <AntMenu.Item key="car" icon={<CarOutlined />}>
        <Link to="/car">Car Loan Calculator</Link>
      </AntMenu.Item>
      <AntMenu.Item key="car-budget" icon={<CarOutlined />}>
        <Link to="/car-budget">Reverse Car Loan Calculator</Link>
      </AntMenu.Item>
      <AntMenu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/home">Home Loan Calculator</Link>
      </AntMenu.Item>
      <AntMenu.Item key="home-budget" icon={<HomeOutlined />}>
        <Link to="/home-budget">Reverse Home Loan Calculator</Link>
      </AntMenu.Item>

      <AntMenu.Item key="aizatto.com" icon={<FileAddOutlined />}>
        <a
          href="https://www.aizatto.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          aizatto.com
        </a>
      </AntMenu.Item>
      <AntMenu.Item key="build.my" icon={<ExperimentOutlined />}>
        <a
          href="https://www.build.my/"
          target="_blank"
          rel="noopener noreferrer"
        >
          build.my
        </a>
      </AntMenu.Item>
      <AntMenu.Item key="deepthought" icon={<QuestionOutlined />}>
        <a
          href="https://www.deepthought.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deep Thought
        </a>
      </AntMenu.Item>
      <AntMenu.Item key="github" icon={<GithubOutlined />}>
        <a
          href="https://www.github.com/aizatto/loan-calculator/"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </AntMenu.Item>
      <AntMenu.Item key="linkedin" icon={<LinkedinOutlined />}>
        <a
          href="https://www.linkedin.com/in/aizatto/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </AntMenu.Item>
    </AntMenu>
  )
}
