import * as React from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
  data: any
  level?: number
  isExpanded?: boolean
}

interface JsonKeyValueProps {
  keyName: string
  value: any
  level: number
  isLast: boolean
}

const JsonKeyValue = ({ keyName, value, level, isLast }: JsonKeyValueProps) => {
  const [isExpanded, setIsExpanded] = React.useState(level < 2)
  const isObject = typeof value === "object" && value !== null
  const indent = level * 16 // 16px per level

  if (!isObject) {
    return (
      <div 
        className={cn(
          "flex items-start py-2 border-b last:border-b-0 text-sm",
          level > 0 && "border-b-gray-100"
        )}
        style={{ paddingLeft: `${indent}px` }}
      >
        <span className="font-medium text-blue-600 mr-2">{keyName}:</span>
        <span className="text-gray-800">
          {typeof value === "string" ? `"${value}"` : String(value)}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("border-b last:border-b-0", level > 0 && "border-b-gray-100")}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center w-full py-2 text-left text-sm hover:bg-gray-50 transition-colors",
          isExpanded && "bg-gray-50"
        )}
        style={{ paddingLeft: `${indent}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
        )}
        <span className="font-medium text-blue-600 mr-2">{keyName}</span>
        <span className="text-gray-500">
          {Array.isArray(value) ? "[...]" : "{...}"}
        </span>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {Array.isArray(value) ? (
              value.map((item, index) => (
                <JsonKeyValue
                  key={index}
                  keyName={String(index)}
                  value={item}
                  level={level + 1}
                  isLast={index === value.length - 1}
                />
              ))
            ) : (
              Object.entries(value).map(([key, val], index, arr) => (
                <JsonKeyValue
                  key={key}
                  keyName={key}
                  value={val}
                  level={level + 1}
                  isLast={index === arr.length - 1}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function JsonViewer({ data, level = 0 }: JsonViewerProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {Object.entries(data).map(([key, value], index, arr) => (
        <JsonKeyValue
          key={key}
          keyName={key}
          value={value}
          level={level}
          isLast={index === arr.length - 1}
        />
      ))}
    </div>
  )
} 