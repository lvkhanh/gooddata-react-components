// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import cx from "classnames";
import get = require("lodash/get");
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import mapboxgl = require("mapbox-gl");
import { Execution } from "@gooddata/typings";

import {
    createClusterLabels,
    createClusterPoints,
    createPushpinDataLayer,
    createUnclusterPoints,
    createPushpinFilter,
} from "./geoChartDataLayers";
import { createPushpinDataSource } from "./geoChartDataSource";
import {
    DEFAULT_CLUSTER_LABELS_CONFIG,
    DEFAULT_CLUSTER_LAYER_NAME,
    DEFAULT_DATA_SOURCE_NAME,
    DEFAULT_LATITUDE,
    DEFAULT_LAYER_NAME,
    DEFAULT_LONGITUDE,
    DEFAULT_MAPBOX_OPTIONS,
    DEFAULT_ZOOM,
    DEFAULT_TOOLTIP_OPTIONS,
} from "../../../constants/geoChart";
import { IGeoConfig, IGeoData } from "../../../interfaces/GeoChart";

import "../../../../styles/scss/geoChart.scss";
import { handlePushpinMouseEnter, handlePushpinMouseLeave } from "./geoChartTooltip";
import { isClusteringAllowed } from "../../../helpers/geoChart/common";
import { isDefaultZoom, isDefaultCenter, getCenterNumberToFixed } from "../../../helpers/geoChart/data";

export interface IGeoChartRendererProps {
    config: IGeoConfig;
    execution: Execution.IExecutionResponses;
    geoData: IGeoData;
    afterRender(): void;
    onCenterPositionChanged(data: mapboxgl.EventData): void;
    onZoomChanged(data: mapboxgl.EventData): void;
}

export default class GeoChartRenderer extends React.Component<IGeoChartRendererProps> {
    public static defaultProps: Partial<IGeoChartRendererProps> = {
        config: {
            mapboxToken: "",
        },
        afterRender: noop,
        onZoomChanged: noop,
        onCenterPositionChanged: noop,
    };

    private chart: mapboxgl.Map;
    private tooltip: mapboxgl.Popup;
    private chartRef: HTMLElement;

    public constructor(props: IGeoChartRendererProps) {
        super(props);

        mapboxgl.accessToken = props.config.mapboxToken;
    }

    public shouldComponentUpdate(nextProps: IGeoChartRendererProps) {
        const {
            config: { center: nextCenter, zoom: nextZoom },
        } = nextProps;
        const { chart } = this;

        if (chart) {
            const chartCenter = chart.getCenter();
            const chartZoom = chart.getZoom();
            return !isEqual(chartCenter, nextCenter) || !isEqual(chartZoom, nextZoom);
        }

        const {
            config: { center: currentCenter, zoom: currentZoom },
        } = this.props;

        return !isEqual(currentCenter, nextCenter) || !isEqual(currentZoom, nextZoom);
    }

    public componentDidUpdate(prevProps: IGeoChartRendererProps) {
        if (!this.props.execution) {
            return;
        }
        const {
            execution: { executionResponse },
            config: { selectedSegmentItems = [] },
        } = this.props;
        const {
            execution: { executionResponse: prevExecutionResponse = {} } = {},
            config: { selectedSegmentItems: prevSelectedSegmentItems = [] } = {},
        } = prevProps || {};

        if (!isEqual(executionResponse, prevExecutionResponse)) {
            if (prevExecutionResponse) {
                this.cleanupMap();
                this.setupMap();
            } else {
                this.removeMap();
                this.createMap();
            }
        } else if (selectedSegmentItems && !isEqual(selectedSegmentItems, prevSelectedSegmentItems)) {
            this.setFilterMap();
        }
    }
    public componentDidMount() {
        this.createTooltip();
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
        const isExportMode = this.isExportMode();
        const zoom = get(config, "zoom", DEFAULT_ZOOM);

        this.chart = new mapboxgl.Map({
            ...DEFAULT_MAPBOX_OPTIONS,
            container: this.chartRef,
            center,
            // If true, the map’s canvas can be exported to a PNG using map.getCanvas().toDataURL().
            // This is false by default as a performance optimization.
            preserveDrawingBuffer: isExportMode,
            zoom,
        });
    };

    public render() {
        const isExportMode = this.isExportMode();
        const classNames = cx("s-gd-geo-chart-renderer", "mapbox-container", {
            isExportMode,
            "s-isExportMode": isExportMode,
        });
        return <div className={classNames} ref={this.setChartRef} />;
    }

