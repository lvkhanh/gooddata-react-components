// (C) 2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import {
    isDataOfReasonableSize,
    isChartConfig,
    isGeoConfig,
    isClusteringAllowed,
    isLocationMissing,
    calculateAverage,
    getFormatFromExecutionResponse,
} from "../../geoChart/common";
import { IChartConfig } from "../../../interfaces/Config";
import { IGeoConfig, IGeoData } from "../../../interfaces/GeoChart";
import { COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM, SIZE_ITEM, TOOLTIP_TEXT_ITEM } from "./fixtures";
import { getExecutionResponse, getExecutionResult } from "../../../../stories/data/geoChart";
import { getGeoBucketsFromMdObject } from "../../geoChart/data";

describe("common", () => {
    describe("isDataOfReasonableSize", () => {
        it.each([[51, true], [49, false]])(
            "should return isDataOfReasonableSize is %s",
            (limit: number, expectedResult: boolean) => {
                const geoData: IGeoData = { location: { index: 0, name: "location", data: [] } };
                const executionResult = getExecutionResult(true);
                expect(isDataOfReasonableSize(executionResult, geoData, limit)).toEqual(expectedResult);
            },
        );
    });

    describe("isLocationMissing", () => {
        it("should return false if location is in buckets", () => {
            const buckets: VisualizationObject.IBucket[] = [
                LOCATION_ITEM,
                SEGMENT_BY_ITEM,
                TOOLTIP_TEXT_ITEM,
                SIZE_ITEM,
                COLOR_ITEM,
            ];
            expect(isLocationMissing(buckets)).toBe(false);
        });

        it("should return true if location is not in buckets", () => {
            const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM];
            expect(isLocationMissing(buckets)).toBe(true);
        });
    });

    describe("calculateAverage", () => {
        it("should return expected value", () => {
            const values: number[] = [1, 2, 3, 4, 5, 6];
            expect(calculateAverage(values)).toEqual(3.5);
        });
    });

    describe("getFormatFromExecutionResponse", () => {
        it("should return format of Size Measure ", () => {
            const executionResponse = getExecutionResponse(true, false, false, true, false);
            expect(getFormatFromExecutionResponse(executionResponse, 0)).toEqual("#,##0");
        });
    });

    describe("isClusteringAllowed", () => {
        it.each([
            [
                false,
                "size measure",
                {
                    location: { index: 0, name: "location" },
                    size: { index: 0, name: "size" },
                },
            ],
            [
                false,
                "color measure",
                {
                    location: { index: 0, name: "location" },
                    color: { index: 1, name: "color" },
                },
            ],
            [
                false,
                "segment attribute",
                {
                    location: { index: 0, name: "location" },
                    segment: { index: 1, name: "segment" },
                },
            ],
            [
                true,
                "tooltipText attribute",
                {
                    location: { index: 0, name: "location" },
                    tooltipText: { index: 1, name: "tooltipText" },
                },
            ],
            [
                true,
                "no others",
                {
                    location: { index: 0, name: "location" },
                },
            ],
        ])(
            "should return %s when %s is in bucket",
            (expectedValue: boolean, _description: string, geoData: IGeoData) => {
                expect(isClusteringAllowed(geoData)).toEqual(expectedValue);
            },
        );
    });

    describe("isChartConfig", () => {
        it.each([[false, { mapboxToken: "abc" }], [true, {}]])(
            "should return isChartConfig %s",
            (expectedValue: boolean, config: IChartConfig | IGeoConfig) => {
                expect(isChartConfig(config)).toEqual(expectedValue);
            },
        );
    });

    describe("isGeoConfig", () => {
        it.each([[false, {}], [true, { mapboxToken: "abc" }]])(
            "should return isGeoConfig %s",
            (expectedValue: boolean, config: IChartConfig | IGeoConfig) => {
                expect(isGeoConfig(config)).toEqual(expectedValue);
            },
        );
    });

    describe("getGeoBucketsFromMdObject", () => {
        const attributeGeo1 = {
            visualizationAttribute: {
                localIdentifier: "localIdentifier123",
                displayForm: {
                    uri: "/gdc/displayform/geo1",
                },
            },
        };
        const attributeGeo2 = {
            visualizationAttribute: {
                localIdentifier: "tooltipText",
                displayForm: {
                    uri: "/gdc/displayform/geo2",
                },
            },
        };

        it("should return buckets have tooltip text when geo pushpin has location item", () => {
            const mdObject = {
                visualizationClass: {
                    uri: "/gdc/visualizationclass/1",
                },
                buckets: [
                    {
                        localIdentifier: "location",
                        items: [attributeGeo1],
                    },
                ],
                properties: '{"controls":{"tooltipText":"/gdc/displayform/geo2"}}',
            };
            const buckets = getGeoBucketsFromMdObject(mdObject);
            expect(buckets).toEqual([
                {
                    localIdentifier: "location",
                    items: [attributeGeo1],
                },
                {
                    localIdentifier: "tooltipText",
                    items: [attributeGeo2],
                },
            ]);
        });

        it("should return buckets without tooltip text when geo pushpin does not have location item", () => {
            const mdObject = {
                visualizationClass: {
                    uri: "/gdc/visualizationclass/1",
                },
                buckets: [
                    {
                        localIdentifier: "size",
                        items: [attributeGeo1],
                    },
                ],
            };
            const buckets = getGeoBucketsFromMdObject(mdObject);
            expect(buckets).toEqual([
                {
                    localIdentifier: "size",
                    items: [attributeGeo1],
                },
            ]);
        });
    });
});
