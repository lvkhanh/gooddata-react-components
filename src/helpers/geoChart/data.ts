// (C) 2020 GoodData Corporation
import get = require("lodash/get");
import { Execution, VisualizationObject } from "@gooddata/typings";
import { IGeoData, IObjectMapping, IGeoLngLatObj } from "../../interfaces/GeoChart";
import { COLOR, LOCATION, SEGMENT, SIZE, TOOLTIP_TEXT } from "../../constants/bucketNames";
import {
    getAttributeHeadersInDimension,
    getHeaderItemName,
    getMeasureGroupHeaderItemsInDimension,
    isTwoDimensionsData,
} from "../executionResultHelper";
import { stringToFloat } from "../utils";
import { getFormatFromExecutionResponse, getGeoAttributeHeaderItems } from "./common";
import { isDisplayFormUri } from "../../internal/utils/mdObjectHelper";
import { parseGeoPropertyItem } from "../../components/core/geoChart/geoChartTooltip";
import {
    DEFAULT_LONGITUDE,
    DEFAULT_LATITUDE,
    DEFAULT_ZOOM,
    DEFAULT_ROUND_NUM,
} from "../../constants/geoChart";

interface IBucketItemInfo {
    uri: VisualizationObject.IObjUriQualifier["uri"];
    localIdentifier: VisualizationObject.IObjUriQualifier["uri"];
}

export function getGeoData(
    buckets: VisualizationObject.IBucket[],
    execution: Execution.IExecutionResponses,
): IGeoData {
    const { executionResponse, executionResult } = execution;
    const geoData: IGeoData = getBucketItemNameAndDataIndex(buckets, executionResponse.dimensions);
    const attributeHeaderItems = getGeoAttributeHeaderItems(executionResult, geoData);

    const locationIndex: number = get(geoData, `${LOCATION}.index`);
    const segmentIndex: number = get(geoData, `${SEGMENT}.index`);
    const tooltipTextIndex: number = get(geoData, `${TOOLTIP_TEXT}.index`);
    const sizeIndex: number = get(geoData, `${SIZE}.index`);
    const colorIndex: number = get(geoData, `${COLOR}.index`);

    if (locationIndex !== undefined) {
        geoData[LOCATION].data = getAttributeData(attributeHeaderItems, locationIndex);
    }

    if (segmentIndex !== undefined) {
        geoData[SEGMENT].data = getAttributeData(attributeHeaderItems, segmentIndex);
    }

    if (tooltipTextIndex !== undefined) {
        geoData[TOOLTIP_TEXT].data = getAttributeData(attributeHeaderItems, tooltipTextIndex);
    }

    if (sizeIndex !== undefined) {
        geoData[SIZE].data = getMeasureData(executionResult, sizeIndex);
        geoData[SIZE].format = getFormatFromExecutionResponse(executionResponse, sizeIndex);
    }

    if (colorIndex !== undefined) {
        geoData[COLOR].data = getMeasureData(executionResult, colorIndex);
        geoData[COLOR].format = getFormatFromExecutionResponse(executionResponse, colorIndex);
    }

    return geoData;
}

function getMeasureData(executionResult: Execution.IExecutionResult, dataIndex: number): number[] {
    const { data } = executionResult;
    if (!isTwoDimensionsData(data)) {
        return [];
    }

    const measureValues = data[dataIndex];
    return measureValues.map(stringToFloat);
}

function getAttributeData(
    attributeHeaderItems: Execution.IResultHeaderItem[][],
    dataIndex: number,
): string[] {
    const headerItems = attributeHeaderItems[dataIndex];
    return headerItems.map(getHeaderItemName);
}

