import React from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  Header,
  HeaderLeft,
  HeaderSubtitle,
  MainTitle,
  Section,
} from "./Layout";
import { ActionPanel } from "./ActionPanel";

export default function HomeOfHomePages() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <MainTitle>Activity hub</MainTitle>
          <HeaderSubtitle>
            Choose a world: leisure, home, office wellness, or a short
            mindfulness phrase game.
          </HeaderSubtitle>
        </HeaderLeft>
      </Header>

      <Section>
        <ActionPanel
          title={<>Where do you want to go?</>}
          actions={[
            {
              key: "/leisure",
              label: "Leisure",
              callback() {
                navigate("/leisure");
              },
            },
            {
              key: "/domestic-home",
              label: "Domestic (home)",
              callback() {
                navigate("/domestic-home");
              },
            },
            {
              key: "/office",
              label: "Office game",
              callback() {
                navigate("/office");
              },
            },
            {
              key: "/mindfulness-home",
              label: "Mindfulness",
              callback() {
                navigate("/mindfulness-home");
              },
            },
          ]}
        />
      </Section>
    </Container>
  );
}
