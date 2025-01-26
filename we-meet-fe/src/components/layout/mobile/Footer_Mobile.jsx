import styled from "styled-components";

const Footer_Mobile = () => {
  const socialLinks = [
    { name: "Twitter", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "GitHub", url: "#" },
  ];

  const copyright = "2025 스케줄러. All rights reserved.";

  return (
    <MobileContainer>
      <CopyrightWrapper>
        <Copyright>{copyright}</Copyright>
      </CopyrightWrapper>
      {/* <SocialContainer>
        {socialLinks.map(({ name, url }) => (
          <SocialLink key={name} href={url}>
            {name}
          </SocialLink>
        ))}
      </SocialContainer> */}
    </MobileContainer>
  );
};

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 768px) {
    display: none;
  }
`;

const CopyrightWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Copyright = styled.p`
  color: #4b5563;
`;

const SocialContainer = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const SocialLink = styled.a`
  color: #4b5563;
  &:hover {
    color: #111827;
  }
`;

export default Footer_Mobile;
