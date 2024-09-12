'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Mail, ThumbsUp, ThumbsDown, AlertCircle, LogOut, Search, Pause, Play, UserPlus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"

// Mock data (same as before)
const mockLeads = [
  { id: 1, name: 'John Doe', date: '2023-05-01', status: 'Ny', phone: '+4712345678', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', date: '2023-05-02', status: 'Ingen Svar', phone: '+4723456789', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', date: '2023-05-03', status: 'Ble Kunde', phone: '+4734567890', email: 'bob@example.com' },
  { id: 4, name: 'Alice Brown', date: '2023-05-04', status: 'Kjøpte Ikke', phone: '+4745678901', email: 'alice@example.com' },
  { id: 5, name: 'Charlie Wilson', date: '2023-05-05', status: 'Ny', phone: '+4756789012', email: 'charlie@example.com' },
]

const monthlyResults = [
  { date: '2023-05-01', leads: 20 },
  { date: '2023-05-08', leads: 25 },
  { date: '2023-05-15', leads: 30 },
  { date: '2023-05-22', leads: 28 },
  { date: '2023-05-29', leads: 35 },
]

const leadStatusData = [
  { name: 'Ny', value: 30 },
  { name: 'Ingen Svar', value: 20 },
  { name: 'Ble Kunde', value: 40 },
  { name: 'Kjøpte Ikke', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
  const [chartTimeframe, setChartTimeframe] = useState('weekly')
  const [isLeadsPaused, setIsLeadsPaused] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [selectedLocations, setSelectedLocations] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/user')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push('/login')
      }
    }
    checkAuth()

    // Fetch locations
    fetch('/location/locations.json')
      .then(response => response.json())
      .then(data => {
        setLocations(data.map(location => ({ value: location.name, label: location.name })))
      })
      .catch(error => console.error('Error fetching locations:', error))
  }, [router])

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a[sortBy].localeCompare(b[sortBy]))

  const totalLeads = mockLeads.length
  const estimatedBill = totalLeads * 150 // 150 NOK per lead

  const handleLogout = async () => {
    const response = await fetch('/api/logout', { method: 'POST' })
    if (response.ok) {
      router.push('/login')
    }
  }

  const norwegianMonths = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ]

  const formatChartData = (data, timeframe) => {
    if (timeframe === 'daily') {
      return data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
      }))
    } else {
      // Weekly aggregation
      const weeklyData = data.reduce((acc, item, index) => {
        if (index % 7 === 0) {
          acc.push({
            date: `Uke ${Math.floor(index / 7) + 1}`,
            leads: data.slice(index, index + 7).reduce((sum, d) => sum + d.leads, 0)
          })
        }
        return acc
      }, [])
      return weeklyData
    }
  }

  const chartData = formatChartData(monthlyResults, chartTimeframe)

  const handlePauseLeads = () => {
    setShowPauseDialog(true)
  }

  const confirmPauseLeads = () => {
    setIsLeadsPaused(!isLeadsPaused)
    setShowPauseDialog(false)
  }

  const currentDate = new Date().toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' })

  // Calculate the next month's 10th day for the expected invoice date
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setDate(10)
  const expectedInvoiceDate = nextMonth.toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' })

  const handleAddUser = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword, locations: selectedLocations }),
    })

    if (response.ok) {
      setShowAddUserDialog(false)
      setNewUsername('')
      setNewPassword('')
      setSelectedLocations([])
      // You might want to show a success message here
    } else {
      // Handle error (show error message)
    }
  }

  if (!user) {
    return <div>Laster...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-lg">Elektrolisten.no</span>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Velkommen, {user.username}</span>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logg ut
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Elektriker Kundeemne Dashboard</h1>
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Totale Kundeemner Denne Måneden</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalLeads}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Estimert Regning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{estimatedBill} NOK</p>
              <p className="text-sm text-gray-500 mt-1">Forventet faktura {expectedInvoiceDate}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Periode</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg måned" />
                </SelectTrigger>
                <SelectContent>
                  {norwegianMonths.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Admin Panel (only visible for superadmin) */}
        {user.role === 'superadmin' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowAddUserDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" /> Legg til ny bruker
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pause/Start Leads Component */}
        <Card className="mb-6">
          <CardContent className="flex items-center justify-between p-6">
            <Button
              variant={isLeadsPaused ? "outline" : "default"}
              onClick={handlePauseLeads}
            >
              {isLeadsPaused ? (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start leads
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause leads
                </>
              )}
            </Button>
            <span className="text-sm text-gray-600">
              Du er tildelt <span id="current-city" className="font-semibold">Oslo</span> med <span id="postal-code" className="font-semibold">20</span> postnummer
            </span>
          </CardContent>
        </Card>

        {/* Lead Management Table */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-8"
                  type="text"
                  placeholder="Søk kundeemner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sorter etter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Dato</SelectItem>
                  <SelectItem value="name">Navn</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Dato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{lead.name}</span>
                        <div className="flex space-x-2 text-gray-500">
                          <a href={`tel:${lead.phone}`}><Phone className="h-4 w-4" /></a>
                          <a href={`mailto:${lead.email}`}><Mail className="h-4 w-4" /></a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.date}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm"><ThumbsUp className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><ThumbsDown className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><AlertCircle className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Monthly Results Graph */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Kundeemner over tid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Select value={chartTimeframe} onValueChange={setChartTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Velg tidsramme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daglig</SelectItem>
                  <SelectItem value="weekly">Ukentlig</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Status Pie Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Kundeemne Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Antall</TableHead>
                      <TableHead>Prosent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadStatusData.map((status, index) => (
                      <TableRow key={index}>
                        <TableCell>{status.name}</TableCell>
                        <TableCell>{status.value}</TableCell>
                        <TableCell>
                          {((status.value / leadStatusData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pause Leads Confirmation Dialog */}
      <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekreft pause av leads</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil {isLeadsPaused ? 'starte' : 'pause'} leads? 
              {isLeadsPaused 
                ? ' Du vil begynne å motta leads igjen.' 
                : ` Du vil ikke få flere leads fra og med ${currentDate}, men du kan starte opp igjen når du ønsker.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPauseDialog(false)}>Nei</Button>
            <Button onClick={confirmPauseLeads}>
              {isLeadsPaused ? 'Ja, start leads' : 'Ja, pause leads'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}