// (C) 2019-2020 GoodData Corporation
import get = require("lodash/get");
import { VisualizationObject, Execution } from "@gooddata/typings";
import { IGeoData } from "../interfaces/GeoChart";
import { COLOR, LOCATION, SEGMENT_BY, SIZE, TOOLTIP_TEXT } from "../constants/bucketNames";
import {
    getAttributeHeadersInDimension,
    getMeasureGroupHeaderItemsInDimension,
} from "./executionResultHelper";

export function getGeoData(
    buckets: VisualizationObject.IBucket[],
    dimensions: Execution.IResultDimension[],
): IGeoData {
    const measureGroupHeader = getMeasureGroupHeaderItemsInDimension(dimensions);
    const attributeHeaders = getAttributeHeadersInDimension(dimensions);

    const bucketNameAndDisplayFormUri = buckets.reduce(
        (result: { [property: string]: string }, bucket: VisualizationObject.IBucket) => ({
            ...result,
            [bucket.localIdentifier]:
                get(bucket, "items.0.visualizationAttribute.displayForm.uri") ||
                get(bucket, "items.0.measure.definition.measureDefinition.item.uri"),
        }),
        {},
    );

    const geoData: IGeoData = {};

    [LOCATION, SEGMENT_BY, TOOLTIP_TEXT].forEach((bucketName: string) => {
        if (bucketNameAndDisplayFormUri[bucketName]) {
            const index = attributeHeaders.findIndex(
                (attributeHeader: Execution.IAttributeHeader["attributeHeader"]) =>
                    attributeHeader.uri === bucketNameAndDisplayFormUri[bucketName],
            );
            if (index !== -1) {
                geoData[bucketName] = {
                    index,
                    name: attributeHeaders[index].name,
                };
            }
        }
    });

    [SIZE, COLOR].forEach((bucketName: string) => {
        if (bucketNameAndDisplayFormUri[bucketName]) {
            const index = measureGroupHeader.findIndex(
                (measureHeaderItem: Execution.IMeasureHeaderItem) =>
                    measureHeaderItem.measureHeaderItem.uri === bucketNameAndDisplayFormUri[bucketName],
            );
            if (index !== -1) {
                geoData[bucketName] = {
                    index,
                    name: measureGroupHeader[index].measureHeaderItem.name,
                };
            }
        }
    });

    return geoData;
}

export function getGeoAttributeHeaderItems(
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
): Execution.IResultHeaderItem[][] {
    const { color, size } = geoData;

    const hasColorMeasure = color !== undefined;
    const hasSizeMeasure = size !== undefined;
    const attrHeaderItemIndex = hasColorMeasure || hasSizeMeasure ? 1 : 0;
    const attributeHeaderItems = executionResult.headerItems[attrHeaderItemIndex];

    return attributeHeaderItems;
}

export function isDataOfReasonableSize(
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
    limit: number,
): boolean {
    const { location } = geoData;

    const attributeHeaderItems = getGeoAttributeHeaderItems(executionResult, geoData);
    const locationData = location !== undefined ? attributeHeaderItems[location.index] : [];

    return locationData.length > limit;
}
