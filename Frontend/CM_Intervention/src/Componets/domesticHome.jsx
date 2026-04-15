import React from 'react';
import { useNavigate } from 'react-router';
import {
  BackButton,
  Container,
  Header,
  HeaderLeft,
  HeaderSubtitle,
  MainTitle,
  ScenePill,
} from "./Layout";
import { ActionPanel } from "./ActionPanel";

export default function DomesticHome() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <MainTitle>Domestic Activities</MainTitle>
          <HeaderSubtitle>
            Pick an activity zone. Inside is classic chores; outside is everyday
            errands and home tasks.
          </HeaderSubtitle>
          <ScenePill>Home base</ScenePill>
        </HeaderLeft>
        <BackButton onClick={() => navigate("/")}>Back to hub</BackButton>
      </Header>

      <ActionPanel
        title={<>Choose where you want to play</>}
        actions={[
          {
            key: "indoor-domestic",
            label: "Inside the house (chores)",
            callback() {
              navigate("/indoor-domestic");
            },
          },
          {
            key: "outside-domestic",
            label: "Outside / around the house",
            callback() {
              navigate("/outside-domestic");
            },
          },
        ]}
      />
    </Container>
  );
}

