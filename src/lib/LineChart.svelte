<!-- Shoutout to Svend3r! -->
<script lang="ts">
	import { Delaunay, curveLinear, line, range, scaleLinear, scaleUtc } from 'd3';
	export let data: { id: string; data: { month: Date; total: number }[] }[];

	export let marginTop: number; // the top margin, in pixels
	export let marginRight: number; // the right margin, in pixels
	export let marginBottom: number; // the bottom margin, in pixels
	export let marginLeft: number; // the left margin, in pixels
	export let inset: number; // inset the default range, in pixels
	export let width: number; // the outer width of the chart, in pixels
	export let height: number; // the outer height of the chart, in pixels
	export let xLabel: string; // a label for the y-axis
	export let yLabel: string; // a label for the y-axis
	export let xFormat: string; // a format specifier string for the y-axis
	export let yFormat: string; // a format specifier string for the y-axis
	export let horizontalGrid: boolean; // show horizontal grid lines
	export let verticalGrid: boolean; // show vertical grid lines
	export let svend3rColors: string[]; // fill color for dots && number of colors in fill array MUST match number of subsets in data
	const colors = data.map((_value, index) => svend3rColors[index % svend3rColors.length]); // number of colors in fill array WILL match number of subsets in data
	export let showDots: boolean; // whether dots should be displayed
	export let dotsFilled: boolean; // whether dots should be filled or outlined
	export let r: number; // (fixed) radius of dots, in pixels
	export let strokeWidth: number; // stroke width of line, in pixels
	export let strokeOpacity: number; // stroke opacity of line
	export let tooltipBackground: string; // background color of tooltip
	export let tooltipTextColor: string; // text color of tooltip
	const strokeLinecap = 'round'; // stroke line cap of the line
	const strokeLinejoin = 'round'; // stroke line join of the line
	const xScalefactor = width / 80; //y-axis number of values
	const yScalefactor = height / 40; //y-axis number of values
	const curve = curveLinear; // method of interpolation between points
	const xType = scaleUtc; // type of x-scale
	const insetTop = inset; // inset from top
	const insetRight = inset; // inset from right
	const insetBottom = inset; // inset fro bottom
	const insetLeft = inset; // inset from left
	const xRange = [marginLeft + insetLeft, width - marginRight - insetRight]; // [left, right]
	const yType = scaleLinear; // type of y-scale
	const yRange = [height - marginBottom - insetBottom, marginTop + insetTop]; // [bottom, top]

	let x,
		y,
		dotInfo,
		lines,
		xVals = [],
		yVals = [],
		points = [],
		subsets = [],
		colorVals = [];

	// For a single set of data
	if (!('data' in data[0])) {
		x = Object.keys(data[0])[0];
		y = Object.keys(data[0])[1];
		xVals = data.map((el) => el[x]);
		yVals = data.map((el) => el[y]);
		colorVals = data.map((el) => 0);
		points = data.map((el) => ({
			x: el[x],
			y: el[y],
			color: 0
		}));
	}
	// For data with subsets (NOTE: expects 'id' and 'data' keys)
	else {
		x = Object.keys(data[0]?.data[0])[0];
		y = Object.keys(data[0]?.data[0])[1];
		data.forEach((subset, i) => {
			subset.data.forEach((coordinate) => {
				xVals.push(coordinate[x]);
				yVals.push(coordinate[y]);
				colorVals.push(i);
				points.push({
					x: coordinate[x],
					y: coordinate[y],
					color: i
				});
			});
			subsets.push(subset.id);
		});
	}

	const I = range(xVals.length);
	const gaps = (d, i) => !isNaN(xVals[i]) && !isNaN(yVals[i]);
	const cleanData = points.map(gaps);

	const xDomain = [xVals[0], xVals[xVals.length - 1]];
	const yDomain = [0, Math.max(...yVals)];
	const xScale = xType(xDomain, xRange);
	const yScale = yType(yDomain, yRange);
	const niceY = scaleLinear()
		.domain([0, Math.max(...yVals)])
		.nice();

	const chartLine = line()
		.defined((i) => cleanData[i])
		.curve(curve)
		.x((i) => xScale(xVals[i]))
		.y((i) => yScale(yVals[i]));

	$: {
		lines = [];
		colors.forEach((color, j) => {
			const filteredI = I.filter((el, i) => colorVals[i] === j);
			lines.push(chartLine(filteredI));
		});
	}

	const pointsScaled = points.map((el) => [xScale(el.x), yScale(el.y), el.color]);
	const delaunayGrid = Delaunay.from(pointsScaled);
	const voronoiGrid = delaunayGrid.voronoi([0, 0, width, height]);

	const xTicks = xScale.ticks(xScalefactor);
	const xTicksFormatted = xTicks.map((el) => el.getFullYear());
	const yTicks = niceY.ticks(yScalefactor);
</script>

