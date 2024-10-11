"use client";

import React from 'react';
import ManufacturerList from '@/modules/admin/list-manufacturers/list-manufacturers';

const ManufactureListPage: React.FC = () => {
  return (
    <div style={{ padding: '60px 60px' }}>
      <ManufacturerList /> 
    </div>
  );
};

export default ManufactureListPage;
