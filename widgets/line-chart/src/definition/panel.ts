import {
  type IPanelDescriptionCreator,
  type IGroupSettings,
  EControlType,
  EWidgetIndicatorType,
  EColorMode,
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
      key: "header",
      accessor: "header",
      type: EControlType.input,
      props: { isBordered: false, placeholder: SET_THE_HEADER[language] },
    },
    { type: "divider" },
  ],
  displayRecords: [
    {
      key: "headerSize",
      accessor: "headerSize",
      type: EControlType.inputNumber,
      title: HEADER_SIZE[language],
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
      title: LEGEND[language],
    },
    {
      key: "legendPosition",
      accessor: "legendPosition",
      type: EControlType.select,
      title: POSITION_LEGEND[language],
      shouldDisplay(settings) {
        return settings.legend;
      },
      props: {
        options: legendPositionConfig.map(({ label, value }) => ({
          label: label[language],
          value,
        })),
      },
    },
    { type: "divider" },
    {
      key: "limit",
      accessor: "limit",
      type: EControlType.inputNumber,
      title: LIMIT[language],
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
      title: DIMENSION[language],
      maxCount: 1,
      addButtons: [
        {
          title: ADD[language],
          indicatorType: EWidgetIndicatorType.DIMENSION,
        },
      ],
    },

    measures: {
      accessor: "measures",
      title: MEASURE[language],
      maxCount: 1,
      addButtons: [
        {
          title: ADD[language],
          indicatorType: EWidgetIndicatorType.MEASURE,
        },
      ],
    },
  },
});
