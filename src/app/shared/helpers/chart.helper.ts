
export const getFilteredXTicks = (series: any[], noOfResults: number, xProperty: string): string[] => {
  const xTicks = [];
  const delta = Math.floor(series.length / noOfResults);
  for (let i = 0; i <= series.length; i = i + delta) {
    if (series[i]) {
      xTicks.push(series[i][xProperty]);
    }
  }
  return xTicks;
};
