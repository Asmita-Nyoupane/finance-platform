
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";
type TProps = | {
    userName: string;
    type: "monthly-report";
    data: TMonthlyReport;
}
    | {
        userName: string;
        type: "budget-alert";
        data: TBudget;
    };
type TBudget = {
    budgetAmount: number,
    percentageUsed: number,
    totalExpense: number,
}
export type TStats = {
    totalExpenses: number,
    totalIncome: number,
    byCategory: { [key: string]: number },
    transactionCount: number
}
type TMonthlyReport = {
    stats: TStats,
    month: string,
    insights: string[]
}
export default function Emailtemplate({
    userName,
    type,
    data
}: TProps) {
    if (type === 'monthly-report') {
        const reportData = data = {
        } as TMonthlyReport;

        return (
            <Html>
                <Head />
                <Preview>Your Monthly Financial Report</Preview>
                <Body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5', padding: '20px', backgroundColor: '#f4f4f4' }}>
                    <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>
                        <Heading style={{ fontSize: '24px', color: '#333' }}>
                            Monthly Financial Report for {reportData?.month || "This Month"}
                        </Heading>

                        <Text style={{ fontSize: '16px', color: '#555' }}>
                            Hello {userName},
                        </Text>

                        <Text style={{ fontSize: '16px', color: '#555' }}>
                            Here&rsquo;s a summary of your financial performance for the month of {reportData.month || "This Month"}:
                        </Text>

                        <Section style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <Text style={{ fontWeight: 'bold' }}>Total Income:</Text>
                                <Text>${reportData?.stats?.totalIncome ? reportData.stats.totalIncome.toFixed(2) : "N/A"}</Text>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Text style={{ fontWeight: 'bold' }}>Total Expenses:</Text>
                                <Text>${reportData?.stats?.totalExpenses ? reportData.stats.totalExpenses.toFixed(2) : "N/A"}</Text>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Text style={{ fontWeight: 'bold' }}>Savings:</Text>
                                <Text>${reportData?.stats?.totalIncome && reportData?.stats?.totalExpenses ? (reportData.stats.totalIncome - reportData.stats.totalExpenses).toFixed(2) : "N/A"}</Text>
                            </div>
                        </Section>

                        <Section style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                            <Heading>Expenses by Category</Heading>
                            {Object.entries(data.stats.byCategory).map(([category, amount]) => (
                                <div key={category} style={{ marginBottom: '10px' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{category}:</Text>
                                    <Text>${amount.toFixed(2)}</Text>
                                </div>
                            ))}
                            {data.insights && data.insights.length > 0 && (
                                <Section style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                                    <Text style={{ marginTop: '20px', fontSize: '16px', color: '#555' }}>
                                        Insights:
                                    </Text>
                                    <ul style={{ marginLeft: '20px', color: '#555' }}>
                                        {data.insights.map((insight, index) => (
                                            <li key={index}>{insight}</li>
                                        ))}
                                    </ul>
                                </Section>
                            )}


                        </Section>

                        <Button
                            href="https://example.com/view-report"
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
                            View Detailed Report
                        </Button>
                    </Container>
                </Body>
            </Html>
        );
    }

    if (type === 'budget-alert') {
        const budgetData = data as TBudget;

        return (
            <Html>
                <Head />
                <Preview>Budget Alert</Preview>
                <Body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5', padding: '20px', backgroundColor: '#f4f4f4' }}>
                    <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>
                        <Heading style={{ fontSize: '24px', color: '#333' }}>
                            Budget Alert
                        </Heading>

                        <Text style={{ fontSize: '16px', color: '#555' }}>
                            Hello {userName},
                        </Text>

                        <Text style={{ fontSize: '16px', color: '#555' }}>
                            You&rsquo;ve used <strong>{budgetData?.percentageUsed ? budgetData.percentageUsed.toFixed(1) : "N/A"}%</strong> of your monthly budget.
                        </Text>

                        <Section style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                            {budgetData.budgetAmount !== undefined && (
                                <>
                                    <div style={{ marginBottom: '10px' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Budget Amount:</Text>
                                        <Text>${budgetData.budgetAmount.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Spent So Far:</Text>
                                        <Text>${budgetData.totalExpense.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Remaining:</Text>
                                        <Text>${(budgetData.budgetAmount - budgetData.totalExpense).toFixed(2)}</Text>
                                    </div>
                                </>
                            )}
                        </Section>

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

    return null;
}
