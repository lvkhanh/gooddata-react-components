// (C) 2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";
import { COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM, SIZE_ITEM, TOOLTIP_TEXT_ITEM } from "./fixtures";
import { getExecutionResponse, getExecutionResult } from "../../../../stories/data/geoChart";
import { getGeoData, isDefaultZoom, isDefaultCenter, getCenterNumberToFixed } from "../../geoChart/data";

describe("geoChartData", () => {
    it("should return geoData with empty bucket", () => {
        const buckets: VisualizationObject.IBucket[] = [];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(),
            executionResult: getExecutionResult(),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({});
    });

    it("should return geoData with full bucket", () => {
        const buckets: VisualizationObject.IBucket[] = [
            LOCATION_ITEM,
            SEGMENT_BY_ITEM,
            TOOLTIP_TEXT_ITEM,
            SIZE_ITEM,
            COLOR_ITEM,
        ];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, true, true, true, true),
            executionResult: getExecutionResult(true, true, true, true, true),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            color: {
                data: [
                    528,
                    6832,
                    3294,
                    8340,
                    957,
                    116,
                    253,
                    1047,
                    7520,
                    22220,
                    18,
                    2282,
                    5602,
                    150,
                    1242,
                    1782,
                    335,
                    2299,
                    596,
                    12064,
                    869,
                    433,
                    1605,
                    1121,
                    570,
                    11107,
                    45703,
                    8732,
                    2627,
                    1381,
                    11564,
                    2288,
                    3500,
                    3310,
                    5302,
                    3836,
                    1938,
                    1560,
                    1766,
                    3949,
                    772,
                    709,
                    3060,
                    838,
                    2844,
                    1719,
                    4726,
                    179,
                    943,
                    1005,
                ],
                format: "#,##0",
                index: 1,
                name: "Area",
            },
            location: {
                data: [
                    "44.500000;-89.500000",
                    "39.000000;-80.500000",
                    "44.000000;-72.699997",
                    "31.000000;-100.000000",
                    "44.500000;-100.000000",
                    "41.700001;-71.500000",
                    "44.000000;-120.500000",
                    "43.000000;-75.000000",
                    "44.000000;-71.500000",
                    "41.500000;-100.000000",
                    "38.500000;-98.000000",
                    "33.000000;-90.000000",
                    "40.000000;-89.000000",
                    "39.000000;-75.500000",
                    "41.599998;-72.699997",
                    "34.799999;-92.199997",
                    "40.273502;-86.126976",
                    "38.573936;-92.603760",
                    "27.994402;-81.760254",
                    "39.876019;-117.224121",
                    "45.367584;-68.972168",
                    "44.182205;-84.506836",
                    "33.247875;-83.441162",
                    "20.716179;-158.214676",
                    "66.160507;-153.369141",
                    "35.860119;-86.660156",
                    "37.926868;-78.024902",
                    "39.833851;-74.871826",
                    "37.839333;-84.270020",
                    "47.650589;-100.437012",
                    "46.392410;-94.636230",
                    "36.084621;-96.921387",
                    "46.965260;-109.533691",
                    "47.751076;-120.740135",
                    "39.419220;-111.950684",
                    "39.113014;-105.358887",
                    "40.367474;-82.996216",
                    "32.318230;-86.902298",
                    "42.032974;-93.581543",
                    "34.307144;-106.018066",
                    "33.836082;-81.163727",
                    "41.203323;-77.194527",
                    "34.048927;-111.093735",
                    "39.045753;-76.641273",
                    "42.407211;-71.382439",
                    "36.778259;-119.417931",
                    "44.068203;-114.742043",
                    "43.075970;-107.290283",
                    "35.782169;-80.793457",
                    "30.391830;-92.329102",
                ],
                index: 0,
                name: "State",
            },
            segment: {
                data: [
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                ],
                index: 1,
                name: "Type",
            },
            size: {
                data: [
                    1005,
                    943,
                    179,
                    4726,
                    1719,
                    2844,
                    838,
                    3060,
                    709,
                    772,
                    3949,
                    1766,
                    1560,
                    1938,
                    3836,
                    5302,
                    3310,
                    3500,
                    2288,
                    11564,
                    1381,
                    2627,
                    8732,
                    45703,
                    11107,
                    570,
                    1121,
                    1605,
                    433,
                    869,
                    12064,
                    596,
                    2299,
                    335,
                    1782,
                    1242,
                    150,
                    5602,
                    2282,
                    18,
                    22220,
                    7520,
                    1047,
                    253,
                    116,
                    957,
                    8340,
                    3294,
                    6832,
                    528,
                ],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
            tooltipText: {
                data: [
                    "Wisconsin",
                    "West Virginia",
                    "Vermont",
                    "Texas",
                    "South Dakota",
                    "Rhode Island",
                    "Oregon",
                    "New York",
                    "New Hampshire",
                    "Nebraska",
                    "Kansas",
                    "Mississippi",
                    "Illinois",
                    "Delaware",
                    "Connecticut",
                    "Arkansas",
                    "Indiana",
                    "Missouri",
                    "Florida",
                    "Nevada",
                    "Maine",
                    "Michigan",
                    "Georgia",
                    "Hawaii",
                    "Alaska",
                    "Tennessee",
                    "Virginia",
                    "New Jersey",
                    "Kentucky",
                    "North Dakota",
                    "Minnesota",
                    "Oklahoma",
                    "Montana",
                    "Washington",
                    "Utah",
                    "Colorado",
                    "Ohio",
                    "Alabama",
                    "Iowa",
                    "New Mexico",
                    "South Carolina",
                    "Pennsylvania",
                    "Arizona",
                    "Maryland",
                    "Massachusetts",
                    "California",
                    "Idaho",
                    "Wyoming",
                    "North Carolina",
                    "Louisiana",
                ],
                index: 2,
                name: "State",
            },
        });
    });

    it("should return geoData with location, tooltipText, size", () => {
        const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM, TOOLTIP_TEXT_ITEM, LOCATION_ITEM];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, false, true, true, false),
            executionResult: getExecutionResult(true, false, true, true, false),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            location: {
                data: [
                    "44.500000;-89.500000",
                    "39.000000;-80.500000",
                    "44.000000;-72.699997",
                    "31.000000;-100.000000",
                    "44.500000;-100.000000",
                    "41.700001;-71.500000",
                    "44.000000;-120.500000",
                    "43.000000;-75.000000",
                    "44.000000;-71.500000",
                    "41.500000;-100.000000",
                    "38.500000;-98.000000",
                    "33.000000;-90.000000",
                    "40.000000;-89.000000",
                    "39.000000;-75.500000",
                    "41.599998;-72.699997",
                    "34.799999;-92.199997",
                    "40.273502;-86.126976",
                    "38.573936;-92.603760",
                    "27.994402;-81.760254",
                    "39.876019;-117.224121",
                    "45.367584;-68.972168",
                    "44.182205;-84.506836",
                    "33.247875;-83.441162",
                    "20.716179;-158.214676",
                    "66.160507;-153.369141",
                    "35.860119;-86.660156",
                    "37.926868;-78.024902",
                    "39.833851;-74.871826",
                    "37.839333;-84.270020",
                    "47.650589;-100.437012",
                    "46.392410;-94.636230",
                    "36.084621;-96.921387",
                    "46.965260;-109.533691",
                    "47.751076;-120.740135",
                    "39.419220;-111.950684",
                    "39.113014;-105.358887",
                    "40.367474;-82.996216",
                    "32.318230;-86.902298",
                    "42.032974;-93.581543",
                    "34.307144;-106.018066",
                    "33.836082;-81.163727",
                    "41.203323;-77.194527",
                    "34.048927;-111.093735",
                    "39.045753;-76.641273",
                    "42.407211;-71.382439",
                    "36.778259;-119.417931",
                    "44.068203;-114.742043",
                    "43.075970;-107.290283",
                    "35.782169;-80.793457",
                    "30.391830;-92.329102",
                ],
                index: 0,
                name: "State",
            },
            size: {
                data: [
                    1005,
                    943,
                    179,
                    4726,
                    1719,
                    2844,
                    838,
                    3060,
                    709,
                    772,
                    3949,
                    1766,
                    1560,
                    1938,
                    3836,
                    5302,
                    3310,
                    3500,
                    2288,
                    11564,
                    1381,
                    2627,
                    8732,
                    45703,
                    11107,
                    570,
                    1121,
                    1605,
                    433,
                    869,
                    12064,
                    596,
                    2299,
                    335,
                    1782,
                    1242,
                    150,
                    5602,
                    2282,
                    18,
                    22220,
                    7520,
                    1047,
                    253,
                    116,
                    957,
                    8340,
                    3294,
                    6832,
                    528,
                ],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
            tooltipText: {
                data: [
                    "Wisconsin",
                    "West Virginia",
                    "Vermont",
                    "Texas",
                    "South Dakota",
                    "Rhode Island",
                    "Oregon",
                    "New York",
                    "New Hampshire",
                    "Nebraska",
                    "Kansas",
                    "Mississippi",
                    "Illinois",
                    "Delaware",
                    "Connecticut",
                    "Arkansas",
                    "Indiana",
                    "Missouri",
                    "Florida",
                    "Nevada",
                    "Maine",
                    "Michigan",
                    "Georgia",
                    "Hawaii",
                    "Alaska",
                    "Tennessee",
                    "Virginia",
                    "New Jersey",
                    "Kentucky",
                    "North Dakota",
                    "Minnesota",
                    "Oklahoma",
                    "Montana",
                    "Washington",
                    "Utah",
                    "Colorado",
                    "Ohio",
                    "Alabama",
                    "Iowa",
                    "New Mexico",
                    "South Carolina",
                    "Pennsylvania",
                    "Arizona",
                    "Maryland",
                    "Massachusetts",
                    "California",
                    "Idaho",
                    "Wyoming",
                    "North Carolina",
                    "Louisiana",
                ],
                index: 1,
                name: "State",
            },
        });
    });

    it("should return geoData with location, color, size", () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, COLOR_ITEM, SIZE_ITEM];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, false, false, true, true),
            executionResult: getExecutionResult(true, false, false, true, true),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            color: {
                data: [
                    528,
                    6832,
                    3294,
                    8340,
                    957,
                    116,
                    253,
                    1047,
                    7520,
                    22220,
                    18,
                    2282,
                    5602,
                    150,
                    1242,
                    1782,
                    335,
                    2299,
                    596,
                    12064,
                    869,
                    433,
                    1605,
                    1121,
                    570,
                    11107,
                    45703,
                    8732,
                    2627,
                    1381,
                    11564,
                    2288,
                    3500,
                    3310,
                    5302,
                    3836,
                    1938,
                    1560,
                    1766,
                    3949,
                    772,
                    709,
                    3060,
                    838,
                    2844,
                    1719,
                    4726,
                    179,
                    943,
                    1005,
                ],
                format: "#,##0",
                index: 1,
                name: "Area",
            },
            location: {
                data: [
                    "44.500000;-89.500000",
                    "39.000000;-80.500000",
                    "44.000000;-72.699997",
                    "31.000000;-100.000000",
                    "44.500000;-100.000000",
                    "41.700001;-71.500000",
                    "44.000000;-120.500000",
                    "43.000000;-75.000000",
                    "44.000000;-71.500000",
                    "41.500000;-100.000000",
                    "38.500000;-98.000000",
                    "33.000000;-90.000000",
                    "40.000000;-89.000000",
                    "39.000000;-75.500000",
                    "41.599998;-72.699997",
                    "34.799999;-92.199997",
                    "40.273502;-86.126976",
                    "38.573936;-92.603760",
                    "27.994402;-81.760254",
                    "39.876019;-117.224121",
                    "45.367584;-68.972168",
                    "44.182205;-84.506836",
                    "33.247875;-83.441162",
                    "20.716179;-158.214676",
                    "66.160507;-153.369141",
                    "35.860119;-86.660156",
                    "37.926868;-78.024902",
                    "39.833851;-74.871826",
                    "37.839333;-84.270020",
                    "47.650589;-100.437012",
                    "46.392410;-94.636230",
                    "36.084621;-96.921387",
                    "46.965260;-109.533691",
                    "47.751076;-120.740135",
                    "39.419220;-111.950684",
                    "39.113014;-105.358887",
                    "40.367474;-82.996216",
                    "32.318230;-86.902298",
                    "42.032974;-93.581543",
                    "34.307144;-106.018066",
                    "33.836082;-81.163727",
                    "41.203323;-77.194527",
                    "34.048927;-111.093735",
                    "39.045753;-76.641273",
                    "42.407211;-71.382439",
                    "36.778259;-119.417931",
                    "44.068203;-114.742043",
                    "43.075970;-107.290283",
                    "35.782169;-80.793457",
                    "30.391830;-92.329102",
                ],
                index: 0,
                name: "State",
            },
            size: {
                data: [
                    1005,
                    943,
                    179,
                    4726,
                    1719,
                    2844,
                    838,
                    3060,
                    709,
                    772,
                    3949,
                    1766,
                    1560,
                    1938,
                    3836,
                    5302,
                    3310,
                    3500,
                    2288,
                    11564,
                    1381,
                    2627,
                    8732,
                    45703,
                    11107,
                    570,
                    1121,
                    1605,
                    433,
                    869,
                    12064,
                    596,
                    2299,
                    335,
                    1782,
                    1242,
                    150,
                    5602,
                    2282,
                    18,
                    22220,
                    7520,
                    1047,
                    253,
                    116,
                    957,
                    8340,
                    3294,
                    6832,
                    528,
                ],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
        });
    });
});

describe("financialToFixed", () => {
    it("should return number to fixed", () => {
        const newNum = getCenterNumberToFixed({ lat: 12.10843456, lng: 53.57620123 });
        expect(newNum).toEqual({ lat: 12.10843, lng: 53.5762 });
    });
});

describe("isDefaultCenter", () => {
    it("should return true when value is default", () => {
        const isDefault = isDefaultCenter({ lat: 34, lng: 5 });
        expect(isDefault).toEqual(true);
    });

    it("should return false when value is different default", () => {
        const isDefault = isDefaultCenter({ lat: 32, lng: 5 });
        expect(isDefault).toEqual(false);
    });
});

describe("isDefaultZoom", () => {
    it("should return true when value is default", () => {
        const isDefault = isDefaultZoom(2);
        expect(isDefault).toEqual(true);
    });

    it("should return false when value is different default", () => {
        const isDefault = isDefaultZoom(3);
        expect(isDefault).toEqual(false);
    });
});
