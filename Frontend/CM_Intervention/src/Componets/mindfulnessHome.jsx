import React from 'react';
import { useNavigate } from 'react-router';
import { rcStyles } from '../Static/rockClimbingStyles';
import { ActionPanel } from './ActionPanel.tsx';
import {
    BackButton,
    Container,
    Header,
    HeaderLeft,
    HeaderSubtitle,
    MainTitle,
    Paragraph,
    PrimaryButton,
    SecondaryButton,
    Section,
    Title,
} from "./Layout.tsx";

export default function MindfulnessHome() {
    const navigate = useNavigate();

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <MainTitle>Mindfulness</MainTitle>
                    <HeaderSubtitle>
                        A short space for affirming phrases and gentle stat
                        feedback—no scores to beat.
                    </HeaderSubtitle>
                </HeaderLeft>
                <BackButton onClick={() => navigate("/")}>
                    Back to hub
                </BackButton>
            </Header>

            <Section>
                <Title>Ready?</Title>
                <Paragraph>
                    Open the phrase game whenever you want a moment to check in
                    with yourself.
                </Paragraph>
                <PrimaryButton
                    id={"start-mindfulness"}
                    onClick={() => navigate("/mindfulness")}
                >
                    Start mindfulness game
                </PrimaryButton>
            </Section>
        </Container>
    );
}
