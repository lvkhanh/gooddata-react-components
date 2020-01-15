// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import get = require("lodash/get");
import mapboxgl = require("mapbox-gl");
import { Execution } from "@gooddata/typings";
import { createPushpinDataLayer } from "./geoChartDataLayers";
import { createPushpinDataSource } from "./geoChartDataSource";
import {
    DEFAULT_DATA_SOURCE_NAME,
    DEFAULT_LATITUDE,
    DEFAULT_LONGITUDE,
    DEFAULT_MAPBOX_OPTIONS,
    DEFAULT_ZOOM,
    MAPBOX_ACCESS_TOKEN,
} from "../../../constants/geoChart";
import { IGeoConfig, IGeoDataIndex } from "../../../interfaces/GeoChart";
import { getGeoDataIndex } from "../../../helpers/geoChart";

import "../../../../styles/scss/geoChart.scss";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export interface IGeoChartRendererProps {
    config: IGeoConfig;
    execution: Execution.IExecutionResponses;
}

export default class GeoChartRenderer extends React.PureComponent<IGeoChartRendererProps> {
    public static defaultProps: Partial<IGeoChartRendererProps> = {
        config: {},
    };

    private chart: mapboxgl.Map;
    private chartRef: HTMLElement;

    public componentDidUpdate(prevProps: IGeoChartRendererProps) {
        const { execution } = this.props;
        if (execution !== prevProps.execution) {
            if (prevProps.execution) {
                this.cleanupMap();
                this.setupMap();
            } else {
                this.removeMap();
                this.createMap();
            }
        }
    }

    public componentDidMount() {
        this.createMap();
        this.createMapControls();
        this.handleMapEvent();
    }

    public componentWillUnmount() {
        this.removeMap();
    }

    public setChartRef = (ref: HTMLElement) => {
        this.chartRef = ref;
    };

    public createMap = () => {
        const { config } = this.props;
        const center = get(config, "center", [DEFAULT_LONGITUDE, DEFAULT_LATITUDE] as [number, number]);
        const zoom = get(config, "zoom", DEFAULT_ZOOM);

        this.chart = new mapboxgl.Map({
            ...DEFAULT_MAPBOX_OPTIONS,
            container: this.chartRef,
            center,
            zoom,
        });
    };

    public render() {
        return <div className="s-gd-geo-chart-renderer" ref={this.setChartRef} />;
    }

    private createMapControls = () => {
        this.chart.addControl(
            new mapboxgl.NavigationControl({
                showCompass: false,
            }),
            "top-left",
        );
    };

    private handleMapEvent = () => {
        const { chart } = this;
        chart.on("load", this.setupMap);
    };

    private setupMap = (): void => {
        const { chart } = this;
        const {
            execution: { executionResult },
            config: { mdObject: { buckets = [] } = {}, selectedSegmentItem },
        } = this.props;

        // hide city, town, village and hamlet labels
        if (this.chart.getLayer("settlement-label")) {
            this.chart.removeLayer("settlement-label");
        }

        const geoDataIndex: IGeoDataIndex = getGeoDataIndex(buckets);
        chart.addSource(DEFAULT_DATA_SOURCE_NAME, createPushpinDataSource(executionResult, geoDataIndex));
        chart.addLayer(
            createPushpinDataLayer(
                DEFAULT_DATA_SOURCE_NAME,
                executionResult,
                geoDataIndex,
                selectedSegmentItem,
            ),
            "state-label", // pushpin will be rendered under state/county label
        );
    };

    private cleanupMap = (): void => {
        this.chart.removeLayer(DEFAULT_DATA_SOURCE_NAME);
        this.chart.removeSource(DEFAULT_DATA_SOURCE_NAME);
    };

    private removeMap = (): void => {
        if (this.chart) {
            this.chart.remove();
        }
    };
}
