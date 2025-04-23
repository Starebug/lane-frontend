// hooks/useSort.ts
import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

type SortColumn = "name" | "email" | "companyName"

export const useSort = (initialColumn: SortColumn = "name", initialDirection: "asc" | "desc" = "asc") => {
  const [sortBy, setSortBy] = useState<SortColumn>(initialColumn)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialDirection)

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="inline w-4 h-4 ml-1" />
    )
  }

  return { sortBy, sortDirection, handleSort, renderSortIcon }
}
