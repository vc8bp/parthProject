import React, { useState } from 'react';
import styled from 'styled-components';
import { Skeleton } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import IconBtn from "components/IconBtn"
import { formateDate } from '../../../utils/general';

const Container = styled.div`
  padding: 1rem;
  p {
    color: #555;
    font-size: 14px;
  }
  h2 {
    color: #5b626b;
    font-size: 20px;
    line-height: 28px;
    padding-right: 10px;
    font-weight: 600;
    margin: 1rem 0;
  }
`;

const Section = styled.div`
  margin: 2rem 0;
  >h2{
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  li{
    margin: 1rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: space-between;
  > div {
    flex: 1;
  }
`;

const EducationContainer = styled.div`
  margin: 1rem 0;
  .course{
    font-size: 1.3rem;
    font-weight: bold;;
  }
  .university{
    font-size: 1.3rem;
  }
  >div{
    display: flex;
    justify-content: space-between;

  }
`

// React component
const Profile = ({ user , setUser, IsOther}) => {
  console.log({isOtherFrom: IsOther})

  return (
    <>
      <Container>
        <Section>
          <h2>About</h2>
            <ContactInfo>
              {!user ? <><Skeleton.Input/><Skeleton.Input/><Skeleton.Input/><Skeleton.Input/></> : <>
                  <div>
                  <strong>Full Name</strong>
                  <p>{`${user.firstName} ${user.lastName}`}</p>
                  </div>
                  <div>
                  <strong>Mobile</strong>
                  <p>{user.number}</p>
                  </div>
                  <div>
                  <strong>Email</strong>
                  <p>{user.email}</p>
                  </div>
                  <div>
                  <strong>Location</strong>
                  <p>{user?.address ? `${user.address.city}, ${user.address.state}, ${user.address.country}` : "N/A"}</p>
                  </div>
              </>}
            </ContactInfo>
        </Section>


        {/* <Section>
          <h2>Conferences, Courses & Workshops Attended</h2>
          {!user ? <Skeleton active paragraph={{ rows: 4 }} />
          : (
            <>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </>
          )}
        </Section> */}
      </Container>
    </>
  );
};

export default Profile;
