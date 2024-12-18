import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MANUFACTURERS } from '@/graphql/queries/manufacture';
import { DELETE_MANUFACTURER } from '@/graphql/mutations/manufacture';
import { Table, Button, Popconfirm, message, Spin, Empty } from 'antd';
import { useRouter } from 'next/navigation';
import { Manufacturer } from '@/interfaces/manufacturer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumpster, faFilePen } from '@fortawesome/free-solid-svg-icons';
import styles from './list-manufacturers.module.css';
import EditManufacturer from '../edit-manufacturers/edit-manufacturers';

const ManufacturerList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEditingVisible, setIsEditingVisible] = useState<boolean>(false);
  const [currentManufacturer, setCurrentManufacturer] = useState<Manufacturer | null>(null);
  const router = useRouter();
  const pageSize = 10;

  const { loading, data, error, refetch } = useQuery(GET_MANUFACTURERS, {
    variables: {
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
    },
  });

  const [deleteManufacturer] = useMutation(DELETE_MANUFACTURER);

  const handleEditing = (manufacturer: Manufacturer) => {
    setCurrentManufacturer(manufacturer);
    setIsEditingVisible(true);
  };

  const handleDeleting = async (manufacturerId: string) => {
    try {
      const { data } = await deleteManufacturer({ variables: { id: manufacturerId } });
      if (data.deleteManufacturer) {
        message.success('Manufacturer deleted successfully');
        // Check if we need to go to previous page after deletion
        const currentItems = data?.getManufacturers?.manufacturers?.length || 0;
        if (currentItems === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
        refetch();
      } else {
        message.error(`Error deleting manufacturer with Id: ${manufacturerId}`);
      }
    } catch (error) {
      message.error('An error occurred while trying to delete the manufacturer');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Country',
      dataIndex: 'country',
    },
    {
      title: 'Actions',
      render: (_: any, record: Manufacturer) => (
        <div className={styles.actionsContainer}>
          <Button 
            onClick={() => handleEditing(record)}
            icon={<FontAwesomeIcon icon={faFilePen} />} 
            className={styles.editButton} 
          />
          <Popconfirm
            title="Are you sure you want to delete this manufacturer?"
            onConfirm={() => handleDeleting(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<FontAwesomeIcon icon={faDumpster} />} 
              className={styles.deleteButton} 
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Spin size="default" className={styles.spin} />;
  }

  if (error) {
    return <p>Error fetching the manufacturers: {error.message}</p>;
  }

  const manufacturers = data?.getManufacturers?.manufacturers || [];
  const totalCount = data?.getManufacturers?.totalCount || 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manufacturers List</h1>
      <Button 
        onClick={() => router.push('/add-manufacturer')}
        className={styles.addButton}
      >
        Add Manufacturer
      </Button>

      <Table
        dataSource={manufacturers}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: <Empty description="No manufacturers available. Click 'Add Manufacturer' to add new entries." />,
        }}
        className={styles.table}
      />

      {isEditingVisible && currentManufacturer && (
        <EditManufacturer
          visible={isEditingVisible}
          onClose={() => setIsEditingVisible(false)}
          manufacturer={currentManufacturer}
        />
      )}
    </div>
  );
};

export default ManufacturerList;