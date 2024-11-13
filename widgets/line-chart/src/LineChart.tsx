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
  mapFormulaFiltersToInputs,
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
  dimensionValues: (string | null)[];
  measureValues: (string | null)[];
};

interface ILineChartProps extends ICustomWidgetProps<WidgetSettings> {}

const LineChart: FC<ILineChartProps> = ({
  settings,
  calculatorFactory,
  filtration,
  placeholder,
  globalContext,
  widgetContainer,
}) => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    dimensionValues: [],
    measureValues: [],
  });

  const calculator = useMemo(
    () => calculatorFactory.general(),
    [calculatorFactory]
  );

  useEffect(() => {
    // Если высота виджета не ограничена пользователем (высота "Авто")
    if (!widgetContainer.isMaxHeightLimited) {
      // Установка "автоматической" минимальной высоты рабочей области
      widgetContainer.setContentMinHeight(500);
    }
  }, [widgetContainer]);

  useEffect(() => {
    // Если виджет не сконфигурирован
    if (!settings.measures.length || !settings.dimensions.length) {
      // Сообщаем системе о том, что виджет не сконфигурирован
      placeholder.setConfigured(false);
      // Сообщаем системе о готовности виджета к отображению в видимом состоянии
      placeholder.setDisplay(true);
      // Очищаем предыдущую ошибку (при ее наличии)
      placeholder.setError(null);

      return;
    }

    const fetchData = async () => {
      // Игнорируем внешние фильтры, если пользователь включил данную настройку
      const externalFilters = settings.ignoreFilters
        ? []
        : filtration.preparedFilterValues;

      const data = await calculator.calculate({
        // Объединяем внешние и внутренние фильтры
        filters: [
          ...externalFilters,
          ...mapFormulaFiltersToInputs(settings.filters || []),
        ],
        limit: settings.limit,
        // Подготавливаем меры для передачи в вычислитель
        measures: mapMeasuresToInputs(
          settings.measures,
          globalContext.variables
        ),
        // Подготавливаем разрезы для передачи в вычислитель
        dimensions: mapDimensionsToInputs(
          // Выбираем активный разрез из "Иерархии"
          replaceHierarchiesWithDimensions(
            settings.dimensions,
            externalFilters
          ),
          globalContext.variables
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

      // Данные успешно получены

      // Сообщаем системе о том, что виджет сконфигурирован
      placeholder.setConfigured(true);
      // Сообщаем системе о готовности виджета к отображению в видимом состоянии
      // (если нужно вычисляемое условие отображения, вместо true передавать data.isDisplay)
      placeholder.setDisplay(true);
      // Очищаем предыдущую ошибку (при ее наличии)
      placeholder.setError(null);
    };

    fetchData()
      // В случае ошибки сообщаем об этом системе
      .catch(placeholder.setError);
  }, [
    calculator,
    placeholder,
    placeholder.setError,
    globalContext.variables,
    filtration.preparedFilterValues,
    settings.measures,
    settings.dimensions,
    settings.filters,
    settings.limit,
    settings.ignoreFilters,
  ]);

  const options = useMemo(
    () =>
      ({
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: settings.legend,
            position: settings.legendPosition,
          },
          title: {
            display: !!settings.title,
            text: settings.title ?? "",
            font() {
              return {
                size: settings.titleSize,
              };
            },
          },
        },
      }) satisfies LineChartProp["options"],
    [
      settings.legend,
      settings.legendPosition,
      settings.title,
      settings.titleSize,
    ]
  );

  const data = useMemo(
    () =>
      ({
        labels: calculatorData.dimensionValues,
        datasets: [
          {
            label: settings.measures.at(0)?.name ?? "",
            data: calculatorData.dimensionValues.map(
              (v, i) => calculatorData.measureValues[i]
            ),
            borderColor: settings.color.value,
            backgroundColor: hexToRGB(settings.color.value, 0.5),
          },
        ],
      }) satisfies LineChartProp["data"],
    [
      calculatorData.dimensionValues,
      calculatorData.measureValues,
      settings.color.value,
      settings.measures,
    ]
  );

  return <Line options={options} data={data} />;
};

export default memo(LineChart);
