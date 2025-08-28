-- Barber Platform 示例数据初始化（简化版）
-- 这个脚本用于在开发环境中初始化barber-platform的示例数据

-- 只在有用户数据时执行
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
    
    -- 1. 创建示例门店
    INSERT INTO public.stores (name, owner_id, address, phone, email, status, rating, review_count, monthly_revenue, description)
    SELECT 
      '时尚理发旗舰店', 
      id,
      '北京市朝阳区建国路88号', 
      '13800138000', 
      'flagship@example.com', 
      'active'::store_status, 
      4.8, 
      125, 
      50000.00, 
      '高端理发服务，专业团队'
    FROM auth.users 
    LIMIT 1
    ON CONFLICT DO NOTHING;

    -- 2. 创建示例工位
    INSERT INTO public.workstations (store_id, number, type, status, hourly_rate, daily_rate, equipment)
    SELECT 
      id,
      'A01',
      'vip'::workstation_type,
      'available'::workstation_status,
      100.00,
      600.00,
      ARRAY['剪刀', '梳子', '吹风机']
    FROM public.stores 
    WHERE name = '时尚理发旗舰店'
    LIMIT 1
    ON CONFLICT DO NOTHING;

    -- 3. 创建示例理发师
    INSERT INTO public.barbers (id, store_id, name, phone, email, specialty, experience_years, rating, review_count, is_available, description)
    SELECT 
      id,
      (SELECT id FROM public.stores WHERE name = '时尚理发旗舰店' LIMIT 1),
      '张大师', 
      '13800138001', 
      'master@example.com', 
      ARRAY['男士发型', '染发', '烫发'], 
      15, 
      4.9, 
      200, 
      true, 
      '15年经验，擅长各种男士发型'
    FROM auth.users 
    LIMIT 1
    ON CONFLICT DO NOTHING;

  END IF;
END $$;