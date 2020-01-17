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
