// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import { testUtils } from "@gooddata/js-utils";
import { VisualizationObject } from "@gooddata/typings";

import { GeoChartInner, IGeoChartInnerProps } from "../GeoChart";
import { createIntlMock } from "../../visualizations/utils/intlUtils";
import * as BucketNames from "../../../constants/bucketNames";
import { getExecutionResult } from "../../../../stories/data/geoChart";

const intl = createIntlMock();
const mdObject: VisualizationObject.IVisualizationObjectContent = {
    buckets: [
        {
            localIdentifier: BucketNames.LOCATION,
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: "a1",
                        displayForm: {
                            uri: "/gdc/md/project/obj/1027",
                        },
                    },
                },
            ],
        },
    ],
    visualizationClass: {
        uri: "/gdc/md/mockproject/obj/column",
    },
};

describe("GeoChart", () => {
    function renderComponent(customProps: Partial<IGeoChartInnerProps> = {}): ReactWrapper {
        const defaultProps: Partial<IGeoChartInnerProps> = {
            config: {
                mdObject,
            },
            execution: {
                executionResponse: undefined,
                executionResult: getExecutionResult(true),
            },
            intl,
        };
        return mount(<GeoChartInner {...defaultProps} {...customProps} />);
    }

    it("should render GeoChartInner", async () => {
        const wrapper = renderComponent();
        await testUtils.delay();
        wrapper.update();
        expect(wrapper.find(".s-gd-geo-component").length).toBe(1);
    });

    it("should use custom Chart renderer", () => {
        const chartRenderer = jest.fn().mockReturnValue(<div />);
        renderComponent({ chartRenderer });
        expect(chartRenderer).toHaveBeenCalledTimes(1);
    });

    it("should use custom Legend renderer", () => {
        const legendRenderer = jest.fn().mockReturnValue(<div />);
        renderComponent({ legendRenderer });
        expect(legendRenderer).toHaveBeenCalledTimes(1);
    });

    it("should call onDataTooLarge", () => {
        const onDataTooLarge = jest.fn();
        renderComponent({
            config: {
                limit: 20,
                mdObject,
            },
            onDataTooLarge,
        });
        expect(onDataTooLarge).toHaveBeenCalledTimes(1);
    });
});
