import {
  BaseWidgetSettingsSchema,
  ColorBaseSchema,
  EColorMode,
  extendWithMeta,
  WidgetDimensionHierarchySchema,
  WidgetDimensionInHierarchySchema,
  WidgetDimensionSchema,
  WidgetMeasureSchema,
  type TSchemaType,
  type TZod,
} from "@infomaximum/widget-sdk";

const LEGEND_POSITIONS = ["top", "bottom", "left", "right"] as const;

export type LegendPosition = (typeof LEGEND_POSITIONS)[number];

export const WidgetSettingsSchema = (z: TZod) =>
  extendWithMeta(BaseWidgetSettingsSchema(z), {
    limit: z.number().default(15),
    dimensions: z
      .array(
        z.union([
          WidgetDimensionSchema(z),
          WidgetDimensionHierarchySchema(z, WidgetDimensionInHierarchySchema(z)),
        ])
      )
      .default([]),
    measures: z.array(WidgetMeasureSchema(z)).default([]),
    legend: z.boolean().default(false),
    legendPosition: z.enum(LEGEND_POSITIONS).default("top"),
    color: ColorBaseSchema(z).default({ mode: EColorMode.BASE, value: "#FF0000" }),
  });

export interface WidgetSettings extends TSchemaType<typeof WidgetSettingsSchema> {}
