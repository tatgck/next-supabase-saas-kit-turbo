import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StoresTable } from '../stores-table';

describe('StoresTable', () => {
  const mockStores = [
    {
      id: '1',
      name: '测试门店',
      owner_id: 'user1',
      address: '测试地址',
      status: 'active' as const,
      rating: 4.5,
      review_count: 100,
      monthly_revenue: 50000,
      barber_count: 5,
      workstation_count: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: '待审核门店',
      owner_id: 'user2',
      address: '待审核地址',
      status: 'pending' as const,
      rating: 0,
      review_count: 0,
      monthly_revenue: 0,
      barber_count: 0,
      workstation_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  it('should render stores in grid view', () => {
    render(
      <StoresTable
        stores={mockStores}
        loading={false}
      />
    );

    expect(screen.getByText('测试门店')).toBeInTheDocument();
    expect(screen.getByText('待审核门店')).toBeInTheDocument();
    expect(screen.getByText('营业中')).toBeInTheDocument();
    expect(screen.getByText('待审核')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<StoresTable stores={[]} loading={true} />);
    
    // 检查是否显示加载骨架屏
    const skeletons = document.querySelectorAll('[data-testid="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render empty state', () => {
    render(<StoresTable stores={[]} loading={false} />);
    
    expect(screen.getByText('暂无门店数据')).toBeInTheDocument();
  });

  it('should switch to list view', async () => {
    const user = userEvent.setup();
    render(<StoresTable stores={mockStores} loading={false} />);
    
    // 切换到列表视图
    const listViewButton = screen.getByText('列表视图');
    await user.click(listViewButton);
    
    // 检查是否显示表格视图
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should call callback when store actions are clicked', async () => {
    const user = userEvent.setup();
    const onViewStore = vi.fn();
    const onEditStore = vi.fn();
    
    render(
      <StoresTable
        stores={mockStores}
        loading={false}
        onViewStore={onViewStore}
        onEditStore={onEditStore}
      />
    );
    
    // 点击更多按钮
    const moreButtons = screen.getAllByRole('button', { name: /more/i });
    await user.click(moreButtons[0]);
    
    // 点击查看详情
    const viewButton = screen.getByText('查看详情');
    await user.click(viewButton);
    
    expect(onViewStore).toHaveBeenCalledWith(mockStores[0]);
  });
});