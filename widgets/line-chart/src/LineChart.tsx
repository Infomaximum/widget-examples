import { useMemo, type FC, useEffect, useState, memo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  mapMeasuresToInputs,
  type ICustomWidgetProps,
  mapDimensionsToInputs,
  replaceHierarchiesWithDimensions,
} from "@infomaximum/custom-widget";
import type { WidgetSettings } from "definition/settings";
import { hexToRGB } from "utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type LineChartProp = Parameters<typeof Line>[number];

type CalculatorData = {
  dimensionValues: string[];
  measureValues: string[];
};

interface ILineChartProps extends ICustomWidgetProps<WidgetSettings> {}

const LineChart: FC<ILineChartProps> = ({
  settings,
  calculatorFactory,
  filtration,
  placeholder,
  widgetsContext,
}) => {
  const { measures, dimensions, limit, legend, legendPosition, color } =
    settings;

  const filters = filtration.preparedFilterValues;

  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    dimensionValues: [],
    measureValues: [],
  });

  const calculator = useMemo(
    () => calculatorFactory.general(),
    [calculatorFactory]
  );

  useEffect(() => {
    placeholder.setDisplay(true);
  }, [placeholder]);

  useEffect(() => {
    if (!measures?.length || !dimensions?.length) {
      placeholder.setConfigured(false);
      return;
    }

    placeholder.setConfigured(true);

    const fetchData = async () => {
      const data = await calculator.calculate({
        filters,
        limit,
        measures: mapMeasuresToInputs(measures, widgetsContext.variables),
        dimensions: mapDimensionsToInputs(
          replaceHierarchiesWithDimensions(dimensions, filters),
          widgetsContext.variables
        ),
      });

      const dimensionValues = Array.from(data.dimensions.values()).at(0)
        ?.values;
      const measureValues = Array.from(data.measures.values()).at(0)?.values;

      if (dimensionValues && measureValues) {
        setCalculatorData({
          dimensionValues,
          measureValues,
        });
      }

      placeholder.setError(null);
    };

    fetchData().catch(placeholder.setError);
  }, [
    calculator,
    dimensions,
    filters,
    limit,
    measures,
    placeholder,
    placeholder.setError,
    widgetsContext.variables,
  ]);

  const options = useMemo(
    () =>
      ({
        responsive: true,
        plugins: {
          legend: {
            display: legend,
            position: legendPosition,
          },
          title: {
            display: false,
          },
        },
      }) satisfies LineChartProp["options"],
    [legend, legendPosition]
  );

  const data = useMemo(
    () =>
      ({
        labels: calculatorData.dimensionValues,
        datasets: [
          {
            label: measures.at(0)?.name ?? "",
            data: calculatorData.dimensionValues.map(
              (v, i) => calculatorData.measureValues[i]
            ),
            borderColor: color.value,
            backgroundColor: hexToRGB(color.value, 0.5),
          },
        ],
      }) satisfies LineChartProp["data"],
    [
      calculatorData.dimensionValues,
      calculatorData.measureValues,
      color.value,
      measures,
    ]
  );

  return (
    <div>
      <Line
        options={options}
        data={data}
        width={innerWidth}
        height={innerHeight}
      />
    </div>
  );
};

export default memo(LineChart);
