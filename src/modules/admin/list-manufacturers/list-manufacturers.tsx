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
  const { loading, data, error, refetch } = useQuery(GET_MANUFACTURERS); // Fetch manufacturers
  const [deleteManufacturer] = useMutation(DELETE_MANUFACTURER); // Mutation to delete a manufacturer
  const [isEditingVisible, setIsEditingVisible] = useState<boolean>(false); // State for editing modal visibility
  const [currentManufacturer, setCurrentManufacturer] = useState<Manufacturer | null>(null); // Current manufacturer to edit
  const router = useRouter();

  const handleEditing = (manufacturer: Manufacturer) => {
    setCurrentManufacturer(manufacturer); // Set manufacturer for editing
    setIsEditingVisible(true); // Show edit modal
  };

  const handleDeleting = async (manufacturerId: string) => {
    try {
      const { data } = await deleteManufacturer({ variables: { id: manufacturerId } }); // Delete manufacturer
      if (data.deleteManufacturer) {
        message.success('Manufacturer deleted successfully');
        refetch(); // Refresh the list after deletion
      } else {
        message.error(`Error deleting manufacturer with Id: ${manufacturerId}`);
      }
    } catch (error) {
      message.error('An error occurred while trying to delete the manufacturer');
    }
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
      title: 'Actions', // Column for action buttons
      render: (_: any, record: Manufacturer) => (
        <div className={styles.actionsContainer}>
          <Button 
            onClick={() => handleEditing(record)} // Edit action
            icon={<FontAwesomeIcon icon={faFilePen} />} 
            className={styles.editButton} 
          />
          <Popconfirm
            title="Are you sure you want to delete this manufacturer?" // Confirmation for deletion
            onConfirm={() => handleDeleting(record.id)} // Delete on confirmation
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
    return <Spin size="default" className={styles.spin} />; // Show loading spinner
  }

  if (error) {
    return <p>Error fetching the manufacturers: {error.message}</p>; // Show error message
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manufacturers List</h1>
      <Button 
        onClick={() => router.push('/add-manufacturer')} // Navigate to add manufacturer page
        className={styles.addButton}
      >
        Add Manufacturer
      </Button>

      <Table
        dataSource={data?.getManufacturers?.length ? data.getManufacturers : []} // Provide data to the table
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: <Empty description="No manufacturers available. Click 'Add Manufacturer' to add new entries." />,
        }}
        className={styles.table}
      />

      {isEditingVisible && currentManufacturer && (
        <EditManufacturer
          visible={isEditingVisible}
          onClose={() => setIsEditingVisible(false)} // Close edit modal
          manufacturer={currentManufacturer} // Pass current manufacturer to edit
        />
      )}
    </div>
  );
};

export default ManufacturerList;
