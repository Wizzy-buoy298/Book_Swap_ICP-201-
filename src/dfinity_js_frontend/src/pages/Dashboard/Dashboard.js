import React from 'react';
import { CRow, CCol } from '@coreui/react';
import BookList from '../../components/BookManagement/ListAvailableBooks';
import SwapRequestComponent from '../../components/SwapRequest/CreateSwapRequest';
import FeedbackComponent from '../../components/BookFeedBack/SubmitFeedback';

const Dashboard = () => {
  return (
    <CRow>
      <CCol xs={12} className="mb-4">
        <BookListComponent />
      </CCol>
      <CCol xs={12} className="mb-4">
        <SwapRequestComponent />
      </CCol>
      <CCol xs={12} className="mb-4">
        <FeedbackComponent />
      </CCol>
    </CRow>
  );
};

export default Dashboard;