function getBucketItemNameAndDataIndex(
    buckets: VisualizationObject.IBucket[],
    dimensions: Execution.IResultDimension[],
): IGeoData {
    const measureGroupHeader: Execution.IMeasureHeaderItem[] = getMeasureGroupHeaderItemsInDimension(
        dimensions,
    );
    const attributeHeaders: Array<
        Execution.IAttributeHeader["attributeHeader"]
    > = getAttributeHeadersInDimension(dimensions);

    const bucketItemInfos = buckets.reduce(
        (result: IObjectMapping, bucket: VisualizationObject.IBucket): IObjectMapping => ({
            ...result,
            [bucket.localIdentifier]: getBucketItemInfo(bucket.items[0]),
        }),
        {},
    );

    // init data
    const result: IGeoData = {};

    [LOCATION, SEGMENT, TOOLTIP_TEXT].forEach(
        (bucketName: string): void => {
            const bucketItemInfo = bucketItemInfos[bucketName];
            if (!bucketItemInfo) {
                return;
            }
            const index = attributeHeaders.findIndex(
                (attributeHeader: Execution.IAttributeHeader["attributeHeader"]): boolean =>
                    attributeHeader.localIdentifier === bucketItemInfo.localIdentifier ||
                    attributeHeader.uri === bucketItemInfo.uri,
            );
            if (index !== -1) {
                result[bucketName] = {
                    index,
                    name: attributeHeaders[index].name,
                };
            }
        },
    );

    [SIZE, COLOR].forEach(
        (bucketName: string): void => {
            const bucketItemInfo = bucketItemInfos[bucketName];
            if (!bucketItemInfo) {
                return;
            }
            const index = measureGroupHeader.findIndex(
                (measureHeaderItem: Execution.IMeasureHeaderItem): boolean =>
                    measureHeaderItem.measureHeaderItem.localIdentifier === bucketItemInfo.localIdentifier ||
                    measureHeaderItem.measureHeaderItem.uri === bucketItemInfo.uri,
            );
            if (index !== -1) {
                result[bucketName] = {
                    index,
                    name: measureGroupHeader[index].measureHeaderItem.name,
                };
            }
        },
    );

    return result;
}

function getBucketItemInfo(bucketItem: VisualizationObject.BucketItem): IBucketItemInfo {
    if (!bucketItem) {
        return null;
    }

    // attribute item
    if (VisualizationObject.isVisualizationAttribute(bucketItem)) {
        const { displayForm, localIdentifier } = bucketItem.visualizationAttribute;
        const uri = isDisplayFormUri(displayForm) && displayForm.uri;
        return {
            uri,
            localIdentifier,
        };
    }

    // measure item
    const { definition, localIdentifier } = bucketItem.measure;
    const item = VisualizationObject.isMeasureDefinition(definition) && definition.measureDefinition.item;
    const uri = isDisplayFormUri(item) && item.uri;
    return { uri, localIdentifier };
}

export function buildTooltipBucketItems(tooltipText: string): VisualizationObject.IBucket {
    return {
        localIdentifier: TOOLTIP_TEXT,
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: TOOLTIP_TEXT,
                    displayForm: {
                        uri: tooltipText,
                    },
                },
            },
        ],
    };
}

export const getGeoBucketsFromMdObject = (
    mdObject: VisualizationObject.IVisualizationObjectContent,
): VisualizationObject.IBucket[] => {
    if (!mdObject) {
        return [];
    }
    const { buckets = [], properties } = mdObject;
    const propertiesObj = parseGeoPropertyItem(properties);
    const tooltipText = get(propertiesObj, "controls.tooltipText");
    if (tooltipText) {
        return [...buckets, buildTooltipBucketItems(tooltipText)];
    }

    return buckets;
};

export function isDefaultCenter(center: IGeoLngLatObj): boolean {
    const { lat, lng } = center;
    return DEFAULT_LATITUDE === lat && DEFAULT_LONGITUDE === lng;
}

export function isDefaultZoom(zoom: number): boolean {
    return zoom === DEFAULT_ZOOM;
}

export function getCenterNumberToFixed(center: IGeoLngLatObj): IGeoLngLatObj {
    const { lat, lng } = center;
    const latCenter = lat.toFixed(DEFAULT_ROUND_NUM);
    const lngCenter = lng.toFixed(DEFAULT_ROUND_NUM);
    return {
        lat: Number(latCenter),
        lng: Number(lngCenter),
    };
}
