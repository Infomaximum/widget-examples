import {
  type IPanelDescriptionCreator,
  type IGroupSettings,
  EControlType,
  EWidgetIndicatorType,
  EColorMode,
  getLocalizedText,
} from "@infomaximum/widget-sdk";
import type { LegendPosition, WidgetSettings } from "definition/settings";
import {
  ABOVE,
  ADD,
  BELOW,
  DIMENSION,
  FROM_LEFT,
  FROM_RIGHT,
  HEADER_SIZE,
  LEGEND,
  LIMIT,
  MEASURE,
  POSITION_LEGEND,
  SET_THE_HEADER,
} from "localization";

const legendPositionConfig = [
  {
    label: ABOVE,
    value: "top",
  },
  {
    label: BELOW,
    value: "bottom",
  },
  {
    label: FROM_LEFT,
    value: "left",
  },
  {
    label: FROM_RIGHT,
    value: "right",
  },
] satisfies { label: { ru: string; en: string }; value: LegendPosition }[];

export const createPanelDescription: IPanelDescriptionCreator<
  WidgetSettings,
  IGroupSettings
> = ({ language }) => ({
  dataRecords: [
    {
      key: "title",
      accessor: "title",
      type: EControlType.input,
      props: {
        isBordered: false,
        placeholder: getLocalizedText(language, SET_THE_HEADER),
      },
    },
    { type: "divider" },
  ],
  displayRecords: [
    {
      key: "titleSize",
      accessor: "titleSize",
      type: EControlType.inputNumber,
      title: getLocalizedText(language, HEADER_SIZE),

      props: { min: 8 },
      shouldDisplay(settings) {
        return !!settings.title;
      },
    },
    { type: "divider" },
    {
      key: "legend",
      accessor: "legend",
      type: EControlType.switch,
      title: getLocalizedText(language, LEGEND),
    },
    {
      key: "legendPosition",
      accessor: "legendPosition",
      type: EControlType.select,
      title: getLocalizedText(language, POSITION_LEGEND),
      shouldDisplay(settings) {
        return settings.legend;
      },
      props: {
        options: legendPositionConfig.map(({ label, value }) => ({
          label: getLocalizedText(language, label),
          value,
        })),
      },
    },
    { type: "divider" },
    {
      key: "limit",
      accessor: "limit",
      type: EControlType.inputNumber,
      title: getLocalizedText(language, LIMIT),
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
      getType: () => EWidgetIndicatorType.DIMENSION,
      title: getLocalizedText(language, DIMENSION),
      maxCount: 1,
      addButtons: [
        {
          title: getLocalizedText(language, ADD),
          indicatorType: EWidgetIndicatorType.DIMENSION,
        },
      ],
    },

    measures: {
      accessor: "measures",
      getType: () => EWidgetIndicatorType.MEASURE,
      title: getLocalizedText(language, MEASURE),
      maxCount: 1,
      addButtons: [
        {
          title: getLocalizedText(language, ADD),
          indicatorType: EWidgetIndicatorType.MEASURE,
        },
      ],
    },
  },
});
