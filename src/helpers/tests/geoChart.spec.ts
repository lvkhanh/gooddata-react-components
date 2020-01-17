// (C) 2019-2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";
import { COLOR, LOCATION, SEGMENT_BY, SIZE, TOOLTIP_TEXT } from "../../constants/bucketNames";
import { getGeoAttributeHeaderItems, getGeoDataIndex, isDataOfReasonableSize } from "../geoChart";
import { IGeoDataIndex } from "../../interfaces/GeoChart";
import { getExecutionResult } from "../../../stories/data/geoChart";

describe("geoChart", () => {
    const LOCATION_ITEM: VisualizationObject.IBucket = {
        localIdentifier: LOCATION,
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: "a_location",
                    displayForm: {
                        uri: "/gdc/md/projectId/obj/1",
                    },
                },
            },
        ],
    };

    const SEGMENT_BY_ITEM: VisualizationObject.IBucket = {
        localIdentifier: SEGMENT_BY,
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: "a_segmentBy",
                    displayForm: {
                        uri: "/gdc/md/projectId/obj/2",
                    },
                },
            },
        ],
    };

    const TOOLTIP_TEXT_ITEM: VisualizationObject.IBucket = {
        localIdentifier: TOOLTIP_TEXT,
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: "a_tooltipText",
                    displayForm: {
                        uri: "/gdc/md/projectId/obj/3",
                    },
                },
            },
        ],
    };

    const SIZE_ITEM: VisualizationObject.IBucket = {
        localIdentifier: SIZE,
        items: [
            {
                measure: {
                    localIdentifier: "m_size",
                    definition: {
                        measureDefinition: {
                            item: { uri: "/gdc/md/projectId/obj/4" },
                        },
                    },
                },
            },
        ],
    };

    const COLOR_ITEM: VisualizationObject.IBucket = {
        localIdentifier: COLOR,
        items: [
            {
                measure: {
                    localIdentifier: "m_color",
                    definition: {
                        measureDefinition: {
                            item: { uri: "/gdc/md/projectId/obj/5" },
                        },
                    },
                },
            },
        ],
    };

    it("should return geoDataIndex with full bucket", () => {
        const buckets: VisualizationObject.IBucket[] = [
            LOCATION_ITEM,
            SEGMENT_BY_ITEM,
            TOOLTIP_TEXT_ITEM,
            SIZE_ITEM,
            COLOR_ITEM,
        ];

        expect(getGeoDataIndex(buckets)).toEqual({
            location: 0,
            segmentBy: 1,
            tooltipText: 2,
            size: 0,
            color: 1,
        });
    });

    it("should return geoDataIndex with location, tooltipText, size", () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, TOOLTIP_TEXT_ITEM, SIZE_ITEM];

        expect(getGeoDataIndex(buckets)).toEqual({
            location: 0,
            tooltipText: 1,
            size: 0,
        });
    });

    it("should return geoDataIndex with segmentBy, color", () => {
        const buckets: VisualizationObject.IBucket[] = [SEGMENT_BY_ITEM, COLOR_ITEM];

        expect(getGeoDataIndex(buckets)).toEqual({
            segmentBy: 0,
            color: 0,
        });
    });

    describe("getGeoAttributeHeaderItems", () => {
        it("should return attributeHeaderItems without color and size", () => {
            const geoDataIndex: IGeoDataIndex = {};
            const attributeHeaderItems: Execution.IResultHeaderItem[][] = getGeoAttributeHeaderItems(
                getExecutionResult(),
                geoDataIndex,
            );
            expect(attributeHeaderItems).toEqual([]);
        });

        it("should return attributeHeaderItems with color and size", () => {
            const geoDataIndex: IGeoDataIndex = {
                color: 0,
                location: 0,
                segmentBy: 1,
                size: 1,
                tooltipText: 2,
            };
            const attributeHeaderItems: Execution.IResultHeaderItem[][] = getGeoAttributeHeaderItems(
                getExecutionResult(true, true, true, true, true),
                geoDataIndex,
            );
            expect(attributeHeaderItems[geoDataIndex.location][0]).toEqual({
                attributeHeaderItem: {
                    name: "44.500000;-89.500000",
                    uri: "/gdc/md/projectId/obj/694/elements?id=1808",
                },
            });
        });
    });

    describe("isDataOfReasonableSize", () => {
        it.each([[false, 100], [true, 30]])(
            "should isDataOfReasonableSize return %s",
            (expectedValue: boolean, limit: number) => {
                const geoDataIndex: IGeoDataIndex = { location: 0 };
                const isDataTooLarge: boolean = isDataOfReasonableSize(
                    getExecutionResult(true),
                    geoDataIndex,
                    limit,
                );
                expect(isDataTooLarge).toEqual(expectedValue);
            },
        );
    });
});
