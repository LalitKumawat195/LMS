import React from 'react';
import MemberDetails from './MemberDetails';

const ExampleMemberPage = () => {
  const memberData = {
    name: "Lalit",
    email: "lalit@gmail.com",
    memberId: "MEM540924",
    department: "",
    phone: "",
    status: "Active",
    createdAt: "2026-01-10T00:00:00.000Z"
  };

  return (
    <div style={{ padding: '20px' }}>
      <MemberDetails member={memberData} />
    </div>
  );
};

export default ExampleMemberPage;