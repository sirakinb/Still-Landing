import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WaitlistConfirmationProps {
  firstName?: string;
}

export default function WaitlistConfirmation({
  firstName = "there",
}: WaitlistConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>You're on the Still waitlist ✨</Preview>
      <Body
        style={{
          fontFamily: "Georgia, serif",
          backgroundColor: "#0a0a0a",
          color: "#f5f5f0",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            padding: "48px 24px",
            maxWidth: "520px",
            margin: "0 auto",
          }}
        >
          <Heading
            style={{
              fontSize: "26px",
              fontWeight: "400",
              color: "#f5f5f0",
              marginBottom: "8px",
              letterSpacing: "0.02em",
            }}
          >
            You're on the list.
          </Heading>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#a0a09a",
              marginTop: "24px",
            }}
          >
            Hi {firstName},
          </Text>
          <Text
            style={{ fontSize: "16px", lineHeight: "1.7", color: "#a0a09a" }}
          >
            Thanks for signing up for Still. We&apos;re building a mindfulness
            meditation app with AI-generated soundscapes personalized to your
            practice. You&apos;re on the early access list.
          </Text>
          <Text
            style={{ fontSize: "16px", lineHeight: "1.7", color: "#a0a09a" }}
          >
            We&apos;ll reach out when your spot is ready.
          </Text>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#f5f5f0",
              marginTop: "40px",
            }}
          >
            In the meantime, take a breath.
          </Text>

          <Text
            style={{ fontSize: "14px", lineHeight: "1.6", color: "#6b6b65" }}
          >
            — The Still team
          </Text>

          <Section
            style={{
              marginTop: "48px",
              borderTop: "1px solid #1e1e1e",
              paddingTop: "24px",
            }}
          >
            <Link
              href="https://stillmeditation.app"
              style={{
                color: "#6b6b65",
                fontSize: "12px",
                textDecoration: "none",
                letterSpacing: "0.05em",
              }}
            >
              stillmeditation.app
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
