import React from "react";
import styled from "styled-components";
import GoogleLogin from "../auth/GoogleLogin";

const OnBoarding = () => {
  return (
    <Container>
      <div>WE-MEET</div>
      <GoogleLogin />
    </Container>
  );
};

const Container = styled.div`
  max-width: 32rem;
  margin: 0 auto;
  padding: 1rem;
`;

export default OnBoarding;
