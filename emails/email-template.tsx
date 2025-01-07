import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";
type TProps = {
    userName: string,
    type: string,
    data: {
        budgetAmount: number,
        percentageUsed: number,
        totalExpense: number
    }
}

export default function Emailtemplate({
    userName,
    type = "budget-alert",
    data
}: TProps) {
    if (type === 'monthly-report') {
        return (
            <Html>
                <Button
                    href="https://example.com"
                    style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
                >
                    Click me
                </Button>
            </Html>
        );
    }

    if (type === 'budget-alert') {
        return (
            <Html>
                <Head />
                <Preview>Budget Alert</Preview>
                <Body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5', padding: '20px' }}>
                    <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                        <Heading style={{ fontSize: '24px', color: '#333' }}>
                            Budget Alert
                        </Heading>

                        <Text style={{ fontSize: '16px', color: '#555' }}>
                            Hello {userName},
                        </Text>

                        <Text style={{ fontSize: '16px', color: '#555' }}>
                            You’ve used <strong>{data?.percentageUsed.toFixed(1)}%</strong> of your monthly budget.
                        </Text>

                        <Section style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <Text style={{ fontWeight: 'bold' }}>Budget Amount:</Text>
                                <Text>${data?.budgetAmount}</Text>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Text style={{ fontWeight: 'bold' }}>Spent So Far:</Text>
                                <Text>${data?.totalExpense}</Text>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Text style={{ fontWeight: 'bold' }}>Remaining:</Text>
                                <Text>${(data?.budgetAmount - data?.totalExpense).toFixed(2)}</Text>
                            </div>
                        </Section>

                        <Text style={{ marginTop: '20px', fontSize: '16px', color: '#555' }}>
                            Remember to keep track of your expenses to stay within your budget!
                        </Text>

                        <Button
                            href="https://example.com/manage-budget"
                            style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                padding: "12px 20px",
                                textDecoration: "none",
                                borderRadius: "5px",
                                display: "inline-block",
                                marginTop: "20px"
                            }}
                        >
                            View Your Budget
                        </Button>
                    </Container>
                </Body>
            </Html>
        );
    }
}
