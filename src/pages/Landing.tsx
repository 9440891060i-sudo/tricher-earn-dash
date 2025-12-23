import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  UserPlus, 
  Share2, 
  DollarSign, 
  Percent, 
  Trophy, 
  Zap, 
  HeadphonesIcon,
  ArrowRight,
  Star
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free partner account in seconds"
  },
  {
    icon: Share2,
    title: "Share Your Code",
    description: "Create custom discount codes and share with your audience"
  },
  {
    icon: DollarSign,
    title: "Earn Commissions",
    description: "Get paid for every sale made with your code"
  }
];

const features = [
  {
    icon: Percent,
    title: "Flexible Commissions",
    description: "Split 25% total margin between your commission and customer discount. You decide the split."
  },
  {
    icon: Trophy,
    title: "Partner Leaderboard",
    description: "Compete with other partners and climb the ranks. Top performers get exclusive rewards."
  },
  {
    icon: Zap,
    title: "Fast Payouts",
    description: "Request payouts anytime. We process payments quickly and reliably."
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Get help whenever you need it. Our support team is here for you."
  }
];

const leaderboardData = [
  { rank: 1, name: "Sarah K.", sales: 342, earnings: "$8,550" },
  { rank: 2, name: "Mike R.", sales: 289, earnings: "$7,225" },
  { rank: 3, name: "Emma T.", sales: 256, earnings: "$6,400" },
  { rank: 4, name: "James L.", sales: 198, earnings: "$4,950" },
  { rank: 5, name: "Lisa M.", sales: 167, earnings: "$4,175" },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
                Earn by Referring.{" "}
                <span className="text-accent">Track Everything.</span>{" "}
                Get Paid.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Join our partner program and start earning commissions on every referral. 
                Create custom discount codes, track your performance, and get paid fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup">
                    Join as Partner
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start earning in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div 
                  key={step.title}
                  className="relative bg-background rounded-xl p-6 border border-border text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 mt-2">
                    <step.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Partners</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to maximize your earnings
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="p-6 rounded-xl border border-border hover:border-accent/50 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Commission Explainer */}
            <div className="mt-16 bg-secondary/50 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">The 25% Total Margin</h3>
                <p className="text-muted-foreground">
                  You control how to split 25% between your commission and customer discount
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-background rounded-xl border border-border">
                  <div className="text-3xl font-bold text-accent mb-1">15%</div>
                  <div className="text-sm text-muted-foreground">Your Commission</div>
                </div>
                <div className="p-4 bg-background rounded-xl border border-border flex items-center justify-center">
                  <span className="text-2xl font-bold">+</span>
                </div>
                <div className="p-4 bg-background rounded-xl border border-border">
                  <div className="text-3xl font-bold text-accent mb-1">10%</div>
                  <div className="text-sm text-muted-foreground">Customer Discount</div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Example: Give customers 10% off and keep 15% commission
              </p>
            </div>
          </div>
        </section>

        {/* Leaderboard Preview */}
        <section id="leaderboard" className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Partners</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Join our community of successful partners
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-background rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-secondary/50 text-sm font-medium text-muted-foreground">
                <div>Rank</div>
                <div>Partner</div>
                <div className="text-right">Sales</div>
                <div className="text-right">Earnings</div>
              </div>
              {leaderboardData.map((partner, index) => (
                <div 
                  key={partner.rank}
                  className="grid grid-cols-4 gap-4 p-4 border-t border-border items-center"
                >
                  <div className="flex items-center gap-2">
                    {partner.rank <= 3 ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        partner.rank === 1 ? "bg-yellow-100 text-yellow-600" :
                        partner.rank === 2 ? "bg-gray-100 text-gray-600" :
                        "bg-orange-100 text-orange-600"
                      }`}>
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                        {partner.rank}
                      </div>
                    )}
                  </div>
                  <div className="font-medium">{partner.name}</div>
                  <div className="text-right text-muted-foreground">{partner.sales}</div>
                  <div className="text-right font-semibold text-accent">{partner.earnings}</div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/leaderboard">View Full Leaderboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of partners already earning with Tricher
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Become a Partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