<div class="chart-container">
	<svg
		{width}
		{height}
		viewBox="0 0 {width} {height}"
		cursor="crosshair"
		on:mouseout={() => (dotInfo = null)}
		on:blur={() => (dotInfo = null)}
	>
		<!-- Dots (if enabled) -->
		{#if showDots && !dotInfo}
			{#each I as i}
				<g class="dot" pointer-events="none">
					<circle
						cx={xScale(xVals[i])}
						cy={yScale(yVals[i])}
						{r}
						stroke={colors[colorVals[i]]}
						fill={dotsFilled ? colors[colorVals[i]] : 'none'}
					/>
				</g>
			{/each}
		{/if}
		<!-- Chart lines -->
		{#each lines as subsetLine, i}
			<g class="chartlines" pointer-events="none">
				{#if dotInfo}
					<path
						class="line"
						fill="none"
						stroke-opacity={points[dotInfo[1]].color === i ? '1' : '0.1'}
						stroke={colors[i]}
						d={subsetLine}
						stroke-width={strokeWidth}
						stroke-linecap={strokeLinecap}
						stroke-linejoin={strokeLinejoin}
					/>
					<circle
						cx={xScale(points[dotInfo[1]].x)}
						cy={yScale(points[dotInfo[1]].y)}
						{r}
						stroke={colors[points[dotInfo[1]].color]}
						fill={dotsFilled}
					/>
				{:else}
					<path
						class="line"
						fill="none"
						stroke={colors[i]}
						d={subsetLine}
						stroke-opacity={strokeOpacity}
						stroke-width={strokeWidth}
						stroke-linecap={strokeLinecap}
						stroke-linejoin={strokeLinejoin}
					/>
				{/if}
			</g>
		{/each}

		<!-- Y-axis and horizontal grid lines -->
		<g class="y-axis" transform="translate({marginLeft}, 0)" pointer-events="none">
			<path
				class="domain"
				stroke="black"
				d="M{insetLeft}, {marginTop} V{height - marginBottom + 6}"
			/>
			{#each yTicks as tick, i}
				<g class="tick" transform="translate(0, {yScale(tick)})">
					<line class="tick-start" x1={insetLeft - 6} x2={insetLeft} />
					{#if horizontalGrid}
						<line class="tick-grid" x1={insetLeft} x2={width - marginLeft - marginRight} />
					{/if}
					<text x="-{marginLeft}" y="5">{tick + yFormat}</text>
				</g>
			{/each}
			<text x="-{marginLeft}" y={marginTop - 10}>{yLabel}</text>
		</g>
		<!-- X-axis and vertical grid lines -->
		<g
			class="x-axis"
			transform="translate(0,{height - marginBottom - insetBottom})"
			pointer-events="none"
		>
			<path class="domain" stroke="black" d="M{marginLeft},0.5 H{width - marginRight}" />
			{#each xTicks as tick, i}
				<g class="tick" transform="translate({xScale(tick)}, 0)">
					<line class="tick-start" stroke="black" y2="6" />
					{#if verticalGrid}
						<line class="tick-grid" y2={-height + 70} />
					{/if}
					<text font-size="8px" x={-marginLeft / 4} y="20">{xTicksFormatted[i] + xFormat}</text>
				</g>
			{/each}
			<text x={width - marginLeft - marginRight - 40} y={marginBottom}>{xLabel}</text>
		</g>

		{#each pointsScaled as point, i}
			<path
				stroke="none"
				fill-opacity="0"
				class="voronoi-cell"
				d={voronoiGrid.renderCell(i)}
				on:mouseover={(e) => (dotInfo = [point, i, e])}
				on:focus={(e) => (dotInfo = [point, i, e])}
			/>
		{/each}
	</svg>
</div>
<!-- Tooltip -->
{#if dotInfo}
	<div
		class="tooltip"
		style="position:absolute; left:{dotInfo[2].clientX + 12}px; top:{dotInfo[2].clientY +
			12}px; pointer-events:none; background-color:{tooltipBackground}; color:{tooltipTextColor}"
	>
		{subsets ? subsets[points[dotInfo[1]].color] : ''}:
		{points[dotInfo[1]].x.getFullYear()}: {points[dotInfo[1]].y.toFixed(2)}{yFormat}
	</div>
{/if}

<style>
	.chart-container {
		justify-content: center;
		align-items: center;
		margin-top: 50px;
		margin-left: 8 0px;
	}
	svg {
		max-width: 100%;
		height: auto;
		height: 'intrinsic';
		margin: auto;
	}
	path {
		fill: 'green';
	}
	.y-axis {
		font-size: '10px';
		font-family: sans-serif;
		text-anchor: 'end';
	}
	.x-axis {
		font-size: '10px';
		font-family: sans-serif;
		text-anchor: 'end';
	}
	.tick {
		opacity: 1;
	}
	.tick-start {
		stroke: black;
		stroke-opacity: 1;
	}
	.tick-grid {
		stroke: black;
		stroke-opacity: 0.2;
		font-size: '11px';
		color: black;
	}
	.tick text {
		fill: black;
		text-anchor: start;
	}

	.tooltip {
		border-radius: 5px;
		padding: 5px;
		box-shadow:
			rgba(0, 0, 0, 0.4) 0px 2px 4px,
			rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
			rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
	}
</style>
