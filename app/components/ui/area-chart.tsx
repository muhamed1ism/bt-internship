import * as React from "react"
import { cn } from "@app/lib/utils"

interface DataPoint {
  label: string
  value: number
}

interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DataPoint[]
  height?: number
  color?: string
}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  ({ className, data, height = 200, color = "hsl(var(--primary))", ...props }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center", className)}
          style={{ height }}
          {...props}
        >
          <span className="text-muted-foreground">No data available</span>
        </div>
      )
    }

    const maxValue = Math.max(...data.map(d => d.value))
    const minValue = Math.min(...data.map(d => d.value))
    const range = maxValue - minValue || 1

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((point.value - minValue) / range) * 100
      return { x, y, label: point.label, value: point.value }
    })

    // Create area path
    const areaPath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`)
      .join(' ') + ` L 100% 100% L 0% 100% Z`

    // Create line path
    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`)
      .join(' ')

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ height }}
        {...props}
      >
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ color }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill="currentColor"
            fillOpacity="0.1"
          />
          
          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
          {data.map((point, index) => (
            <span key={index} className="text-center">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    )
  }
)
AreaChart.displayName = "AreaChart"

export { AreaChart } 