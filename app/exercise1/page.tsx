import Range from "../components/Range/Range";
import { fetchData } from "../services/fetchData";

interface RangeConfig {
  min: number;
  max: number;
}

export default async function Exercise1() {
  const rangeConfig = await fetchData<RangeConfig>("/range-config");

  if (
    !rangeConfig ||
    typeof rangeConfig.min !== "number" ||
    typeof rangeConfig.max !== "number" ||
    rangeConfig.min >= rangeConfig.max
  ) {
    return <div>Invalid range configuration</div>;
  }

  return <Range max={rangeConfig.max} min={rangeConfig.min} />;
}
