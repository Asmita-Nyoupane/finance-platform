import { TDateRange } from "@/components/Transactions/transaction-chart";


export const LIMIT = 10;
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', "#ef4444", "#f97316", "#84cc16", "#06b6d4", "#ec4899",];

export const DATE_RANGE: TDateRange = {
    '7D': { label: "Last 7 Days", days: 7 },
    '1M': { label: 'Last 1 Month', days: 30 },
    '3M': { label: 'Last 3 Months', days: 90 },
    '6M': { label: 'Last 6 Months', days: 180 },
    '1Y': { label: 'Last 1 Year', days: 365 },
    'ALL': { label: 'All Time', days: null }
}