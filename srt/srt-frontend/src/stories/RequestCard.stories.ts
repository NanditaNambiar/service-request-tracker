import type { Meta, StoryObj } from '@storybook/react-vite';
import RequestCard from '../components/RequestCard';

const meta = {
  title: 'Components/RequestCard',
  component: RequestCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RequestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    request: {
      id: 1,
      title: 'Network Issue',
      description: 'Internet connection is slow',
      categoryName: 'IT Support',
      createdByName: 'John Doe',
      handledByName: 'Jane Smith',
      status: true,
    },
  },
};

export const Unassigned: Story = {
  args: {
    request: {
      id: 2,
      title: 'Printer Setup',
      description: 'Need to setup network printer',
      categoryName: 'Hardware',
      createdByName: 'Alice Johnson',
      handledByName: undefined,
      status: true,
    },
  },
};

export const Closed: Story = {
  args: {
    request: {
      id: 3,
      title: 'Password Reset',
      description: 'Reset account password',
      categoryName: 'Accounts',
      createdByName: 'Bob Wilson',
      handledByName: 'Jane Smith',
      status: false,
    },
  },
};
