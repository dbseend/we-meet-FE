import styled from "styled-components";

const Footer_Desektop = () => {
  const socialLinks = [
    { name: "Twitter", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "GitHub", url: "#" },
  ];

  const copyright = "2025 스케줄러. All rights reserved.";

  return (
    <Container>
      <div>
        <Copyright>{copyright}</Copyright>
      </div>
      {/* <SocialContainer>
        {socialLinks.map(({ name, url }) => (
          <SocialLink key={name} href={url}>
            {name}
          </SocialLink>
        ))}
      </SocialContainer> */}
    </Container>
  );
};

const Container = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
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

export default Footer_Desektop;
