'use client'

import React, { useState, useId } from 'react'

export interface DataPoint {
  timestamp: string // formatted time e.g. "12:04:12"
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  title: string
  subtitle: string
  unit: string
  lineColor?: string
  fillGradientStart?: string
  fillGradientEnd?: string
  minY?: number
  maxY?: number
  height?: number
  badgeText?: string
}

export function LineChart({
  data,
  title,
  subtitle,
  unit,
  lineColor = '#80bd48',
  fillGradientStart = 'rgba(128, 189, 72, 0.28)',
  fillGradientEnd = 'rgba(128, 189, 72, 0.02)',
  minY: customMinY,
  maxY: customMaxY,
  height = 220,
  badgeText,
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const gradientId = useId()

  const latestPoint = data.length > 0 ? data[data.length - 1] : null
  const values = data.map((d) => d.value)

  const computedMinY = customMinY !== undefined
    ? customMinY
    : values.length > 0
    ? Math.floor(Math.min(...values) - 1)
    : 0

  const computedMaxY = customMaxY !== undefined
    ? customMaxY
    : values.length > 0
    ? Math.ceil(Math.max(...values) + 1)
    : 10

  const yRange = computedMaxY - computedMinY === 0 ? 1 : computedMaxY - computedMinY

  // SVG viewBox settings
  const width = 600
  const paddingLeft = 45
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 35
  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  // Coordinates mapping
  const points = data.map((d, index) => {
    const x =
      data.length > 1
        ? paddingLeft + (index / (data.length - 1)) * chartWidth
        : paddingLeft + chartWidth / 2
    const normalizedY = (d.value - computedMinY) / yRange
    const y = paddingTop + chartHeight - normalizedY * chartHeight
    return { x, y, point: d }
  })

  // Create SVG path
  let pathD = ''
  if (points.length === 1) {
    pathD = `M ${points[0].x} ${points[0].y}`
  } else if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      // Smooth quadratic bezier or straight segment
      const prev = points[i - 1]
      const curr = points[i]
      const cx = (prev.x + curr.x) / 2
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`
    }
  }

  // Area path for gradient background
  let areaD = ''
  if (points.length > 1) {
    const bottomY = paddingTop + chartHeight
    areaD = `${pathD} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`
  }

  // Y-axis ticks (3 ticks: min, mid, max)
  const yTicks = [
    { value: computedMaxY, y: paddingTop },
    { value: Number(((computedMinY + computedMaxY) / 2).toFixed(1)), y: paddingTop + chartHeight / 2 },
    { value: computedMinY, y: paddingTop + chartHeight },
  ]

  return (
    <div className="rounded-3xl border border-[#dce5d9] bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#edf1eb]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#153b35]">{title}</h3>
            {badgeText && (
              <span className="rounded-full bg-[#f1f6ed] px-2.5 py-0.5 text-[11px] font-bold text-[#5c8e33]">
                {badgeText}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[#788d81]">{subtitle}</p>
        </div>

        <div className="text-right">
          <p className="text-[11px] font-semibold text-[#8a9d90] uppercase tracking-wider">Latest</p>
          <p className="text-2xl font-bold text-[#153b35]">
            {latestPoint ? latestPoint.value.toFixed(2) : '--'}
            <span className="ml-1 text-xs font-normal text-[#788d81]">{unit}</span>
          </p>
        </div>
      </div>

      <div className="relative mt-4">
        {hoveredPoint && (
          <div
            className="pointer-events-none absolute z-10 -top-2 rounded-xl border border-[#d8e2d7] bg-[#153b35] px-2.5 py-1.5 text-xs text-white shadow-lg transition-all"
            style={{
              left: hoveredIndex !== null && points[hoveredIndex]
                ? Math.min(Math.max(10, points[hoveredIndex].x - 40), width - 90)
                : 10,
            }}
          >
            <div className="font-mono font-bold text-[#d5f36d]">
              {hoveredPoint.value.toFixed(2)} {unit}
            </div>
            <div className="text-[10px] text-white/70">{hoveredPoint.timestamp}</div>
          </div>
        )}

        {data.length === 0 ? (
          <div className="flex h-44 items-center justify-center rounded-2xl bg-[#f9faf7] text-xs text-[#8a9d90]">
            Waiting for live data points...
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
            onMouseLeave={() => {
              setHoveredPoint(null)
              setHoveredIndex(null)
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillGradientStart} />
                <stop offset="100%" stopColor={fillGradientEnd} />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={tick.y}
                  x2={width - paddingRight}
                  y2={tick.y}
                  stroke="#edf2ea"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={tick.y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#8a9d90"
                  fontFamily="monospace"
                >
                  {tick.value}
                </text>
              </g>
            ))}

            {/* Area Fill */}
            {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}

            {/* Line Path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={lineColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Data points */}
            {points.map((p, i) => {
              const isHovered = hoveredIndex === i
              const isLast = i === points.length - 1
              return (
                <g key={i}>
                  {/* Invisible larger hover target */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredPoint(p.point)
                      setHoveredIndex(i)
                    }}
                  />
                  {/* Visual dot for hover or last point */}
                  {(isHovered || isLast) && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 5 : 3.5}
                      fill={lineColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}
                </g>
              )
            })}

            {/* Time labels on X axis */}
            {data.length > 0 && (
              <>
                <text
                  x={paddingLeft}
                  y={height - 8}
                  fontSize="10"
                  fill="#8a9d90"
                  textAnchor="start"
                >
                  {data[0]?.timestamp || ''}
                </text>
                <text
                  x={width - paddingRight}
                  y={height - 8}
                  fontSize="10"
                  fill="#8a9d90"
                  textAnchor="end"
                >
                  {latestPoint?.timestamp || ''} (now)
                </text>
              </>
            )}
          </svg>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-[#8a9d90]">
        <span>Rolling history ({data.length} readings)</span>
        <span>Polling rate: ~3s</span>
      </div>
    </div>
  )
}
