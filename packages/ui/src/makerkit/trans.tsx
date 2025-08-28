'use client';

import { useTranslation } from 'react-i18next';

export function Trans(props: { i18nKey: string; values?: Record<string, any>; children?: React.ReactNode }) {
  const { t, ready } = useTranslation();
  
  // If i18n is not ready, show the fallback text
  if (!ready) {
    const key = props.i18nKey || '';
    const fallback = key.split(':').pop() || key;
    return <>{fallback}</>;
  }
  
  return <>{t(props.i18nKey, props.values)}</>;
}
