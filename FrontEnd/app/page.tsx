"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, Database, MessageSquare } from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavigation } from "@/components/top-navigation"

interface QueryResult {
  sql: string
  results: Array<Record<string, any>>
  summary: string
}

export default function Dashboard() {
  const [question, setQuestion] = useState("")
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API calls with delays for demo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response - in real app, this would be API calls
      const mockResult: QueryResult = {
        sql: `SELECT city, COUNT(*) as metal_roof_count 
FROM properties p 
JOIN roof_materials rm ON p.id = rm.property_id 
WHERE rm.material_type = 'metal' 
GROUP BY city 
ORDER BY metal_roof_count DESC 
LIMIT 10;`,
        results: [
          { city: "Austin", metal_roof_count: 1247 },
          { city: "Phoenix", metal_roof_count: 1156 },
          { city: "Dallas", metal_roof_count: 1089 },
          { city: "Houston", metal_roof_count: 967 },
          { city: "San Antonio", metal_roof_count: 834 },
          { city: "Denver", metal_roof_count: 723 },
          { city: "Nashville", metal_roof_count: 656 },
          { city: "Atlanta", metal_roof_count: 589 },
        ],
        summary:
          "Based on the analysis, Austin leads with 1,247 metal roofs, followed by Phoenix (1,156) and Dallas (1,089). The data shows a strong preference for metal roofing in warmer climates, likely due to their energy efficiency and durability in extreme weather conditions.",
      }

      setQueryResult(mockResult)
    } catch (err) {
      setError("Failed to process your query. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setQueryResult(null)
    setQuestion("")
    setError(null)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavigation />

        <main className="flex-1 space-y-6 p-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Query Assistant</h1>
            <p className="text-muted-foreground">
              Ask questions about your building materials and roofing data in natural language
            </p>
          </div>

          {/* Query Input Section */}
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Ask Your Question
              </CardTitle>
              <CardDescription>
                Enter your question in plain English (e.g., "Which city has the most metal roofs?")
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Your Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Which city has the most metal roofs?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px] resize-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!question.trim() || isLoading}
                    className="transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Submit Query
                      </>
                    )}
                  </Button>
                  {queryResult && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearResults}
                      className="transition-all duration-200"
                    >
                      Clear Results
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive bg-destructive/5 animate-in slide-in-from-top-2 duration-300">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="animate-in slide-in-from-top-2 duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2 py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-muted-foreground">Analyzing your question and generating SQL...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {queryResult && !isLoading && (
            <div className="space-y-6 animate-in slide-in-from-top-2 duration-500">
              {/* Generated SQL */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Generated SQL Query
                  </CardTitle>
                  <CardDescription>The AI converted your question into this SQL query</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code className="language-sql">{queryResult.sql}</code>
                    </pre>
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      SQL
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Query Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Query Results</CardTitle>
                  <CardDescription>{queryResult.results.length} rows returned</CardDescription>
                </CardHeader>
                <CardContent>
                  {queryResult.results.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(queryResult.results[0]).map((key) => (
                              <TableHead key={key} className="font-semibold">
                                {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.results.map((row, index) => (
                            <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                              {Object.values(row).map((value, cellIndex) => (
                                <TableCell key={cellIndex}>
                                  {typeof value === "number" ? value.toLocaleString() : String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No results found for your query.</div>
                  )}
                </CardContent>
              </Card>

              {/* AI Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis Summary</CardTitle>
                  <CardDescription>Key insights from your query results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed">{queryResult.summary}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
