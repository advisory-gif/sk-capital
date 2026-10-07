import { useId, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import "../portfolio.css";

const views = [
  { id: "overview", label: "Overview" },
  { id: "revenue", label: "Revenue" },
  { id: "pl", label: "P&L" },
  { id: "unit-economics", label: "Unit economics" },
  { id: "cashflow", label: "Cash flow" },
  { id: "scenarios", label: "Scenarios" },
] as const;

type View = (typeof views)[number]["id"];
type Metric = { label: string; value: string; note: string };
type TableRow = { label: string; values: string[]; emphasis?: boolean };
type Series = {
  label: string;
  values: number[];
  color: string;
  dashed?: boolean;
};

// Synthetic assumptions, in USD thousands unless explicitly stated otherwise.
// Derived values are shared by the cards, charts and source tables.
function financials(
  label: string,
  revenue: number,
  grossMargin: number,
  operatingExpenses: number,
) {
  const grossProfit = revenue * grossMargin;
  const costOfRevenue = revenue - grossProfit;
  const ebitda = grossProfit - operatingExpenses;
  return {
    label,
    revenue,
    grossMargin,
    operatingExpenses,
    grossProfit,
    costOfRevenue,
    ebitda,
    ebitdaMargin: ebitda / revenue,
  };
}

const plan = [
  { ...financials("FY2027", 10000, 0.8, 6100), customers: 1350 },
  { ...financials("FY2028", 11525, 0.814, 7081.35), customers: 1645 },
  { ...financials("FY2029", 16100, 0.825, 9082.5), customers: 1920 },
];
const base = plan[2];
const previous = plan[1];
const scenarios = [
  financials("Bear", 12800, 0.8, 8140),
  { ...base, label: "Base" },
  financials("Bull", 20500, 0.845, 10522.5),
];
const cash = {
  opening: 14700,
  operatingAdjustments: -400,
  capex: 1400,
  financing: 0,
};
const operatingCashFlow = base.ebitda + cash.operatingAdjustments;
const freeCashFlow = operatingCashFlow - cash.capex;
const closingCash = cash.opening + freeCashFlow + cash.financing;
const customerAcquisitionCost = 4200;
const monthlyCustomerChurn = 0.02;
const monthlyRevenuePerCustomer = (base.revenue * 1000) / base.customers / 12;
const monthlyGrossProfitPerCustomer =
  monthlyRevenuePerCustomer * base.grossMargin;
const lifetimeValue = monthlyGrossProfitPerCustomer / monthlyCustomerChurn;
const paybackMonths = customerAcquisitionCost / monthlyGrossProfitPerCustomer;

const number = (value: number, digits = 0) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
const money = (value: number) => `$${number(value / 1000, 1)}m`;
const dollars = (value: number) => `$${number(value)}`;
const percent = (value: number) => `${number(value * 100, 1)}%`;
const green = "#225d3d";
const sage = "#6e8e4c";
const growth = (base.revenue - previous.revenue) / previous.revenue;

function Metrics({ items }: { items: Metric[] }) {
  return (
    <dl className="finance-metrics">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            <span className="finance-metric-value">{item.value}</span>
            <span className="finance-metric-note">{item.note}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DataTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: TableRow[];
}) {
  const id = useId();
  return (
    <div className="finance-data">
      <p className="finance-scroll-note" id={id}>
        On a small screen, scroll this table sideways to see every column.
      </p>
      <div
        className="finance-table-scroll"
        role="region"
        aria-label={title}
        aria-describedby={id}
        tabIndex={0}
      >
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">Metric</th>
              {columns.map((column) => (
                <th scope="col" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className={row.emphasis ? "finance-total" : undefined}
              >
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Chart({
  title,
  unit,
  labels,
  series,
  maximum,
  ticks,
  bars = false,
}: {
  title: string;
  unit: string;
  labels: string[];
  series: Series[];
  maximum: number;
  ticks: number[];
  bars?: boolean;
}) {
  const id = useId();
  const left = 50;
  const right = 520;
  const top = 34;
  const bottom = 230;
  const y = (value: number) => bottom - (value / maximum) * (bottom - top);
  const x = (index: number) =>
    left + 70 + (index * (right - left - 140)) / Math.max(labels.length - 1, 1);
  return (
    <figure className="finance-chart">
      <figcaption id={`${id}-title`}>{title}</figcaption>
      <p className="finance-chart-unit">{unit} · illustrative model</p>
      <svg
        viewBox="0 0 550 278"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <desc id={`${id}-description`}>
          {series
            .map(
              (item) =>
                `${item.label}: ${labels.map((label, index) => `${label} ${number(item.values[index], 1)}`).join(", ")}`,
            )
            .join(". ")}
          . Units: {unit}. Exact source figures are in the table below.
        </desc>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              y1={y(tick)}
              x2={right}
              y2={y(tick)}
              className="finance-gridline"
            />
            <text x={left - 12} y={y(tick) + 4} textAnchor="end">
              {number(tick)}
            </text>
          </g>
        ))}
        {labels.map((label, index) => (
          <text key={label} x={x(index)} y={258} textAnchor="middle">
            {label}
          </text>
        ))}
        {series.map((item, seriesIndex) => (
          <g key={item.label}>
            {bars ? (
              item.values.map((value, index) => (
                <rect
                  key={index}
                  x={
                    x(index) + (seriesIndex - (series.length - 1) / 2) * 34 - 14
                  }
                  y={y(value)}
                  width={28}
                  height={bottom - y(value)}
                  fill={item.color}
                />
              ))
            ) : (
              <>
                <polyline
                  points={item.values
                    .map((value, index) => `${x(index)},${y(value)}`)
                    .join(" ")}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={3}
                  strokeDasharray={item.dashed ? "7 5" : undefined}
                />
                {item.values.map((value, index) => (
                  <circle
                    key={index}
                    cx={x(index)}
                    cy={y(value)}
                    r={4}
                    fill={item.color}
                  />
                ))}
              </>
            )}
          </g>
        ))}
      </svg>
      <ul className="finance-legend" aria-label="Chart legend">
        {series.map((item) => (
          <li key={item.label}>
            <span
              style={{ background: item.color }}
              className={item.dashed ? "is-dashed" : undefined}
              aria-hidden="true"
            />
            {item.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function CashChart() {
  const id = useId();
  const points = [
    {
      label: "Opening",
      low: 0,
      high: cash.opening,
      value: money(cash.opening),
      color: green,
    },
    {
      label: "Operating",
      low: cash.opening,
      high: cash.opening + operatingCashFlow,
      value: `+${money(operatingCashFlow)}`,
      color: sage,
    },
    {
      label: "CapEx",
      low: closingCash,
      high: cash.opening + operatingCashFlow,
      value: `−${money(cash.capex)}`,
      color: "#aa7b42",
    },
    {
      label: "Closing",
      low: 0,
      high: closingCash,
      value: money(closingCash),
      color: green,
    },
  ];
  const y = (value: number) => 230 - (value / 22000) * 196;
  return (
    <figure className="finance-chart">
      <figcaption id={`${id}-title`}>Where the cash moves</figcaption>
      <p className="finance-chart-unit">
        FY2029 · USD millions · illustrative model
      </p>
      <svg
        viewBox="0 0 550 278"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <desc id={`${id}-description`}>
          Opening cash of $14.7 million, plus operating cash flow of $3.8
          million, less capital expenditure of $1.4 million, equals closing cash
          of $17.1 million. No financing cash flow is assumed.
        </desc>
        {[0, 5, 10, 15, 20].map((tick) => (
          <g key={tick}>
            <line
              x1={50}
              y1={y(tick * 1000)}
              x2={520}
              y2={y(tick * 1000)}
              className="finance-gridline"
            />
            <text x={38} y={y(tick * 1000) + 4} textAnchor="end">
              {tick}
            </text>
          </g>
        ))}
        {points.map((point, index) => (
          <g key={point.label}>
            <rect
              x={76 + index * 118}
              y={y(point.high)}
              width={56}
              height={y(point.low) - y(point.high)}
              fill={point.color}
            />
            <text
              x={104 + index * 118}
              y={y(point.high) - 10}
              textAnchor="middle"
              className="finance-bar-value"
            >
              {point.value}
            </text>
            <text x={104 + index * 118} y={258} textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <ul className="finance-legend" aria-label="Chart legend">
        <li>
          <span style={{ background: green }} aria-hidden="true" />
          Cash balance
        </li>
        <li>
          <span style={{ background: sage }} aria-hidden="true" />
          Cash inflow
        </li>
        <li>
          <span style={{ background: "#aa7b42" }} aria-hidden="true" />
          Cash outflow
        </li>
      </ul>
    </figure>
  );
}

const headings: Record<View, { title: string; description: string }> = {
  overview: {
    title: "Growth, with the economics in view.",
    description:
      "A three-year plan brings revenue, profit and cash into the same conversation.",
  },
  revenue: {
    title: "Start with the revenue assumptions.",
    description:
      "Revenue is recognised annual revenue. It is not presented as ARR, bookings or an exit run rate.",
  },
  pl: {
    title: "Follow the path to profitability.",
    description:
      "Gross profit less operating expenses equals EBITDA. Every view uses the same underlying figures.",
  },
  "unit-economics": {
    title: "Understand what a customer is worth.",
    description:
      "A simplified steady-state calculation using FY2029 revenue per customer, gross margin and two explicit acquisition and churn assumptions.",
  },
  cashflow: {
    title: "Profit and cash tell different stories.",
    description:
      "A simplified annual cash bridge makes operating adjustments, investment and the closing balance visible.",
  },
  scenarios: {
    title: "See what changes when assumptions do.",
    description:
      "Three illustrative FY2029 cases show the combined effect of revenue, gross margin and operating expense assumptions.",
  },
};

const kpis: Record<View, Metric[]> = {
  overview: [
    {
      label: "FY2029 revenue",
      value: money(base.revenue),
      note: `${percent(growth)} growth vs FY2028`,
    },
    {
      label: "FY2029 EBITDA",
      value: money(base.ebitda),
      note: `${percent(base.ebitdaMargin)} EBITDA margin`,
    },
    {
      label: "Gross margin",
      value: percent(base.grossMargin),
      note: `${number((base.grossMargin - previous.grossMargin) * 100, 1)} percentage points vs FY2028`,
    },
    {
      label: "Closing cash",
      value: money(closingCash),
      note: `${money(freeCashFlow)} annual free cash flow`,
    },
  ],
  revenue: [
    {
      label: "FY2029 revenue",
      value: money(base.revenue),
      note: "Recognised annual revenue",
    },
    {
      label: "Annual growth",
      value: percent(growth),
      note: `${money(base.revenue - previous.revenue)} increase vs FY2028`,
    },
    {
      label: "Average active customers",
      value: number(base.customers),
      note: "FY2029 model assumption",
    },
    {
      label: "Annual revenue / customer",
      value: dollars((base.revenue * 1000) / base.customers),
      note: "Revenue ÷ average active customers",
    },
  ],
  pl: [
    {
      label: "Gross profit",
      value: money(base.grossProfit),
      note: "Revenue less cost of revenue",
    },
    {
      label: "Operating expenses",
      value: money(base.operatingExpenses),
      note: "Excludes depreciation & amortisation",
    },
    {
      label: "EBITDA",
      value: money(base.ebitda),
      note: "Gross profit less operating expenses",
    },
    {
      label: "EBITDA margin",
      value: percent(base.ebitdaMargin),
      note: "EBITDA ÷ revenue",
    },
  ],
  "unit-economics": [
    {
      label: "Acquisition cost (CAC)",
      value: dollars(customerAcquisitionCost),
      note: "Assumed per new customer",
    },
    {
      label: "Gross-profit lifetime value",
      value: dollars(lifetimeValue),
      note: "Simplified churn-based estimate",
    },
    {
      label: "LTV : CAC",
      value: `${number(lifetimeValue / customerAcquisitionCost, 1)}×`,
      note: "Gross-profit LTV ÷ assumed CAC",
    },
    {
      label: "CAC payback",
      value: `${number(paybackMonths, 1)} months`,
      note: "Before churn, using monthly gross profit",
    },
  ],
  cashflow: [
    {
      label: "Operating cash flow",
      value: money(operatingCashFlow),
      note: "EBITDA plus operating adjustments",
    },
    {
      label: "Capital expenditure",
      value: money(cash.capex),
      note: "Illustrative cash outflow",
    },
    {
      label: "Free cash flow",
      value: money(freeCashFlow),
      note: "Operating cash flow less CapEx",
    },
    {
      label: "Closing cash",
      value: money(closingCash),
      note: "Opening cash plus net cash movement",
    },
  ],
  scenarios: [
    {
      label: "Bear revenue",
      value: money(scenarios[0].revenue),
      note: `${percent(1 - scenarios[0].revenue / base.revenue)} below base`,
    },
    {
      label: "Base revenue",
      value: money(base.revenue),
      note: "The central model assumption",
    },
    {
      label: "Bull revenue",
      value: money(scenarios[2].revenue),
      note: `${percent(scenarios[2].revenue / base.revenue - 1)} above base`,
    },
    {
      label: "Base EBITDA",
      value: money(base.ebitda),
      note: `${money(scenarios[0].ebitda)}–${money(scenarios[2].ebitda)} across cases`,
    },
  ],
};

function ViewContent({ view }: { view: View }) {
  const years = plan.map((year) => year.label);
  const financialRows: TableRow[] = [
    { label: "Revenue", values: plan.map((year) => number(year.revenue, 2)) },
    {
      label: "Cost of revenue",
      values: plan.map((year) => number(year.costOfRevenue, 2)),
    },
    {
      label: "Gross profit",
      values: plan.map((year) => number(year.grossProfit, 2)),
      emphasis: true,
    },
    {
      label: "Gross margin",
      values: plan.map((year) => percent(year.grossMargin)),
    },
    {
      label: "Operating expenses",
      values: plan.map((year) => number(year.operatingExpenses, 2)),
    },
    {
      label: "EBITDA",
      values: plan.map((year) => number(year.ebitda, 2)),
      emphasis: true,
    },
    {
      label: "EBITDA margin",
      values: plan.map((year) => percent(year.ebitdaMargin)),
    },
  ];

  if (view === "unit-economics")
    return (
      <>
        <div className="finance-formulas">
          <article>
            <span>01 / Value</span>
            <h4>Gross-profit LTV</h4>
            <p>
              {dollars(monthlyGrossProfitPerCustomer)} monthly gross profit ÷{" "}
              {percent(monthlyCustomerChurn)} monthly customer churn
            </p>
            <strong>{dollars(lifetimeValue)}</strong>
          </article>
          <article>
            <span>02 / Efficiency</span>
            <h4>LTV : CAC</h4>
            <p>
              {dollars(lifetimeValue)} gross-profit lifetime value ÷{" "}
              {dollars(customerAcquisitionCost)} acquisition cost
            </p>
            <strong>
              {number(lifetimeValue / customerAcquisitionCost, 1)}×
            </strong>
          </article>
          <article>
            <span>03 / Recovery</span>
            <h4>CAC payback</h4>
            <p>
              {dollars(customerAcquisitionCost)} acquisition cost ÷{" "}
              {dollars(monthlyGrossProfitPerCustomer)} monthly gross profit
            </p>
            <strong>{number(paybackMonths, 1)} months</strong>
          </article>
        </div>
        <DataTable
          title="Unit-economics inputs and calculations · FY2029 · USD per customer"
          columns={["Value", "Basis"]}
          rows={[
            {
              label: "Monthly revenue / customer",
              values: [
                dollars(monthlyRevenuePerCustomer),
                "Annual revenue ÷ average customers ÷ 12",
              ],
            },
            {
              label: "Gross margin",
              values: [
                percent(base.grossMargin),
                "Shared FY2029 model assumption",
              ],
            },
            {
              label: "Monthly gross profit / customer",
              values: [
                dollars(monthlyGrossProfitPerCustomer),
                "Monthly revenue / customer × gross margin",
              ],
            },
            {
              label: "Customer acquisition cost",
              values: [
                dollars(customerAcquisitionCost),
                "Independent illustrative assumption",
              ],
            },
            {
              label: "Monthly customer churn",
              values: [
                percent(monthlyCustomerChurn),
                "Independent illustrative assumption",
              ],
            },
            {
              label: "Implied customer lifetime",
              values: [
                `${number(1 / monthlyCustomerChurn)} months`,
                "1 ÷ monthly customer churn",
              ],
            },
            {
              label: "Gross-profit lifetime value",
              values: [
                dollars(lifetimeValue),
                "Monthly gross profit / customer ÷ churn",
              ],
              emphasis: true,
            },
          ]}
        />
        <p className="finance-method">
          Calculations use unrounded values; displayed dollar amounts are
          rounded. This simplified LTV excludes expansion, discounting and
          cohort differences. Payback assumes stable monthly gross profit before
          churn. Acquisition cost is a standalone assumption, not a
          reconstruction of sales and marketing spend.
        </p>
      </>
    );

  if (view === "cashflow")
    return (
      <>
        <div className="finance-visual-grid">
          <CashChart />
          <aside className="finance-reading">
            <span className="finance-label">Read the model</span>
            <h4>Cash-positive in this annual case.</h4>
            <p>
              Free cash flow of {money(freeCashFlow)} adds to the assumed
              opening cash balance of {money(cash.opening)}.
            </p>
            <dl>
              <div>
                <dt>Monthly net burn</dt>
                <dd>None in the annual average</dd>
              </div>
              <div>
                <dt>Cash runway</dt>
                <dd>Not applicable</dd>
              </div>
            </dl>
            <p>
              A finite burn-based runway is not calculated while annual free
              cash flow is positive. This does not establish permanent
              self-sufficiency or rule out short-term cash needs.
            </p>
          </aside>
        </div>
        <DataTable
          title="Cash-flow reconciliation · FY2029 · USD thousands"
          columns={["Value", "Basis"]}
          rows={[
            {
              label: "Opening cash",
              values: [number(cash.opening, 2), "Opening balance assumption"],
            },
            {
              label: "EBITDA",
              values: [number(base.ebitda, 2), "From the P&L view"],
            },
            {
              label: "Operating adjustments",
              values: [
                number(cash.operatingAdjustments, 2),
                "Cash taxes, working capital and other adjustments; assumed net",
              ],
            },
            {
              label: "Operating cash flow",
              values: [
                number(operatingCashFlow, 2),
                "EBITDA + operating adjustments",
              ],
              emphasis: true,
            },
            {
              label: "Capital expenditure",
              values: [number(-cash.capex, 2), "Cash outflow assumption"],
            },
            {
              label: "Free cash flow",
              values: [
                number(freeCashFlow, 2),
                "Operating cash flow − capital expenditure",
              ],
              emphasis: true,
            },
            {
              label: "Financing cash flow",
              values: [
                number(cash.financing, 2),
                "No debt or equity cash movement assumed",
              ],
            },
            {
              label: "Closing cash",
              values: [
                number(closingCash, 2),
                "Opening cash + free cash flow + financing",
              ],
              emphasis: true,
            },
          ]}
        />
        <p className="finance-method">
          This is a simplified annual model, not a full statement of cash flows.
          A monthly forecast would be needed to assess payment timing and
          minimum cash headroom.
        </p>
      </>
    );

  if (view === "scenarios")
    return (
      <>
        <div className="finance-visual-grid">
          <Chart
            title="A range of possible outcomes"
            unit="USD millions"
            labels={scenarios.map((scenario) => scenario.label)}
            series={[
              {
                label: "Revenue",
                values: scenarios.map((scenario) => scenario.revenue / 1000),
                color: green,
              },
              {
                label: "EBITDA",
                values: scenarios.map((scenario) => scenario.ebitda / 1000),
                color: sage,
              },
            ]}
            maximum={25}
            ticks={[0, 5, 10, 15, 20, 25]}
            bars
          />
          <aside className="finance-reading">
            <span className="finance-label">Question to explore</span>
            <h4>Which costs can flex with growth?</h4>
            <p>
              These cases change revenue, gross margin and operating expenses
              together. They are alternative sets of assumptions, not a
              single-variable sensitivity test.
            </p>
            <p>
              All three happen to produce positive EBITDA. That is a property of
              these example inputs, not a promise of downside protection.
            </p>
          </aside>
        </div>
        <DataTable
          title="Scenario assumptions and outputs · FY2029 · USD thousands unless stated"
          columns={scenarios.map((scenario) => scenario.label)}
          rows={[
            {
              label: "Revenue",
              values: scenarios.map((scenario) => number(scenario.revenue, 2)),
            },
            {
              label: "Gross margin",
              values: scenarios.map((scenario) =>
                percent(scenario.grossMargin),
              ),
            },
            {
              label: "Gross profit",
              values: scenarios.map((scenario) =>
                number(scenario.grossProfit, 2),
              ),
            },
            {
              label: "Operating expenses",
              values: scenarios.map((scenario) =>
                number(scenario.operatingExpenses, 2),
              ),
            },
            {
              label: "EBITDA",
              values: scenarios.map((scenario) => number(scenario.ebitda, 2)),
              emphasis: true,
            },
            {
              label: "EBITDA margin",
              values: scenarios.map((scenario) =>
                percent(scenario.ebitdaMargin),
              ),
            },
          ]}
        />
        <p className="finance-method">
          No probability or likelihood is assigned to these cases. Cash flow is
          shown only for the base case in the cash-flow view.
        </p>
      </>
    );

  if (view === "revenue")
    return (
      <>
        <div className="finance-visual-grid">
          <Chart
            title="An illustrative revenue plan"
            unit="USD millions"
            labels={years}
            series={[
              {
                label: "Annual revenue",
                values: plan.map((year) => year.revenue / 1000),
                color: green,
              },
            ]}
            maximum={20}
            ticks={[0, 5, 10, 15, 20]}
            bars
          />
          <aside className="finance-reading">
            <span className="finance-label">Read the model</span>
            <h4>Growth needs a bottom-up explanation.</h4>
            <p>
              Revenue grows {percent(growth)} in FY2029 while assumed average
              active customers grow{" "}
              {percent(base.customers / previous.customers - 1)}.
            </p>
            <p>
              The implied increase in revenue per customer should be tested
              against pricing, product mix and customer cohorts. It is an
              assumption in this sample, not observed performance.
            </p>
          </aside>
        </div>
        <DataTable
          title="Revenue assumptions and derived metrics · USD unless stated"
          columns={years}
          rows={[
            {
              label: "Annual revenue (USD thousands)",
              values: plan.map((year) => number(year.revenue, 2)),
              emphasis: true,
            },
            {
              label: "Year-on-year revenue growth",
              values: plan.map((year, index) =>
                index === 0
                  ? "Not modelled"
                  : percent(year.revenue / plan[index - 1].revenue - 1),
              ),
            },
            {
              label: "Average active customers",
              values: plan.map((year) => number(year.customers)),
            },
            {
              label: "Annual revenue / customer",
              values: plan.map((year) =>
                dollars((year.revenue * 1000) / year.customers),
              ),
            },
            {
              label: "Monthly revenue / customer",
              values: plan.map((year) =>
                dollars((year.revenue * 1000) / year.customers / 12),
              ),
            },
          ]}
        />
        <p className="finance-method">
          Customer counts are annual averages, not period-end balances.
          Per-customer values are derived from those averages. This model does
          not separately forecast new sales, expansion, retention or churn
          within the aggregate revenue plan.
        </p>
      </>
    );

  return (
    <>
      <div className="finance-visual-grid">
        {view === "pl" ? (
          <Chart
            title="Profitability through the plan"
            unit="Percent of revenue"
            labels={years}
            series={[
              {
                label: "Gross margin",
                values: plan.map((year) => year.grossMargin * 100),
                color: green,
              },
              {
                label: "EBITDA margin",
                values: plan.map((year) => year.ebitdaMargin * 100),
                color: sage,
                dashed: true,
              },
            ]}
            maximum={100}
            ticks={[0, 25, 50, 75, 100]}
          />
        ) : (
          <Chart
            title="Revenue and EBITDA, together"
            unit="USD millions"
            labels={years}
            series={[
              {
                label: "Revenue",
                values: plan.map((year) => year.revenue / 1000),
                color: green,
              },
              {
                label: "EBITDA",
                values: plan.map((year) => year.ebitda / 1000),
                color: sage,
                dashed: true,
              },
            ]}
            maximum={20}
            ticks={[0, 5, 10, 15, 20]}
          />
        )}
        <aside className="finance-reading">
          <span className="finance-label">
            {view === "pl"
              ? "Check the relationship"
              : "The decision behind the numbers"}
          </span>
          <h4>
            {view === "pl"
              ? "Profitability depends on cost discipline."
              : "Can growth fund the next stage?"}
          </h4>
          <p>
            {view === "pl"
              ? `FY2029 gross profit of ${money(base.grossProfit)} less operating expenses of ${money(base.operatingExpenses)} gives ${money(base.ebitda)} of EBITDA.`
              : `In this fictional base case, ${money(base.revenue)} of FY2029 revenue produces ${money(base.ebitda)} of EBITDA and ${money(freeCashFlow)} of free cash flow.`}
          </p>
          <p>
            {view === "pl"
              ? "EBITDA excludes interest, tax, depreciation and amortisation. It is not net income or cash flow. The table preserves two decimal places so the calculation can be checked."
              : "Explore the revenue drivers, cost structure and cash bridge, then compare the bear and bull assumptions before drawing a conclusion."}
          </p>
          <span className="finance-reading-footer">
            Illustrative analysis · no client data
          </span>
        </aside>
      </div>
      <DataTable
        title="Three-year financial model · USD thousands unless stated"
        columns={years}
        rows={financialRows}
      />
      <p className="finance-method">
        All three years are synthetic planning assumptions. Cost of revenue =
        revenue × (1 − gross margin). Gross profit = revenue − cost of revenue.
        EBITDA = gross profit − operating expenses. Cards and charts are
        rounded; calculations use the underlying values.
      </p>
    </>
  );
}

export default function Portfolio() {
  const [activeView, setActiveView] = useState<View>("overview");
  const heading = headings[activeView];
  return (
    <div className="health finance-page">
      <div className="wrap">
        <header className="finance-intro">
          <div>
            <p className="eyebrow">Illustrative startup model</p>
            <h1>
              A clearer view
              <br />
              of the numbers.
            </h1>
          </div>
          <div>
            <p>
              Explore how revenue, profitability, customer economics and cash
              connect in a fictional B2B software business.
            </p>
            <Link to="/business-health-review#sample" className="text-link">
              Looking for the pilot review sample?{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </header>
        <div className="finance-disclaimer">
          <Info size={18} aria-hidden="true" />
          <p>
            <strong>Fictional company. Illustrative figures.</strong> CloudHR is
            a made-up HR software business. This is a broader startup
            finance-model example, not a client result or the deliverable
            included in the Revenue Leak Check pilot.
          </p>
        </div>
        <section
          className="finance-dashboard"
          aria-labelledby="finance-dashboard-title"
        >
          <div className="finance-dashboard-header">
            <div>
              <span className="finance-label">CloudHR / B2B SaaS</span>
              <h2 id="finance-dashboard-title">The financial picture.</h2>
            </div>
            <p>
              FY2027–FY2029
              <br />
              <span>All periods modelled · USD</span>
            </p>
          </div>
          <div
            className="finance-view-controls"
            role="group"
            aria-label="Choose a dashboard view"
          >
            {views.map((view, index) => (
              <button
                key={view.id}
                type="button"
                aria-pressed={activeView === view.id}
                aria-controls="finance-view"
                onClick={() => setActiveView(view.id)}
              >
                <span aria-hidden="true">0{index + 1}</span>
                {view.label}
              </button>
            ))}
          </div>
          <p className="sr-only" role="status">
            {views.find((view) => view.id === activeView)?.label} view selected.
          </p>
          <div
            className="finance-panel"
            id="finance-view"
            aria-labelledby="finance-view-title"
          >
            <div className="finance-view-heading">
              <h3 id="finance-view-title">{heading.title}</h3>
              <p>{heading.description}</p>
            </div>
            <Metrics items={kpis[activeView]} />
            <ViewContent view={activeView} />
          </div>
        </section>
        <section className="finance-next" aria-labelledby="finance-next-title">
          <div>
            <p className="eyebrow">Bring it back to your business</p>
            <h2 id="finance-next-title">
              What would you want
              <br />
              your numbers to tell you?
            </h2>
            <p>
              The Revenue Leak Check pilot covers one entity and up to 10 clean
              selected jobs, projects or service engagements, with three
              evidence-based priorities. Startup modelling and ongoing finance
              support require a separate scope.
            </p>
          </div>
          <div className="finance-next-actions">
            <Link
              className="primary"
              to="/business-health-review?audience=startup#enquiry"
            >
              Review startup enquiry details{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="text-link" to="/business-health-review#sample">
              See the pilot review sample{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
