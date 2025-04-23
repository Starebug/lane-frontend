
import{ useState,useMemo } from 'react'
export interface User {
  id: number
  name: string
  email: string
  companyName: string
  phone: string
  website: string
  address: string
}

export interface Company {
  name: string
  userCount: number
  users: User[]
}

export function useUserData(apiUrl: string) {
  const [users, setUsers] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleRefresh = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const res = await fetch(apiUrl)
      const data = await res.json()

      const tweakedData = data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.company.name,
        phone: user.phone,
        website: user.website,
        address: `${user.address.street}, ${user.address.city}`,
      }))

      setUsers(tweakedData)

      const companyMap = new Map<string, Company>()
      tweakedData.forEach((user: User) => {
        if (!companyMap.has(user.companyName)) {
          companyMap.set(user.companyName, {
            name: user.companyName,
            userCount: 1,
            users: [user],
          })
        } else {
          const company = companyMap.get(user.companyName)!
          company.userCount++
          company.users.push(user)
        }
      })

      setCompanies(Array.from(companyMap.values()))
    } catch (error) {
      console.error("Error refreshing users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return { users, companies, isLoading, handleRefresh }
}

type SortDirection = 'asc' | 'desc'

export function useFilterSort(
  users: User[],
  companies: Company[],
  searchTerm: string,
  sortBy: keyof User | null,
  sortDirection: SortDirection
) {
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const sortedUsers = useMemo(() => {
    if (!sortBy) return filteredUsers
    
    return [...filteredUsers].sort((a, b) => {
      const valA = String(a[sortBy]).toLowerCase()
      const valB = String(b[sortBy]).toLowerCase()
      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredUsers, sortBy, sortDirection])

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [companies, searchTerm])

  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    })
  }, [filteredCompanies])

  return { 
    sortedUsers, 
    sortedCompanies, 
    filteredUsers, 
    filteredCompanies 
  }
}

export function usePagination(
  sortedUsers: User[],
  sortedCompanies: Company[],
  itemsPerPage: number,
  activeTab: string
) {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem)
  const currentCompanies = sortedCompanies.slice(indexOfFirstItem, indexOfLastItem)
  
  const totalPages = Math.ceil(
    (activeTab === "users" ? sortedUsers.length : sortedCompanies.length) / itemsPerPage
  )

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber)
  }

  return { 
    currentPage, 
    currentItems, 
    currentCompanies, 
    totalPages, 
    handlePageChange,
    setCurrentPage
  }
}


export function useUserInterface() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<string>("users")
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  const handleRowClick = (user: User): void => {
    setSelectedUser(user)
  }

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab)
  }

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen)
  }

  return {
    selectedUser,
    setSelectedUser,
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    handleRowClick,
    handleTabChange,
    toggleSidebar
  }
}

export function useExport(sortedUsers: User[]) {
  const exportAllUsers = (): void => {
    const userText = sortedUsers
      .map((user) => {
        return `ID: ${user.id}
        Name: ${user.name}
        Email: ${user.email}
        Company: ${user.companyName}
        Phone: ${user.phone}
        Website: ${user.website}
        Address: ${user.address}
        ---------------------------`
      })
      .join("\n\n")

    const blob = new Blob([userText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "user-directory-export.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return { exportAllUsers }
}
