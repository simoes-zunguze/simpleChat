import React, { useContext } from "react";
import styled from "styled-components";
import { MemberContext } from "../contexts/MemberContext";

const Members: React.FC = () => {
  const { members } = useContext(MemberContext);
  return (
    <MembersWrapper>
      {/* <div>{
        members?.map(member => <div>{member.username}</div>)
      }</div> */}
    </MembersWrapper>
  );
};

const MembersWrapper = styled.div`
  background-color: red;
`;

export default Members;
