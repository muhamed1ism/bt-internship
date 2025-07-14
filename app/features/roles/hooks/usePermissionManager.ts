import { useState, useCallback } from 'react';

export function usePermissionManager(initialPermissions: { [category: string]: string[] } = {}) {
  const [selectedPermissions, setSelectedPermissions] = useState<{ [category: string]: string[] }>(
    initialPermissions,
  );
  const [activeTab, setActiveTab] = useState<string>('User Management');

  const updatePermissions = useCallback((permissions: { [category: string]: string[] }) => {
    setSelectedPermissions(permissions);
  }, []);

  const resetPermissions = useCallback((permissions: { [category: string]: string[] } = {}) => {
    setSelectedPermissions(permissions);
    const firstCategory = Object.keys(permissions)[0] || 'User Management';
    setActiveTab(firstCategory);
  }, []);

  return {
    selectedPermissions,
    setSelectedPermissions: updatePermissions,
    activeTab,
    setActiveTab,
    resetPermissions,
  };
}
