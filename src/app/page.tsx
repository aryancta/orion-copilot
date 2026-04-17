import Link from "next/link"
import { ArrowRight, BarChart3, FileText, Zap, CheckCircle, Clock, TrendingUp, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">Orion Copilot</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </Link>
            <Button asChild variant="gradient">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Turn messy documents into{" "}
              <span className="text-gradient">clear actions</span> in seconds
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              AI workflow assistant that automatically analyzes documents, extracts action items, 
              and provides structured insights for operations teams, administrators, and support staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="gradient" className="text-lg px-8 py-6">
                <Link href="/dashboard">
                  Start Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link href="/analytics">
                  View Analytics
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">12.4hrs</div>
              <div className="text-sm text-muted-foreground">Time saved per week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">94%</div>
              <div className="text-sm text-muted-foreground">Accuracy rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2.5s</div>
              <div className="text-sm text-muted-foreground">Average analysis time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful AI workflow automation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform unstructured documents into actionable insights with enterprise-grade AI analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Intelligent Document Analysis</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Automatically extract summaries, action items, and key insights from PDFs, Word docs, 
                  and text. Understand context, priority, and risk in seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Real-time Analytics</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Track processing trends, priority distributions, and impact metrics. 
                  Measure time saved and demonstrate ROI with comprehensive dashboards.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Audit Trail & Trust</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Every decision is explainable with detailed audit trails. See exactly why the AI 
                  made recommendations with transparent confidence scoring.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">From chaos to clarity</h2>
            <p className="text-xl text-muted-foreground">See how Orion Copilot transforms your workflow</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Before */}
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-400 mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Before</h3>
                <p className="text-muted-foreground">Manual document processing</p>
              </div>
              
              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Manually read every document and email</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Inconsistent prioritization and categorization</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Missed deadlines and follow-ups</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <span className="text-sm">No visibility into processing metrics</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Cognitive overload with high volume</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* After */}
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400 mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">After</h3>
                <p className="text-muted-foreground">AI-powered automation</p>
              </div>
              
              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Instant analysis and summarization</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Consistent AI-driven priority scoring</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Automated action item extraction</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Real-time analytics and reporting</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Focus on high-impact decision making</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-card/30">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to transform your workflow?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams already saving hours every week with AI-powered document analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="gradient" className="text-lg px-8 py-6">
                <Link href="/dashboard">
                  Start Free Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No signup required • Full demo with sample data • Built for hackathon showcase
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-6 w-6 items-center justify-center rounded gradient-primary">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold">Orion Copilot</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built by <span className="font-medium text-foreground">Aryan Choudhary</span> • Hackathon Project 2024
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}