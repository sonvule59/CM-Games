import React from 'react';
import { href, useNavigate } from 'react-router';
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

/**
 * MindfulnessHome: lightweight landing page for the mindfulness mini-game.
 * Kept intentionally simple so it reads like a calm "start here" screen.
 */
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
                <BackButton onClick={() => navigate(href("/"))}>
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
                    onClick={() => navigate(href("/mindfulness"))}
                >
                    Start mindfulness game
                </PrimaryButton>
            </Section>
        </Container>
    );
}
