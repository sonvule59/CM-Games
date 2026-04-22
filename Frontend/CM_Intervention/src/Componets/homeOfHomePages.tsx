import React from 'react';
import { href, useNavigate } from "react-router";
import {
  Container,
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  MainTitle,
  Section,
} from "./Layout";
import { ActionPanel, ActionPanelButtonStyleToggle } from "./ActionPanel";

/**
 * HomeOfHomePages: top-level hub that routes into the major "worlds" of the app.
 * This intentionally stays data-light: just labels + routes, letting each world
 * own its own internal flow and state.
 */
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
        <HeaderRight>
          <ActionPanelButtonStyleToggle />
        </HeaderRight>
      </Header>

      <Section>
        <ActionPanel
          title={<>Where do you want to go?</>}
          actions={[
            {
              key: "/leisure",
              label: "Leisure",
              callback() {
                navigate(href("/leisure"));
              },
            },
            {
              key: "/domestic-home",
              label: "Domestic (home)",
              callback() {
                navigate(href("/domestic-home"));
              },
            },
            {
              key: "/office",
              label: "Office game",
              callback() {
                navigate(href("/office"));
              },
            },
            {
              key: "/mindfulness-home",
              label: "Mindfulness",
              callback() {
                navigate(href("/mindfulness-home"));
              },
            },
            {
              key: "/transport-home",
              label: "Transport game",
              callback() {
                navigate(href("/transport-home"));
              },
            },
          ]}
        />
      </Section>
    </Container>
  );
}
