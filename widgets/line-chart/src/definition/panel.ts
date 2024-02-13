import {
  type IPanelDescriptionCreator,
  type IGroupSettings,
  EControlType,
  EWidgetIndicatorType,
  EColorMode,
} from "@infomaximum/custom-widget";
import type { LegendPosition, WidgetSettings } from "definition/settings";

const legendPositionConfig = [
  {
    label: "Сверху",
    value: "top",
  },
  {
    label: "Cнизу",
    value: "bottom",
  },
  {
    label: "Слева",
    value: "left",
  },
  {
    label: "Справа",
    value: "right",
  },
] satisfies { label: string; value: LegendPosition }[];

export const createPanelDescription: IPanelDescriptionCreator<
  WidgetSettings,
  IGroupSettings
> = () => ({
  dataRecords: [
    {
      key: "header",
      accessor: "header",
      type: EControlType.input,
      props: { isBordered: false, placeholder: "Задайте заголовок" },
    },
    { type: "divider" },
  ],
  displayRecords: [
    {
      key: "headerSize",
      accessor: "headerSize",
      type: EControlType.inputNumber,
      title: "Размер заголовка",
      props: { min: 8 },
      shouldDisplay(settings) {
        return !!settings.header;
      },
    },
    { type: "divider" },
    {
      key: "legend",
      accessor: "legend",
      type: EControlType.switch,
      title: "Легенда",
    },
    {
      key: "legendPosition",
      accessor: "legendPosition",
      type: EControlType.select,
      title: "Положение легенды",
      shouldDisplay(settings) {
        return settings.legend;
      },
      props: {
        options: legendPositionConfig.map(({ label, value }) => ({
          label,
          value,
        })),
      },
    },
    { type: "divider" },
    {
      key: "limit",
      accessor: "limit",
      type: EControlType.inputNumber,
      title: "Лимит",
    },
    { type: "divider" },
    {
      key: "color",
      accessor: "color",
      type: EControlType.colorPicker,
      props: {
        modes: [EColorMode.BASE],
        defaultColor: "red",
      },
    },
    { type: "divider" },
  ],
  groupSetDescriptions: {
    dimensions: {
      accessor: "dimensions",
      title: "Разрез",
      maxCount: 1,
      addButtons: [
        {
          title: "Добавить",
          indicatorType: EWidgetIndicatorType.DIMENSION,
        },
      ],
    },

    measures: {
      accessor: "measures",
      title: "Мера",
      maxCount: 1,
      addButtons: [
        {
          title: "Добавить",
          indicatorType: EWidgetIndicatorType.MEASURE,
        },
      ],
    },
  },
});
