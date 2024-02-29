import {
  useMemo,
  type FC,
  useEffect,
  useState,
  memo,
  useCallback,
} from "react";
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
  ESimpleDataType,
  ECalculatorFilterMethods,
  getDimensionFormula,
} from "@infomaximum/widget-sdk";
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

  const { preparedFilterValues: filters, addFormulaFilter } = filtration;

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

  const handleAddFilter = useCallback(
    (index: number) => {
      const dimensionValue = calculatorData.dimensionValues.at(index);
      const dimension = dimensions.at(0);

      if (dimensionValue && dimension) {
        const dimensionWithoutHierarchies = replaceHierarchiesWithDimensions(
          [dimension],
          filters
        ).at(0);

        if (dimensionWithoutHierarchies) {
          addFormulaFilter({
            name: dimension.name,
            dataType: ESimpleDataType.STRING,
            filteringMethod: ECalculatorFilterMethods.INCLUDE,
            values: [dimensionValue],
            formula: getDimensionFormula(dimensionWithoutHierarchies),
          });
        }
      }
    },
    [addFormulaFilter, calculatorData.dimensionValues, dimensions, filters]
  );

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
        onClick(_, elements) {
          const element = elements.find(
            (el) => el.element instanceof PointElement
          );

          if (element) {
            handleAddFilter(element.index);
          }
        },
      }) satisfies LineChartProp["options"],
    [handleAddFilter, legend, legendPosition]
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
