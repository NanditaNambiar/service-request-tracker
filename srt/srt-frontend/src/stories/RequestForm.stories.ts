import type { Meta, StoryObj } from '@storybook/react-vite';
import RequestForm from '../components/RequestForm';

const meta = {
  title: 'Components/RequestForm',
  component: RequestForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RequestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCategories = [
  { id: 1, name: 'IT Support' },
  { id: 2, name: 'Hardware' },
  { id: 3, name: 'Accounts' },
  { id: 4, name: 'Network' },
];

export const Default: Story = {
  args: {
    categories: mockCategories,
  },
};

export const WithManyCategories: Story = {
  args: {
    categories: [
      ...mockCategories,
      { id: 5, name: 'Software' },
      { id: 6, name: 'Facilities' },
      { id: 7, name: 'Other' },
    ],
  },
};
