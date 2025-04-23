import NavItem from "./nav-item"
import { useEffect, useState } from "react"
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  Menu,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react"
import {useUserData, useFilterSort, usePagination, useUserInterface, useExport } from '../hooks/user-tweak'
import { Badge } from "./badge"
import UserModal from "./user-modal"
import { Button } from "./button"
import { useIsMobile } from "../hooks/use-mobile"
import { useSort } from "../hooks/helper"
const apiUrl = import.meta.env.VITE_USER_URL
export default function UserDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const { sortBy, sortDirection, handleSort, renderSortIcon } = useSort("name")
  const isMobile = useIsMobile()
  const { users, companies, isLoading, handleRefresh } = useUserData(apiUrl)
  const [itemsPerPage] = useState(5)
  const { sortedUsers, sortedCompanies,filteredCompanies, filteredUsers } = useFilterSort(users, companies, searchTerm, sortBy, sortDirection)
  const { selectedUser, activeTab, sidebarOpen, handleRowClick, handleTabChange, toggleSidebar,setSidebarOpen, setSelectedUser } = useUserInterface()
  const { currentPage, currentItems, currentCompanies, totalPages, handlePageChange} = 
  usePagination(sortedUsers, sortedCompanies, itemsPerPage, activeTab)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage 
  const { exportAllUsers } = useExport(sortedUsers)

  useEffect(()=> {
    handleRefresh()
  },[])
 
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  return (
    <div className="flex h-screen bg-[#0a0f1a] text-slate-100 overflow-hidden">
 
      <div
        className={`fixed md:relative z-20 h-screen bg-[#0f172a] border-r border-[#1e293b]/50 transition-all duration-300 ${
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-16"
        }`}
      >
        <div className="p-4 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2 py-2">
                <Users className="h-5 w-5 text-cyan-500" />
                <span>NEXUS OS</span>
              </div>
            ) : (
              <div className="w-full flex justify-center py-2">
                <Users className="h-5 w-5 text-cyan-500" />
              </div>
            )}

            {isMobile && sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#1e293b]/50"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <nav className="space-y-1 mt-8">
            <NavItem icon={Users} label="User Directory" active showLabel={sidebarOpen} />
          </nav>
        </div>
      </div>

      {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/50 z-10" onClick={toggleSidebar}></div>}

      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="bg-[#0f172a] border-b border-[#1e293b]/50 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-3 text-slate-400 hover:text-cyan-400 p-1.5 rounded-md hover:bg-[#1e293b]/50"
            >
              <Menu className="h-5 w-5" />
            </button>
            {activeTab === "users" ? (
              <Users className="h-5 w-5 text-cyan-500 mr-2" />
            ) : (
              <Building2 className="h-5 w-5 text-blue-500 mr-2" />
            )}
            <h1 className="text-xl font-medium">{activeTab === "users" ? "User Directory" : "Company Directory"}</h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex">
            <Button
              variant="outline"
              size="sm"
              className="bg-[#1e293b]/50 hidden border-[#334155]/50 text-cyan-400 hover:bg-[#1e293b] hover:text-cyan-300 items-center gap-2"
              onClick={exportAllUsers}
            >
              <Download className="h-4 w-4" />
              Export Users
            </Button>
            </div>
            <Badge
              variant="outline"
              className="bg-[#1e293b]/50 text-cyan-400 border-cyan-500/50 text-xs hidden sm:flex"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
              LIVE
            </Badge>
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-full bg-[#1e293b]/50 text-slate-400 hover:text-cyan-400 transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-[#0a0f1a] to-[#131c2e]">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder={activeTab === "users" ? "Search by name or email..." : "Search by company name..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md bg-[#1e293b]/70 border border-[#334155]/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
              />
            </div>
            <div className="sm:ml-4 text-sm text-slate-400">
              {activeTab === "users" ? (
                <>
                  {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
                </>
              ) : (
                <>
                  {filteredCompanies.length} {filteredCompanies.length === 1 ? "company" : "companies"} found
                </>
              )}
            </div>
            <div className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                className="bg-[#1e293b]/50 border-[#334155]/50 text-cyan-400 hover:bg-[#1e293b] hover:text-cyan-300 flex items-center gap-2 w-full"
                onClick={exportAllUsers}
              >
                <Download className="h-4 w-4" />
                Export Users
              </Button>
            </div>
          </div>

          <div className="bg-[#0f172a]/70 rounded-lg border border-[#1e293b]/50 overflow-hidden backdrop-blur-sm">
            <div className="flex border-b border-[#1e293b]/50">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "users"
                    ? "bg-[#1e293b] text-cyan-400 border-b-2 border-cyan-500"
                    : "text-slate-400 hover:text-slate-300"
                }`}
                onClick={() => handleTabChange("users")}
              >
                Users
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "companies"
                    ? "bg-[#1e293b] text-cyan-400 border-b-2 border-cyan-500"
                    : "text-slate-400 hover:text-slate-300"
                }`}
                onClick={() => handleTabChange("companies")}
              >
                Companies
              </button>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1e293b]/70 border-b border-[#334155]/50 text-left">
                      {activeTab === "users" ? (
                        <>
                          <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Website
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Address
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Company Name
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Employees
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/30">
                    {Array(itemsPerPage)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-[#1e293b]/70 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-[#1e293b]/50 rounded w-1/4"></div>
                          </td>
                          {activeTab === "users" ? (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-[#1e293b]/70 rounded w-full"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-[#1e293b]/70 rounded w-2/3"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-[#1e293b]/70 rounded w-3/4"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-[#1e293b]/70 rounded w-1/2"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-[#1e293b]/70 rounded w-full"></div>
                              </td>
                            </>
                          ) : (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-[#1e293b]/70 rounded w-1/4"></div>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : activeTab === "users" ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1e293b]/70 border-b border-[#334155]/50 text-left">
                      <th
                        onClick={() => handleSort("name")}
                        className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition"
                      >
                        <div className="flex items-center">Name {renderSortIcon("name")}</div>
                      </th>
                      <th
                        onClick={() => handleSort("email")}
                        className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition"
                      >
                        <div className="flex items-center">Email {renderSortIcon("email")}</div>
                      </th>
                      <th
                        onClick={() => handleSort("companyName")}
                        className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition"
                      >
                        <div className="flex items-center">Company {renderSortIcon("companyName")}</div>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Website</th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/30">
                    {currentItems.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => handleRowClick(user)}
                        className="cursor-pointer transition duration-200 hover:bg-[#1e293b]/30"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-xs text-slate-500">ID: {user.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-cyan-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-400">{user.companyName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`http://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-cyan-400 hover:underline"
                          >
                            {user.website}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{user.address}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1e293b]/70 border-b border-[#334155]/50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Employees
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/30">
                    {currentCompanies.map((company) => (
                      <tr key={company.name} className="transition duration-200 hover:bg-[#1e293b]/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-400">{company.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Badge className="bg-[#1e293b]/70 text-cyan-400 border-cyan-500/50">
                              {company.userCount}
                            </Badge>
                            <span className="ml-2 text-sm text-slate-400">
                              {company.userCount === 1 ? "employee" : "employees"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {!isLoading && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 bg-[#1e293b]/30 border-t border-[#1e293b]/50 gap-4">
                <div className="text-sm text-slate-400">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, activeTab === "users" ? sortedUsers.length : sortedCompanies.length)} of{" "}
                  {activeTab === "users" ? sortedUsers.length : sortedCompanies.length}{" "}
                  {activeTab === "users" ? "users" : "companies"}
                </div>
                <div className="flex items-center justify-center sm:justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-[#1e293b]/50 border-[#334155]/50 text-slate-400 hover:text-cyan-400 hover:bg-[#1e293b]"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "h-8 w-8 p-0 bg-cyan-600 hover:bg-cyan-700 text-white"
                          : "h-8 w-8 p-0 bg-[#1e293b]/50 border-[#334155]/50 text-slate-400 hover:text-cyan-400 hover:bg-[#1e293b]"
                      }
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-[#1e293b]/50 border-[#334155]/50 text-slate-400 hover:text-cyan-400 hover:bg-[#1e293b]"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  )
}