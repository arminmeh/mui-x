import {
  unstable_useSeries,
  unstable_usePieSeries,
  unstable_useLineSeries,
  unstable_useBarSeries,
  unstable_useScatterSeries,
} from '@mui/x-charts/hooks';
import { unstable_useHeatmapSeries } from '@mui/x-charts-pro/hooks';

function useThings() {
  const series = unstable_useSeries();
  const pieSeries = unstable_usePieSeries();
  const lineSeries = unstable_useLineSeries();
  const barSeries = unstable_useBarSeries();
  const scatterSeries = unstable_useScatterSeries();
  const heatmapSeries = unstable_useHeatmapSeries();
}