    private isExportMode = (): boolean => {
        const { config } = this.props;
        return get(config, "isExportMode", false);
    };

    private createMapControls = () => {
        this.chart.addControl(
            new mapboxgl.NavigationControl({
                showCompass: false,
            }),
            "bottom-right",
        );
    };
    private setFilterMap = (): void => {
        const {
            config: { selectedSegmentItems },
        } = this.props;

        if (this.chart.getLayer(DEFAULT_LAYER_NAME)) {
            this.chart.setFilter(DEFAULT_LAYER_NAME, createPushpinFilter(selectedSegmentItems));
        }
    };
    private handleMapEvent = () => {
        const { chart, tooltip } = this;
        const {
            config: { separators },
        } = this.props;
        chart.on("load", this.setupMap);
        chart.on("mouseenter", DEFAULT_LAYER_NAME, handlePushpinMouseEnter(chart, tooltip, separators));
        chart.on("mouseleave", DEFAULT_LAYER_NAME, handlePushpinMouseLeave(chart, tooltip));
        chart.on("moveend", this.handlePushpinMoveEnd);
        chart.on("zoomend", this.handlePushpinZoomEnd);
    };

    private setupMap = (): void => {
        const { chart, handleLayerLoaded, props } = this;
        const {
            config: { selectedSegmentItems },
            geoData,
        } = props;

        // hide city, town, village and hamlet labels
        if (chart.getLayer("settlement-label")) {
            chart.removeLayer("settlement-label");
        }

        chart.addSource(DEFAULT_DATA_SOURCE_NAME, createPushpinDataSource(geoData));

        if (!isClusteringAllowed(geoData)) {
            chart.addLayer(
                createPushpinDataLayer(DEFAULT_DATA_SOURCE_NAME, geoData, selectedSegmentItems),
                "state-label", // pushpin will be rendered under state/county label
            );
        } else {
            chart.addLayer(createClusterPoints(DEFAULT_DATA_SOURCE_NAME));
            chart.addLayer(createClusterLabels(DEFAULT_DATA_SOURCE_NAME));
            // un-clustered points will be rendered under state/county label
            chart.addLayer(createUnclusterPoints(DEFAULT_DATA_SOURCE_NAME), "state-label");
        }

        // keep listening to the data event until the style is loaded
        chart.on("data", handleLayerLoaded);
    };

    private handleLayerLoaded = () => {
        const { chart } = this;
        if (!chart.isStyleLoaded()) {
            return;
        }

        chart.off("data", this.handleLayerLoaded);

        this.props.afterRender();
    };

    private createTooltip = () => {
        this.tooltip = new mapboxgl.Popup(DEFAULT_TOOLTIP_OPTIONS);
    };

    private cleanupMap = (): void => {
        const { geoData } = this.props;

        if (this.chart.getLayer(DEFAULT_LAYER_NAME)) {
            this.chart.removeLayer(DEFAULT_LAYER_NAME);
        }

        if (isClusteringAllowed(geoData)) {
            if (this.chart.getLayer(DEFAULT_CLUSTER_LAYER_NAME)) {
                this.chart.removeLayer(DEFAULT_CLUSTER_LAYER_NAME);
            }
            if (this.chart.getLayer(DEFAULT_CLUSTER_LABELS_CONFIG.id)) {
                this.chart.removeLayer(DEFAULT_CLUSTER_LABELS_CONFIG.id);
            }
        }
        if (this.chart.getSource(DEFAULT_DATA_SOURCE_NAME)) {
            this.chart.removeSource(DEFAULT_DATA_SOURCE_NAME);
        }
    };

    private removeMap = (): void => {
        if (this.chart) {
            this.chart.remove();
        }
    };

    private handlePushpinMoveEnd = (e: mapboxgl.EventData): void => {
        const { target } = e;
        const {
            onCenterPositionChanged,
            config: { tooltipText },
        } = this.props;
        const newCenter = getCenterNumberToFixed(target.getCenter());
        const center = isDefaultCenter(newCenter) ? {} : { center: newCenter };
        onCenterPositionChanged({
            properties: {
                controls: {
                    ...center,
                    tooltipText,
                },
            },
        });
    };

    private handlePushpinZoomEnd = (e: mapboxgl.EventData): void => {
        const { target } = e;
        const { onZoomChanged } = this.props;
        const newZoom: number = target.getZoom();
        const zoom = isDefaultZoom(newZoom) ? {} : { zoom: newZoom };

        onZoomChanged({
            properties: {
                controls: {
                    ...zoom,
                },
            },
        });
    };
}
