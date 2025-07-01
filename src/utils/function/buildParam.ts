export type ReportParamProps = {
  factory_slug: string;
  month: number;
  year: number;
  company_id: number;
};

export const buildReportParam = (
  url: string,
  { factory_slug, month, year, company_id }: ReportParamProps
) => {
  const i = new URLSearchParams();

  i.append("factory_slug", factory_slug);
  i.append("month", `${month}`);
  i.append("year", `${year}`);
  i.append("company_id", `${company_id}`);

  return `${url}?${i.toString()}`;
};