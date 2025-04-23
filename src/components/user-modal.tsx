"use client"

import { useState } from "react"
import { Download, Mail, MapPin, Phone, User, X, Globe, Building2, Copy, Check, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Button } from "./button"

interface UserType {
  id: number
  name: string
  email: string
  companyName: string
  phone: string
  website: string
  address: string
}

interface UserModalProps {
  user: UserType
  onClose: () => void
}

export default function UserModal({ user, onClose }: UserModalProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const exportUserData = () => {
    const userText = `User Details
      ===========
      ID: ${user.id}
      Name: ${user.name}
      Email: ${user.email}
      Company: ${user.companyName}
      Phone: ${user.phone}
      Website: ${user.website}
      Address: ${user.address}
`

    const blob = new Blob([userText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `user-${user.id}-${user.name.toLowerCase().replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose} role="button" tabIndex={0} aria-label="Close modal"></div>

      <div className="relative bg-[#0f172a] border border-[#1e293b]/70 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden z-10">
    
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

        <div className="absolute top-0 left-0 w-4 h-4 bg-cyan-500/20 rounded-br-lg"></div>
        <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500/20 rounded-bl-lg"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-purple-500/20 rounded-tr-lg"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-cyan-500/20 rounded-tl-lg"></div>

        <div className="flex justify-between items-center p-4 border-b border-[#1e293b]/50">
          <h2 className="text-lg font-medium text-white flex items-center">
            <User className="h-5 w-5 mr-2 text-cyan-500" />
            User Profile
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition rounded-full p-1 hover:bg-[#1e293b]/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-0">
          <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-5 border-b border-[#1e293b]/50">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg shadow-cyan-500/20">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <p className="text-cyan-400 text-sm">{user.email}</p>
                <p className="text-slate-400 text-sm mt-1">{user.companyName}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
            <div className="border-b border-[#1e293b]/50">
              <TabsList className="w-full bg-transparent h-auto p-0">
                <TabsTrigger
                  value="details"
                  className={`flex-1 py-3 rounded-none border-b-2 ${
                    activeTab === "details" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"
                  } data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className={`flex-1 py-3 rounded-none border-b-2 ${
                    activeTab === "contact" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"
                  } data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Contact
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className={`flex-1 py-3 rounded-none border-b-2 ${
                    activeTab === "company" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"
                  } data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Company
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="details" className="p-5 space-y-4 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">USER ID</div>
                  <div className="text-sm text-white bg-[#1e293b]/50 px-3 py-1 rounded-full border border-[#334155]/50">
                    {user.id}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">FULL NAME</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white bg-[#1e293b]/50 p-2 rounded border border-[#334155]/50 flex-1 mr-2">
                      {user.name}
                    </div>
                    <button
                      onClick={() => copyToClipboard(user.name, "name")}
                      className="p-2 bg-[#1e293b]/50 rounded border border-[#334155]/50 text-slate-400 hover:text-cyan-400"
                    >
                      {copied === "name" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">EMAIL ADDRESS</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-cyan-400 bg-[#1e293b]/50 p-2 rounded border border-[#334155]/50 flex-1 mr-2">
                      {user.email}
                    </div>
                    <button
                      onClick={() => copyToClipboard(user.email, "email")}
                      className="p-2 bg-[#1e293b]/50 rounded border border-[#334155]/50 text-slate-400 hover:text-cyan-400"
                    >
                      {copied === "email" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">ADDRESS</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white bg-[#1e293b]/50 p-2 rounded border border-[#334155]/50 flex-1 mr-2">
                      {user.address}
                    </div>
                    <button
                      onClick={() => copyToClipboard(user.address, "address")}
                      className="p-2 bg-[#1e293b]/50 rounded border border-[#334155]/50 text-slate-400 hover:text-cyan-400"
                    >
                      {copied === "address" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="p-5 space-y-4 mt-0">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-[#1e293b]/30 rounded-lg border border-[#334155]/30">
                  <Mail className="h-5 w-5 text-cyan-500 mr-3" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">EMAIL</div>
                    <div className="text-sm text-cyan-400">{user.email}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(user.email, "email-contact")}
                    className="p-1.5 bg-[#1e293b]/50 rounded border border-[#334155]/50 text-slate-400 hover:text-cyan-400"
                  >
                    {copied === "email-contact" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center p-3 bg-[#1e293b]/30 rounded-lg border border-[#334155]/30">
                  <Phone className="h-5 w-5 text-green-500 mr-3" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">PHONE</div>
                    <div className="text-sm text-white">{user.phone}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(user.phone, "phone")}
                    className="p-1.5 bg-[#1e293b]/50 rounded border border-[#334155]/50 text-slate-400 hover:text-cyan-400"
                  >
                    {copied === "phone" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center p-3 bg-[#1e293b]/30 rounded-lg border border-[#334155]/30">
                  <Globe className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">WEBSITE</div>
                    <div className="text-sm text-cyan-400">{user.website}</div>
                  </div>
                  <a
                    href={`http://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#1e293b]/50 rounded border border-[#334155]/50 text-slate-400 hover:text-cyan-400"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="flex items-center p-3 bg-[#1e293b]/30 rounded-lg border border-[#334155]/30">
                  <MapPin className="h-5 w-5 text-purple-500 mr-3" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">ADDRESS</div>
                    <div className="text-sm text-white">{user.address}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(user.address, "address-contact")}
                    className="p-1.5 bg-[#1e293b]/50 rounded border border-[#334155]/50 text-slate-400 hover:text-cyan-400"
                  >
                    {copied === "address-contact" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="company" className="p-5 space-y-4 mt-0">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-[#1e293b]/30 rounded-lg border border-[#334155]/30">
                  <Building2 className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <div className="text-xs text-slate-500">COMPANY NAME</div>
                    <div className="text-sm text-white">{user.companyName}</div>
                  </div>
                </div>

                <div className="p-3 bg-[#1e293b]/30 rounded-lg border border-[#334155]/30">
                  <div className="text-xs text-slate-500 mb-2">COMPANY DETAILS</div>
                  <div className="text-sm text-slate-300">
                    This is a placeholder for additional company information that would be available in a real
                    application. In a production environment, this could include company description, industry, number
                    of employees, etc.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-[#1e293b]/30 p-4 flex justify-between border-t border-[#1e293b]/50">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1e293b]/50 border-[#334155]/50 text-cyan-400 hover:bg-[#1e293b] hover:text-cyan-300 flex items-center gap-2"
            onClick={exportUserData}
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>

          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
            size="sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
